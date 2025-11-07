-- CreateTable
CREATE TABLE `w_skpd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `periodeId` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `w_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NULL,
    `skpdId` INTEGER NOT NULL,
    `type` ENUM('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan') NOT NULL,
    `name` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `w_uraian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `master_id` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `base_line` VARCHAR(191) NOT NULL,
    `is_iku` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `w_targetRealisasiUraian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uraian_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `realisasi` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `w_skpd` ADD CONSTRAINT `w_skpd_periodeId_fkey` FOREIGN KEY (`periodeId`) REFERENCES `periode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_master` ADD CONSTRAINT `w_master_skpdId_fkey` FOREIGN KEY (`skpdId`) REFERENCES `w_skpd`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_uraian` ADD CONSTRAINT `w_uraian_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `w_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_targetRealisasiUraian` ADD CONSTRAINT `w_targetRealisasiUraian_uraian_id_fkey` FOREIGN KEY (`uraian_id`) REFERENCES `w_uraian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
