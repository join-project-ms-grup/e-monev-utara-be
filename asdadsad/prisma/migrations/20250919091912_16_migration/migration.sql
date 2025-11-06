-- CreateTable
CREATE TABLE `rincianIndikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_id` INTEGER NOT NULL,
    `skpd_periode_id` INTEGER NOT NULL,
    `kondisi_awal` DOUBLE NULL,
    `rasio_awal` DOUBLE NULL,
    `tahun_1` DOUBLE NULL,
    `tahun_2` DOUBLE NULL,
    `tahun_3` DOUBLE NULL,
    `tahun_4` DOUBLE NULL,
    `tahun_5` DOUBLE NULL,
    `kondisi_akhir` DOUBLE NULL,
    `rasio_akhir` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `realisasiIndikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_id` INTEGER NOT NULL,
    `skpd_periode_id` INTEGER NOT NULL,
    `capaian_1` DOUBLE NULL,
    `rasio_1` DOUBLE NULL,
    `capaian_2` DOUBLE NULL,
    `rasio_2` DOUBLE NULL,
    `capaian_3` DOUBLE NULL,
    `rasio_3` DOUBLE NULL,
    `capaian_4` DOUBLE NULL,
    `rasio_4` DOUBLE NULL,
    `capaian_5` DOUBLE NULL,
    `rasio_5` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rincianIndikator` ADD CONSTRAINT `rincianIndikator_indikator_id_fkey` FOREIGN KEY (`indikator_id`) REFERENCES `indikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiIndikator` ADD CONSTRAINT `realisasiIndikator_indikator_id_fkey` FOREIGN KEY (`indikator_id`) REFERENCES `indikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
