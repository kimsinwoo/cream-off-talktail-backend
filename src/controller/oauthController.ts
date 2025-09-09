import { Request, Response } from "express";
import { getAccessToken, getUserInfo, findOrCreateUser, loginOrSignUp } from "../services/oauthService";
import { signToken } from "../utils/jwt";
import { OAuthProvider, OAUTH_CONFIG } from "../config/oauthConfig";

export const socialLogin = (req: Request, res: Response) => {
  const provider = req.query.provider as OAuthProvider;

  if (!provider || !OAUTH_CONFIG[provider]) {
    return res.status(400).json({ message: "지원하지 않는 OAuth Provider입니다." });
  }

  const config = OAUTH_CONFIG[provider];

  let authUrl = "";
  let scope = "";
  if (provider === "kakao") {
    authUrl = "https://kauth.kakao.com/oauth/authorize";
    scope = "profile_nickname profile_image account_email"; 
  } else if (provider === "google") {
    authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    scope = "openid email profile"; 
  } else if (provider === "naver") {
    authUrl = "https://nid.naver.com/oauth2.0/authorize";
    scope = "name email phone"; 
  }

  const redirectUrl = `${authUrl}?client_id=${config.client_id}&redirect_uri=${encodeURIComponent(
    config.redirect_uri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  res.redirect(redirectUrl);
};

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as OAuthProvider;
    const code = req.query.code as string;

    if (!provider || !code) {
      return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    const { user, token } = await loginOrSignUp(provider, code);

    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OAuth 로그인 중 오류 발생" });
  }
};