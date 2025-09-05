import jwt, { SignOptions } from "jsonwebtoken";

// JWT 토큰을 생성하는 함수
export const signToken = (payload: object, expiresIn: jwt.SignOptions["expiresIn"] = "7d") => {
  const options: SignOptions = { expiresIn };
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// JWT 토큰을 검증하는 함수
export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};
