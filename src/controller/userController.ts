
import { Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma";
import { JwtPayload } from "jsonwebtoken";

// JWT에서 userId를 안전하게 추출하는 헬퍼 함수
function getUserIdFromDecoded(decoded: string | JwtPayload | null): number | null {
  if (!decoded) return null;
  if (typeof decoded === "string") return null;
  if ("userId" in decoded && typeof decoded.userId === "number") {
    return decoded.userId;
  }
  return null;
}

// 모든 함수에서 인증이 되었을 때만 동작하도록 구현

export const userInfo = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = verifyToken(token ?? "");
  const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    return res.json({ message: "유저 정보 조회 성공", user });
  } catch (err) {
    return res.status(500).json({ message: "유저 정보 조회 중 오류 발생" });
  }
};

export const userInfoUpdate = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const { name, profileImage, phone } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(profileImage && { profileImage }),
        ...(phone && { phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        phone: true,
        updatedAt: true,
      },
    });

    return res.json({ message: "유저 정보 수정 성공", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "유저 정보 수정 중 오류 발생" });
  }
};

export const pet = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  try {
    const pets = await prisma.pet.findMany({
      where: { masterId: userId },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        weight: true,
        profile: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ message: "펫 정보 조회 성공", pets });
  } catch (err) {
    return res.status(500).json({ message: "펫 정보 조회 중 오류 발생" });
  }
};

export const petInsert = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);
    

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const { name, species, age, gender, weight, profile } = req.body;

  if (!name || !species) {
    return res.status(400).json({ message: "필수 펫 정보가 누락되었습니다." });
  }

  try {
    const newPet = await prisma.pet.create({
      data: {
        masterId: userId,
        name,
        age,
        gender,
        weight,
        profile,
      },
    });

    return res.json({ message: "펫 등록 성공", pet: newPet });
  } catch (err) {
    return res.status(500).json({ message: "펫 등록 중 오류 발생" });
  }
};

export const petUpdate = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const { petId, name, species, age, gender, weight, profileImage } = req.body;

  if (!petId) {
    return res.status(400).json({ message: "펫 ID가 필요합니다." });
  }

  try {
    // 본인 소유의 펫인지 확인
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet || pet.masterId !== userId) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        ...(name && { name }),
        ...(species && { species }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(weight && { weight }),
        ...(profileImage && { profileImage }),
      },
    });

    return res.json({ message: "펫 정보 수정 성공", pet: updatedPet });
  } catch (err) {
    return res.status(500).json({ message: "펫 정보 수정 중 오류 발생" });
  }
};

export const petDelete = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const { petId } = req.body;

  if (!petId) {
    return res.status(400).json({ message: "펫 ID가 필요합니다." });
  }

  try {
    // 본인 소유의 펫인지 확인
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet || pet.masterId !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    return res.json({ message: "펫 삭제 성공" });
  } catch (err) {
    return res.status(500).json({ message: "펫 삭제 중 오류 발생" });
  }
};

export const myRecord = async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(token ?? "");
        const userId = getUserIdFromDecoded(decoded);

  if (!userId) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  try {
    // 예시: userId로 기록(Record) 테이블에서 조회
    const records = await prisma.record.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ message: "기록 조회 성공", records });
  } catch (err) {
    return res.status(500).json({ message: "기록 조회 중 오류 발생" });
  }
};