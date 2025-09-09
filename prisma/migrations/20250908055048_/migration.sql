-- AlterTable
ALTER TABLE `user` ADD COLUMN `accessToken` TEXT NULL,
    ADD COLUMN `refreshToken` TEXT NULL;

-- AddForeignKey
ALTER TABLE `Tracking` ADD CONSTRAINT `Tracking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
