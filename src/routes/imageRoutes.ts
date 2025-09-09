import { Router } from "express";
import { upload, handleUpload } from "../controller/imageController";

const router = Router();

// 복수 파일 업로드: original, croped
// form-data:
// - diseaseCode: "A3"
// - userName: "user123"
// - original: 파일
// - croped: 파일
router.post(
  "/image",
  upload.fields([
    { name: "original", maxCount: 1 },
    { name: "croped", maxCount: 1 }
  ]),
  handleUpload
)

export default router;
