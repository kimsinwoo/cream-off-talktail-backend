-- AlterTable
ALTER TABLE `image` MODIFY `cropedImage` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `Debuging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `a1` DECIMAL(30, 15) NOT NULL,
    `a2` DECIMAL(30, 15) NOT NULL,
    `a3` DECIMAL(30, 15) NOT NULL,
    `a4` DECIMAL(30, 15) NOT NULL,
    `a5` DECIMAL(30, 15) NOT NULL,
    `a6` DECIMAL(30, 15) NOT NULL,
    `imagePath` TEXT NOT NULL,
    `imageId` INTEGER NOT NULL,

    UNIQUE INDEX `Debuging_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Debuging` ADD CONSTRAINT `Debuging_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
