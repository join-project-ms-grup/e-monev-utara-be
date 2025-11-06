/*
  Warnings:

  - You are about to drop the `LogMaster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `LogMaster`;

-- CreateTable
CREATE TABLE `logMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` ENUM('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan') NOT NULL,
    `entityId` INTEGER NOT NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
