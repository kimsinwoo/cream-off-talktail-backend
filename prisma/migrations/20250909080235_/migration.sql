/*
  Warnings:

  - Added the required column `classIndex` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predictedClass` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` ADD COLUMN `classIndex` INTEGER NOT NULL,
    ADD COLUMN `confidence` VARCHAR(191) NOT NULL,
    ADD COLUMN `predictedClass` VARCHAR(191) NOT NULL;
