import { Request, Response } from "express";
import { OAuthType, OAUTH_CONFIG } from "../config/oauthConfig";
import { getAccessToken, getUserInfo, findOrCreateUser } from "../services/oauthService";
import { signToken } from "../utils/jwt";

export const loginOAuth = (req: Request, res: Response) => {
  const type = req.query.type as OAuthType;
  if (!type || !OAUTH_CONFIG[type]) return res.status(400).json({ message: "지원하지 않는 로그인 타입입니다." });
  const config = OAUTH_CONFIG[type];
  const url = `${config.url}?client_id=${config.client_id}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&response_type=code&scope=${encodeURIComponent(config.scope)}`;
  res.redirect(url);
};

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const type = req.params.type as OAuthType;
    const code = req.query.code as string;
    const config = OAUTH_CONFIG[type];

    const accessToken = await getAccessToken(code, config);
    const oauthUser = await getUserInfo(accessToken, config);

    const email =
      type === "kakao"
        ? oauthUser.kakao_account?.email
        : type === "google"
        ? oauthUser.email
        : oauthUser.response?.email;

    const name =
      type === "kakao"
        ? oauthUser.kakao_account?.profile?.nickname
        : type === "google"
        ? oauthUser.name
        : oauthUser.response?.name;

    const profileImage =
      type === "kakao"
        ? oauthUser.kakao_account?.profile?.profile_image_url
        : type === "google"
        ? oauthUser.picture
        : oauthUser.response?.profile_image;

    const user = await findOrCreateUser(email!, name!, profileImage);

    const token = signToken({ id: user.Id, email: user.Email });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OAuth 처리 중 오류가 발생했습니다." });
  }
};
