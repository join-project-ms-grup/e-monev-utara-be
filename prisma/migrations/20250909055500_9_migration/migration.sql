/*
  Warnings:

  - You are about to drop the column `periode` on the `skpd` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `skpd` DROP FOREIGN KEY `skpd_periode_fkey`;

-- AlterTable
ALTER TABLE `skpd` DROP COLUMN `periode`;

-- CreateTable
CREATE TABLE `skpd_periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_id` INTEGER NOT NULL,
    `periode_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `skpd_periode_skpd_id_periode_id_key`(`skpd_id`, `periode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `skpd_periode` ADD CONSTRAINT `skpd_periode_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `skpd_periode` ADD CONSTRAINT `skpd_periode_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
