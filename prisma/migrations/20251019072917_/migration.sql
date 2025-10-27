/*
  Warnings:

  - You are about to drop the column `rincianIndikator_id` on the `realisasiAnggaran` table. All the data in the column will be lost.
  - You are about to drop the column `pagu_indikator` on the `rincianIndikator` table. All the data in the column will be lost.
  - Added the required column `paguIndikatif_id` to the `realisasiAnggaran` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `realisasiAnggaran` DROP FOREIGN KEY `realisasiAnggaran_rincianIndikator_id_fkey`;

-- AlterTable
ALTER TABLE `realisasiAnggaran` DROP COLUMN `rincianIndikator_id`,
    ADD COLUMN `paguIndikatif_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rincianIndikator` DROP COLUMN `pagu_indikator`;

-- CreateTable
CREATE TABLE `paguIndikatif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `pagu` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logPaguIndikatif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pagu_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logPaguIndikatif` ADD CONSTRAINT `logPaguIndikatif_pagu_id_fkey` FOREIGN KEY (`pagu_id`) REFERENCES `paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiAnggaran` ADD CONSTRAINT `realisasiAnggaran_paguIndikatif_id_fkey` FOREIGN KEY (`paguIndikatif_id`) REFERENCES `paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
