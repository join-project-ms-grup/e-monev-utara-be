/*
  Warnings:

  - You are about to drop the `indikatorLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logPaguIndikatif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rincianIndikatorLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tahun` to the `paguIndikatif` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `indikatorLog` DROP FOREIGN KEY `indikatorLog_indikator_id_fkey`;

-- DropForeignKey
ALTER TABLE `logPaguIndikatif` DROP FOREIGN KEY `logPaguIndikatif_pagu_id_fkey`;

-- DropForeignKey
ALTER TABLE `rincianIndikatorLog` DROP FOREIGN KEY `rincianIndikatorLog_rincian_id_fkey`;

-- AlterTable
ALTER TABLE `paguIndikatif` ADD COLUMN `sumber_dana` VARCHAR(191) NULL,
    ADD COLUMN `tahun` INTEGER NOT NULL;

-- DropTable
DROP TABLE `indikatorLog`;

-- DropTable
DROP TABLE `logPaguIndikatif`;

-- DropTable
DROP TABLE `rincianIndikatorLog`;

-- CreateTable
CREATE TABLE `pagu_skpd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `pagu` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indikatorOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outcome_id` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `satuan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `indikatorOutcome_outcome_id_key`(`outcome_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `targetIndikatorOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_outcome_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `target` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `targetIndikatorOutcome_indikator_outcome_id_tahun_ke_key`(`indikator_outcome_id`, `tahun_ke`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paguProgram` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `pagu` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paguKegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `pagu` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labelNasional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `labelNasional_poin_key`(`poin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labelProv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `labelProv_poin_key`(`poin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labelKab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `labelKab_poin_key`(`poin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sumberDana_kode_key`(`kode`),
    UNIQUE INDEX `sumberDana_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pagu_skpd` ADD CONSTRAINT `pagu_skpd_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indikatorOutcome` ADD CONSTRAINT `indikatorOutcome_outcome_id_fkey` FOREIGN KEY (`outcome_id`) REFERENCES `outcome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `targetIndikatorOutcome` ADD CONSTRAINT `targetIndikatorOutcome_indikator_outcome_id_fkey` FOREIGN KEY (`indikator_outcome_id`) REFERENCES `indikatorOutcome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguProgram` ADD CONSTRAINT `paguProgram_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguKegiatan` ADD CONSTRAINT `paguKegiatan_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indikator` ADD CONSTRAINT `indikator_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatif` ADD CONSTRAINT `paguIndikatif_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
