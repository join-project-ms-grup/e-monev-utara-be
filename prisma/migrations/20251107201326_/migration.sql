-- AlterTable
ALTER TABLE `indikator` MODIFY `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif';

-- AlterTable
ALTER TABLE `x_indikator` MODIFY `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif';

-- CreateTable
CREATE TABLE `dak_tahun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NULL,
    `type` ENUM('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan') NOT NULL,
    `name` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_jenis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` INTEGER NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dak_jenis_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_subJenis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dak_jenisId` INTEGER NULL,
    `nama` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_bidang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dak_jenisId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_subBidang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dak_bidangId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_masalah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dak_master` ADD CONSTRAINT `dak_master_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `dak_master`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_subJenis` ADD CONSTRAINT `dak_subJenis_dak_jenisId_fkey` FOREIGN KEY (`dak_jenisId`) REFERENCES `dak_jenis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_bidang` ADD CONSTRAINT `dak_bidang_dak_jenisId_fkey` FOREIGN KEY (`dak_jenisId`) REFERENCES `dak_jenis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_subBidang` ADD CONSTRAINT `dak_subBidang_dak_bidangId_fkey` FOREIGN KEY (`dak_bidangId`) REFERENCES `dak_bidang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
