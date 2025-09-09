import axios from "axios";
import prisma from "../config/prisma";
import { OAUTH_CONFIG, OAuthProvider } from "../config/oauthConfig";
import { signToken } from "../utils/jwt";
import crypto from "crypto";

// refreshToken의 만료 기간(예: 30일)을 환경변수 또는 상수로 지정
const REFRESH_TOKEN_EXPIRES_IN_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || "30", 10);

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
}

export const getAccessToken = async (provider: OAuthProvider, code: string) => {
  const config = OAUTH_CONFIG[provider];

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", config.client_id);
  if (config.client_secret) params.append("client_secret", config.client_secret!);
  params.append("redirect_uri", config.redirect_uri);
  params.append("code", code);

  const { data } = await axios.post(config.token_url, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return { accessToken: data.access_token, refreshToken: data.refresh_token };
};

export const getUserInfo = async (provider: OAuthProvider, accessToken: string) => {
  const config = OAUTH_CONFIG[provider];
  const { data } = await axios.get(config.user_info_url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (provider === "kakao") {
    return {
      id: data.id,
      email: data.kakao_account?.email,
      name: data.kakao_account?.profile?.nickname,
      profileImage: data.kakao_account?.profile?.profile_image,
    };
  }

  if (provider === "google") {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      profileImage: data.picture,
    };
  }

  if (provider === "naver") {
    return {
      id: data.response.id,
      email: data.response.email,
      name: data.response.name,
      profileImage: data.response.profile_image,
      phone: data.response.mobile || "",
    };
  }

  throw new Error("지원하지 않는 OAuth Provider 입니다.");
};

// refreshToken을 DB에 저장할 때 만료일자를 함께 저장
export const findOrCreateUser = async (user: OAuthUser, refreshToken?: string) => {
  if (!user.email) throw new Error("OAuth에서 이메일을 가져오지 못했습니다.");

  let existingUser = await prisma.user.findUnique({ where: { email: user.email } });

  let hashedRefreshToken: string | null = null;
  let refreshTokenExpiresAt: Date | null = null;

  if (refreshToken) {
    hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    // 만료일 계산 (현재 시각 + REFRESH_TOKEN_EXPIRES_IN_DAYS)
    refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  }

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        oauthId: user.id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone || "",
        refreshToken: hashedRefreshToken,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
      },
    });
  } else if (hashedRefreshToken) {
    existingUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        refreshToken: hashedRefreshToken,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
      },
    });
  }

  return existingUser;
};

export const loginOrSignUp = async (provider: OAuthProvider, code: string) => {
  const { accessToken, refreshToken } = await getAccessToken(provider, code);
  const userInfo = await getUserInfo(provider, accessToken);
  const user = await findOrCreateUser(userInfo, refreshToken);
  const token = signToken({ userId: user.id, email: user.email });
  return { user, token };
};
