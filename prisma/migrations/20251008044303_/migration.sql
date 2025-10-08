/*
  Warnings:

  - You are about to drop the column `kondisi_akhir` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `kondisi_awal` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `rasio_akhir` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `rasio_awal` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `skpd_periode_id` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_1` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_2` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_3` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_4` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the column `tahun_5` on the `rincianIndikator` table. All the data in the column will be lost.
  - You are about to drop the `realisasiIndikator` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mulai,akhir]` on the table `periode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[indikator_id,tahun_ke]` on the table `rincianIndikator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `skpd_periode_id` to the `indikator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pagu_anggaran` to the `rincianIndikator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahun_ke` to the `rincianIndikator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `rincianIndikator` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `realisasiIndikator` DROP FOREIGN KEY `realisasiIndikator_indikator_id_fkey`;

-- DropIndex
DROP INDEX `periode_akhir_key` ON `periode`;

-- DropIndex
DROP INDEX `periode_mulai_key` ON `periode`;

-- AlterTable
ALTER TABLE `indikator` ADD COLUMN `skpd_periode_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rincianIndikator` DROP COLUMN `kondisi_akhir`,
    DROP COLUMN `kondisi_awal`,
    DROP COLUMN `rasio_akhir`,
    DROP COLUMN `rasio_awal`,
    DROP COLUMN `skpd_periode_id`,
    DROP COLUMN `tahun_1`,
    DROP COLUMN `tahun_2`,
    DROP COLUMN `tahun_3`,
    DROP COLUMN `tahun_4`,
    DROP COLUMN `tahun_5`,
    ADD COLUMN `pagu_anggaran` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `tahun_ke` INTEGER NOT NULL,
    ADD COLUMN `target` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `realisasiIndikator`;

-- CreateTable
CREATE TABLE `userLoginLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userChangeLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `changed_by` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indikatorLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rincianIndikatorLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rincian_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capaianTriwulan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rincianIndikator_id` INTEGER NOT NULL,
    `triwulan` INTEGER NOT NULL,
    `capaian` DOUBLE NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capaianTriwulanLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capaian_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `realisasiAnggaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rincianIndikator_id` INTEGER NOT NULL,
    `triwulan` INTEGER NOT NULL,
    `realisasi` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `realisasiAnggaranLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `realisasi_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `periode_mulai_akhir_key` ON `periode`(`mulai`, `akhir`);

-- CreateIndex
CREATE UNIQUE INDEX `rincianIndikator_indikator_id_tahun_ke_key` ON `rincianIndikator`(`indikator_id`, `tahun_ke`);

-- AddForeignKey
ALTER TABLE `userLoginLog` ADD CONSTRAINT `userLoginLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userChangeLog` ADD CONSTRAINT `userChangeLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userChangeLog` ADD CONSTRAINT `userChangeLog_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logMaster` ADD CONSTRAINT `logMaster_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indikatorLog` ADD CONSTRAINT `indikatorLog_indikator_id_fkey` FOREIGN KEY (`indikator_id`) REFERENCES `indikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rincianIndikatorLog` ADD CONSTRAINT `rincianIndikatorLog_rincian_id_fkey` FOREIGN KEY (`rincian_id`) REFERENCES `rincianIndikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capaianTriwulan` ADD CONSTRAINT `capaianTriwulan_rincianIndikator_id_fkey` FOREIGN KEY (`rincianIndikator_id`) REFERENCES `rincianIndikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capaianTriwulanLog` ADD CONSTRAINT `capaianTriwulanLog_capaian_id_fkey` FOREIGN KEY (`capaian_id`) REFERENCES `capaianTriwulan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiAnggaran` ADD CONSTRAINT `realisasiAnggaran_rincianIndikator_id_fkey` FOREIGN KEY (`rincianIndikator_id`) REFERENCES `rincianIndikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiAnggaranLog` ADD CONSTRAINT `realisasiAnggaranLog_realisasi_id_fkey` FOREIGN KEY (`realisasi_id`) REFERENCES `realisasiAnggaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
