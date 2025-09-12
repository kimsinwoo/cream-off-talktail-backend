import { Request, Response } from "express";
import multer from "multer";
import { getUploadPath, generateFileName } from "../services/imageServices";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import prisma from "../config/prisma";
import path from "path";

// Multer 임시 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join("uploads", "tmp");
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const { userName } = req.body;
    const type = file.fieldname === "original" ? "original" : "croped";
    const fileName = generateFileName(userName, type, file.originalname);
    cb(null, fileName);
  },
});

export const upload = multer({ storage });

export const handleUpload = async (req: Request, res: Response) => {
  const { age, breed, itchiness, smell, alopecia, lesionSites } = req.body;

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }

    const cropedFile = files["croped"]?.[0];
    const originalFile = files["original"]?.[0];

    if (!cropedFile) {
      return res.status(404).json({ message: "croped 파일이 필요합니다." });
    }

    // AI 서버에 croped 파일 전송
    const formData = new FormData();
    formData.append("file", fs.createReadStream(cropedFile.path));

    const response = await axios.post(
      "http://175.106.99.173:8080/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (response.data.predicted_class === "person") {
      return res
        .status(403)
        .json({
          message: "사람을 인식 했습니다.",
          errorCode: "HUMAN_DETECTED",
        });
    }

    if (!response.data || !response.data.predicted_class) {
      return res
        .status(500)
        .json({ message: "AI 서버에서 올바른 응답이 없습니다." });
    }

    const predictedClass = response.data.predicted_class;
    const confidence = response.data.confidence;
    const classIndex = response.data.class_index;

    // AI 예측값 기반 최종 저장 폴더
    const finalCropPath = getUploadPath(predictedClass, "croped");
    if (!fs.existsSync(finalCropPath))
      fs.mkdirSync(finalCropPath, { recursive: true });

    const finalOriginalPath = originalFile
      ? getUploadPath(predictedClass, "original")
      : null;
    if (finalOriginalPath && !fs.existsSync(finalOriginalPath))
      fs.mkdirSync(finalOriginalPath, { recursive: true });

    // 파일 이동
    const finalCropFilePath = path.join(finalCropPath, cropedFile.filename);
    fs.renameSync(cropedFile.path, finalCropFilePath);

    let finalOriginalFilePath = null;
    if (originalFile) {
      finalOriginalFilePath = path.join(
        finalOriginalPath!,
        originalFile.filename
      );
      fs.renameSync(originalFile.path, finalOriginalFilePath);
    }

    // DB 저장
    await prisma.image.create({
      data: {
        cropedImage: finalCropFilePath,
        predictedClass,
        confidence,
        classIndex,
      },
    });

    const { A1, A2, A3, A4, A5, A6 } = response.data.all_predict;
    const image_path = finalCropFilePath;

    // 방금 생성한 이미지의 id를 가져옴
    const createdImage = await prisma.image.create({
      data: {
        cropedImage: finalCropFilePath,
        predictedClass,
        confidence,
        classIndex,
      },
    });

    await prisma.debuging.create({
      data: {
        a1: A1,
        a2: A2,
        a3: A3,
        a4: A4,
        a5: A5,
        a6: A6,
        imagePath: image_path,
        Image: {
          connect: { id: createdImage.id },
        },
      },
    });

    return res.status(200).json({
      message: "파일 업로드 성공",
      data: response.data,
    });
  } catch (error) {
    console.error("업로드 처리 중 오류:", error);
    return res.status(500).json({ message: "업로드 실패", error });
  }
};

export const debuging = () => {};

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: 이미지 업로드 및 AI 진단
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               croped:
 *                 type: string
 *                 format: binary
 *                 description: 크롭된 이미지 파일
 *               original:
 *                 type: string
 *                 format: binary
 *                 description: 원본 이미지 파일 (선택)
 *               userName:
 *                 type: string
 *                 description: 사용자의 이름
 *                 example: "홍길동"
 *               age:
 *                 type: integer
 *                 description: 나이
 *                 example: 3
 *               breed:
 *                 type: string
 *                 description: 품종
 *                 example: "Golden Retriever"
 *               itchiness:
 *                 type: string
 *                 description: 가려움 수준
 *                 example: "보통"
 *               smell:
 *                 type: boolean
 *                 description: 냄새 여부
 *                 example: false
 *               alopecia:
 *                 type: boolean
 *                 description: 탈모 여부
 *                 example: false
 *               lesionSites:
 *                 type: string
 *                 description: 병변 위치
 *                 example: "앞다리, 배"
 *     responses:
 *       200:
 *         description: 파일 업로드 성공 및 AI 예측 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "파일 업로드 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     predicted_class:
 *                       type: string
 *                       example: "A3"
 *                     confidence:
 *                       type: string
 *                       example: "1.0000"
 *                     class_index:
 *                       type: integer
 *                       example: 2
 *                     all_predict:
 *                       type: object
 *                       properties:
 *                         A1:
 *                           type: number
 *                           example: 0.00000096
 *                         A2:
 *                           type: number
 *                           example: 0.00000029
 *                         A3:
 *                           type: number
 *                           example: 0.999987
 *                         A4:
 *                           type: number
 *                           example: 0.00000051
 *                         A5:
 *                           type: number
 *                           example: 0.00000269
 *                         A6:
 *                           type: number
 *                           example: 0.00000828
 *       400:
 *         description: 파일이 업로드되지 않음
 *       403:
 *         description: 사람 감지로 차단됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "사람을 인식 했습니다."
 *                 errorCode:
 *                   type: string
 *                   example: "HUMAN_DETECTED"
 *       404:
 *         description: croped 파일 없음
 *       500:
 *         description: 서버 또는 AI 처리 오류
 */

/**
 * @swagger
 * /upload/debuging:
 *   get:
 *     summary: AI 사진 데이터 확인
 *     tags:
 *       - Upload
 *     responses:
 *       200:
 *         description: 데이터 불러오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "데이터 불러오기 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     all_predict:
 *                       type: object
 *                       properties:
 *                         A1:
 *                           type: number
 *                           example: 0.90201304
 *                         A2:
 *                           type: number
 *                           example: 0.02205039
 *                         A3:
 *                           type: number
 *                           example: 0.73472039
 *                         A4:
 *                           type: number
 *                           example: 0.20313445
 *                         A5:
 *                           type: number
 *                           example: 0.60482339
 *                         A6:
 *                           type: number
 *                           example: 0.00000002
 *                     image_path:
 *                       type: string
 *                       example: "C:\\Users\\khcst\\OneDrive\\문서\\새 폴더\\skinImagingDiagnosisBackEnd\\public\\image\\A3\\croped\\undefined_20250912T061729438Z_croped.jpg"
 *                     predict_class:
 *                       type: string
 *                       example: "A3"
 *       400:
 *         description: 파일이 업로드되지 않음
 *       403:
 *         description: 사람 감지로 차단됨
 *       404:
 *         description: croped 파일 없음
 *       500:
 *         description: 서버 또는 AI 처리 오류
 */

