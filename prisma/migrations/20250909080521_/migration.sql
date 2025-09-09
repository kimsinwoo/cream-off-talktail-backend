/*
  Warnings:

  - You are about to drop the column `originalImage` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_recordId_fkey`;

-- DropIndex
DROP INDEX `Image_recordId_fkey` ON `image`;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `originalImage`,
    DROP COLUMN `recordId`;
