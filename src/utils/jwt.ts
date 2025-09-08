import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

export const signToken = (payload: object, expiresIn = "7d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};
