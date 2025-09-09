import { Router } from "express";
import { oauthCallback, socialLogin } from "../controller/oauthController";

const router = Router();

router.get("/login", socialLogin);

router.get("/:provider/callback", oauthCallback);

export default router;
