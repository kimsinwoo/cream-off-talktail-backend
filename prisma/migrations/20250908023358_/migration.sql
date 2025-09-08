/*
  Warnings:

  - The primary key for the `record` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Cause` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `CreateAt` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `CreateUser` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `Disease` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `PetId` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `Solution` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateAt` on the `record` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cause` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disease` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solution` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `Images_RecordId_fkey`;

-- DropForeignKey
ALTER TABLE `pets` DROP FOREIGN KEY `Pets_Master_fkey`;

-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_CreateUser_fkey`;

-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_PetId_fkey`;

-- DropIndex
DROP INDEX `Record_CreateUser_fkey` ON `record`;

-- DropIndex
DROP INDEX `Record_PetId_fkey` ON `record`;

-- AlterTable
ALTER TABLE `record` DROP PRIMARY KEY,
    DROP COLUMN `Cause`,
    DROP COLUMN `CreateAt`,
    DROP COLUMN `CreateUser`,
    DROP COLUMN `Disease`,
    DROP COLUMN `Id`,
    DROP COLUMN `PetId`,
    DROP COLUMN `Solution`,
    DROP COLUMN `UpdateAt`,
    ADD COLUMN `cause` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `disease` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `petId` INTEGER NOT NULL,
    ADD COLUMN `solution` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `images`;

-- DropTable
DROP TABLE `pets`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `profileImage` TEXT NULL,
    `oauthId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordId` INTEGER NOT NULL,
    `disease` VARCHAR(191) NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `solution` VARCHAR(191) NOT NULL,
    `croppedImage` TEXT NOT NULL,
    `petName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `profile` VARCHAR(191) NULL,
    `masterId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tracking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tracking` VARCHAR(191) NOT NULL,
    `userIp` VARCHAR(191) NOT NULL,
    `bytes` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `Record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_masterId_fkey` FOREIGN KEY (`masterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
