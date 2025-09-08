import { Router } from "express";
import { oauthCallback, socialLogin } from "../controller/oauthController";

const router = Router();

// 1️⃣ 소셜 로그인 화면으로 이동
router.get("/login", socialLogin);

// 2️⃣ OAuth 콜백 처리 (인가코드로 토큰 발급)
router.get("/:provider/callback", oauthCallback);

export default router;
