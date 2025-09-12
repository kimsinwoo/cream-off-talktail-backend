/*
  Warnings:

  - You are about to drop the column `cause` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `disease` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `record` DROP COLUMN `cause`,
    DROP COLUMN `disease`,
    DROP COLUMN `solution`;
