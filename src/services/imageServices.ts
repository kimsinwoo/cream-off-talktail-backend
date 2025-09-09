import fs from "fs";
import path from "path";

// 폴더가 없으면 생성
export const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// 업로드 경로 반환
export const getUploadPath = (
  diseaseCode: string, // ex: "A3"
  type: "original" | "croped"
) => {
  const basePath = path.join(__dirname, "../../public/image", diseaseCode);

  const originalPath = path.join(basePath, "original");
  const cropPath = path.join(basePath, "croped");

  // 폴더 생성
  ensureFolderExists(originalPath);
  ensureFolderExists(cropPath);

  return type === "croped" ? cropPath : originalPath;
};

// 파일명 생성
export const generateFileName = (
  userName: string,
  type: "original" | "croped",
  originalName: string
) => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:.]/g, "");
  const ext = path.extname(originalName) || ".jpg";
  return `${userName}_${timestamp}_${type}${ext}`;
};
