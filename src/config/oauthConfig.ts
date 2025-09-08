import dotenv from "dotenv";
dotenv.config();

export type OAuthProvider = "kakao" | "google" | "naver";

interface OAuthConfig {
  client_id: string;
  client_secret?: string;
  redirect_uri: string;
  token_url: string;
  user_info_url: string;
  scope?: string;
}

export const OAUTH_CONFIG: Record<OAuthProvider, OAuthConfig> = {
  kakao: {
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    token_url: "https://kauth.kakao.com/oauth/token",
    user_info_url: "https://kapi.kakao.com/v2/user/me",
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    token_url: "https://oauth2.googleapis.com/token",
    user_info_url: "https://www.googleapis.com/oauth2/v2/userinfo",
    scope: "openid email profile",
  },
  naver: {
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    redirect_uri: process.env.NAVER_REDIRECT_URI!,
    token_url: "https://nid.naver.com/oauth2.0/token",
    user_info_url: "https://openapi.naver.com/v1/nid/me",
    scope: "name phone profile email",
  },
};
