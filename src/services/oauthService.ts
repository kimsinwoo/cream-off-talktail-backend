import axios from "axios";
import prisma from "../config/prisma";
import { OAuthConfig } from "../config/oauthConfig";

export const getAccessToken = async (code: string, config: OAuthConfig) => {
  const response = await axios.post(
    config.tokenUrl,
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri,
      code,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data.access_token;
};

export const getUserInfo = async (accessToken: string, config: OAuthConfig) => {
  const response = await axios.get(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const findOrCreateUser = async (email: string, name: string, profileImage?: string) => {
  let user = await prisma.users.findUnique({ where: { Email: email } });
  if (!user) {
    user = await prisma.users.create({
      data: { Name: name, Email: email, Phone: "", ProfileImage: profileImage },
    });
  }
  return user;
};
