import prisma from "../config/prisma";

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (userId: number, data: { name?: string; profileImage?: string; phone?: string }) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      profileImage: true,
      phone: true,
      updatedAt: true,
    },
  });
};

// Pet 관련 서비스도 유사하게 service로 분리 가능
