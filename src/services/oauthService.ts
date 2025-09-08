import axios from "axios";
import prisma from "../config/prisma";
import { OAUTH_CONFIG, OAuthProvider } from "../config/oauthConfig";

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
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

  return data.access_token;
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
      name: data.kakao_account?.profile?.nickname, // profile_nickname
      profileImage: data.kakao_account?.profile?.profile_image, // profile_image
    };
  }

  if (provider === "google") {
    return {
      id: data.id,
      email: data.email, // userinfo.email
      name: data.name,   // userinfo.profile
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

export const findOrCreateUser = async (user: { id: string; email: string; name: string; profileImage?: string; phone?: string }) => {
  if (!user.email) throw new Error("OAuth에서 이메일을 가져오지 못했습니다.");

  let existingUser = await prisma.user.findUnique({ where: { email: user.email } });

  if (!existingUser) {
    existingUser = await prisma.user.create({
      data: {
        oauthId: user.id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone || "",
      },
    });
  }

  return existingUser;
};