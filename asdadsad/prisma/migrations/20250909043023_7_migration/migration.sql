/*
  Warnings:

  - Added the required column `periode` to the `skpd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `skpd` ADD COLUMN `periode` INTEGER NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mulai` INTEGER NOT NULL,
    `akhir` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `skpd` ADD CONSTRAINT `skpd_periode_fkey` FOREIGN KEY (`periode`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
