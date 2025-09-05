import dotenv from "dotenv";

dotenv.config();

export type OAuthType = "kakao" | "google" | "naver";

export interface OAuthConfig {
  url: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export const OAUTH_CONFIG: Record<OAuthType, OAuthConfig> = {
  kakao: {
    url: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    userInfoUrl: "https://kapi.kakao.com/v2/user/me",
    client_id: process.env.KAKAO_CLIENT_ID!,
    client_secret: process.env.KAKAO_CLIENT_SECRET!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    scope: "profile_image profile_nickname",
  },
  google: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    scope: "email profile",
  },
  naver: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    userInfoUrl: "https://openapi.naver.com/v1/nid/me",
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    redirect_uri: process.env.NAVER_REDIRECT_URI!,
    scope: "profile",
  },
};
