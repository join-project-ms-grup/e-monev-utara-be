/*
  Warnings:

  - You are about to drop the `w_skpd` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `w_master` DROP FOREIGN KEY `w_master_skpdId_fkey`;

-- DropForeignKey
ALTER TABLE `w_skpd` DROP FOREIGN KEY `w_skpd_periodeId_fkey`;

-- AlterTable
ALTER TABLE `indikatorOutcome` ADD COLUMN `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif';

-- DropTable
DROP TABLE `w_skpd`;

-- CreateTable
CREATE TABLE `w_skpd_periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_id` INTEGER NOT NULL,
    `periode_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `w_skpd_periode_skpd_id_periode_id_key`(`skpd_id`, `periode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `w_skpd_periode` ADD CONSTRAINT `w_skpd_periode_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `w_skpd_periode` ADD CONSTRAINT `w_skpd_periode_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `w_master` ADD CONSTRAINT `w_master_skpdId_fkey` FOREIGN KEY (`skpdId`) REFERENCES `w_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
