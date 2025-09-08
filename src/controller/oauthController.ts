import { Request, Response } from "express";
import { getAccessToken, getUserInfo, findOrCreateUser } from "../services/oauthService";
import { signToken } from "../utils/jwt";
import { OAuthProvider, OAUTH_CONFIG } from "../config/oauthConfig";

// 1️⃣ 소셜 로그인 화면으로 이동
export const socialLogin = (req: Request, res: Response) => {
  const provider = req.query.provider as OAuthProvider;

  if (!provider || !OAUTH_CONFIG[provider]) {
    return res.status(400).json({ message: "지원하지 않는 OAuth Provider입니다." });
  }

  const config = OAUTH_CONFIG[provider];

  // provider별 authUrl 및 scope 설정
  let authUrl = "";
  let scope = "";
  if (provider === "kakao") {
    authUrl = "https://kauth.kakao.com/oauth/authorize";
    scope = "profile_nickname profile_image account_email"; // 필드에 맞게
  } else if (provider === "google") {
    authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    scope = "openid email profile"; // 필드에 맞게
  } else if (provider === "naver") {
    authUrl = "https://nid.naver.com/oauth2.0/authorize";
    scope = "name email phone"; // 필드에 맞게
  }

  const redirectUrl = `${authUrl}?client_id=${config.client_id}&redirect_uri=${encodeURIComponent(
    config.redirect_uri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  res.redirect(redirectUrl);
};


// 2️⃣ 콜백 처리: 인가코드로 토큰 발급
export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as OAuthProvider;
    const code = req.query.code as string;

    if (!code) return res.status(400).json({ message: "code가 없습니다." });

    // 1️⃣ Access Token 발급
    const accessToken = await getAccessToken(provider, code);

    // 2️⃣ provider별 User Info 가져오기
    const oauthUser = await getUserInfo(provider, accessToken);

    // 3️⃣ Prisma로 User 찾거나 생성
    const user = await findOrCreateUser(oauthUser);

    // 4️⃣ JWT 발급
    const token = signToken({ id: user.id, email: user.email });

    res.json({ token, user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "OAuth 처리 중 오류가 발생했습니다.", error: err.message });
  }
};