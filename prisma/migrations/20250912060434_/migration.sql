/*
  Warnings:

  - You are about to alter the column `a1` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.
  - You are about to alter the column `a2` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.
  - You are about to alter the column `a3` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.
  - You are about to alter the column `a4` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.
  - You are about to alter the column `a5` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.
  - You are about to alter the column `a6` on the `debuging` table. The data in that column could be lost. The data in that column will be cast from `Decimal(30,15)` to `Double`.

*/
-- AlterTable
ALTER TABLE `debuging` MODIFY `a1` DOUBLE NOT NULL,
    MODIFY `a2` DOUBLE NOT NULL,
    MODIFY `a3` DOUBLE NOT NULL,
    MODIFY `a4` DOUBLE NOT NULL,
    MODIFY `a5` DOUBLE NOT NULL,
    MODIFY `a6` DOUBLE NOT NULL;
