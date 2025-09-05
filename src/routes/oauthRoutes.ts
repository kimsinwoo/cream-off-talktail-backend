import { Router } from "express";
import { loginOAuth, oauthCallback } from "../controller/oauthController";

const router = Router();

router.get("/login", loginOAuth); // /oauth/login?type=kakao
router.get("/:type/callback", oauthCallback); // /oauth/kakao/callback

export default router;
