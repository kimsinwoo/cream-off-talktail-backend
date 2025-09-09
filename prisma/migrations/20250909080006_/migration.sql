/*
  Warnings:

  - You are about to drop the column `cause` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `croppedImage` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `disease` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `petName` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `image` table. All the data in the column will be lost.
  - Added the required column `cropedImage` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalImage` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` DROP COLUMN `cause`,
    DROP COLUMN `croppedImage`,
    DROP COLUMN `disease`,
    DROP COLUMN `petName`,
    DROP COLUMN `solution`,
    ADD COLUMN `cropedImage` VARCHAR(191) NOT NULL,
    ADD COLUMN `originalImage` VARCHAR(191) NOT NULL;
