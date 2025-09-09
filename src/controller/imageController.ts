import { Request, Response } from "express";
import multer from "multer";
import { getUploadPath, generateFileName } from "../services/imageServices";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import prisma from "../config/prisma";

// Multer storage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { diseaseCode } = req.body;
    const type = file.fieldname === "original" ? "original" : "croped";
    const savePath = getUploadPath(diseaseCode, type);
    cb(null, savePath);
  },
  filename: (req, file, cb) => {
    const { userName } = req.body;
    const type = file.fieldname === "original" ? "original" : "croped";
    const fileName = generateFileName(userName, type, file.originalname);
    cb(null, fileName);
  },
});

export const upload = multer({ storage });

// 업로드 처리
export const handleUpload = async (req: Request, res: Response) => {
  try {
    // req.files 타입 지정
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
    }

    // croped 파일이 있으면 AI 서버에 전송
    if (files["croped"] && files["croped"].length > 0) {
      const cropedFile = files["croped"][0];

      const formData = new FormData();
      formData.append("file", fs.createReadStream(cropedFile.path));

      const response = await axios.post(
        "http://175.106.99.173:8080/predict",
        
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      console.log("AI 서버 응답:", response.data);

      await prisma.image.create({
        data : {
          cropedImage: cropedFile.path,
          predictedClass: response.data.predicted_class,
          confidence: response.data.confidence,
          classIndex: response.data.class_index
        }
      })
    }

    // 업로드된 파일 경로 반환
    const filePaths: string[] = [];
    for (const key in files) {
      files[key].forEach((file) => filePaths.push(file.path));
    }

    return res.status(200).json({
      message: "파일 업로드 성공",
      files: filePaths,
    });
  } catch (error) {
    console.error("업로드 처리 중 오류:", error);
    return res.status(500).json({ message: "업로드 실패", error });
  }
};
