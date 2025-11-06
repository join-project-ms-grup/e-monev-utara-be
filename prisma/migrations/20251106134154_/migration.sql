-- AlterTable
ALTER TABLE `indikator` ADD COLUMN `labelKabId` INTEGER NULL;

-- CreateTable
CREATE TABLE `x_skpd_periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_id` INTEGER NOT NULL,
    `periode_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_skpd_periode_skpd_id_periode_id_key`(`skpd_id`, `periode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_pagu_skpd` (
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
CREATE TABLE `x_master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_master_parent_id_kode_type_key`(`parent_id`, `kode`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_logMaster` (
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

-- CreateTable
CREATE TABLE `x_outcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `outcome` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_indikatorOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outcome_id` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `satuan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_indikatorOutcome_outcome_id_key`(`outcome_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_targetIndikatorOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_outcome_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `target` DOUBLE NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_targetIndikatorOutcome_indikator_outcome_id_tahun_ke_key`(`indikator_outcome_id`, `tahun_ke`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_paguProgram` (
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
CREATE TABLE `x_paguKegiatan` (
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
CREATE TABLE `x_labelNasional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_labelProv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_labelKab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `poin` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_indikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `master_id` INTEGER NOT NULL,
    `label_nasional_id` INTEGER NULL,
    `label_prov_id` INTEGER NULL,
    `label_kab_id` INTEGER NULL,
    `name` TEXT NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NULL,
    `jenis_satuan` ENUM('akumulatif', 'tetap') NOT NULL DEFAULT 'akumulatif',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `labelKabId` INTEGER NULL,

    UNIQUE INDEX `x_indikator_skpd_periode_id_master_id_key`(`skpd_periode_id`, `master_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_rincianIndikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `target` DOUBLE NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_rincianIndikator_indikator_id_tahun_ke_key`(`indikator_id`, `tahun_ke`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_sumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` TEXT NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_sumberDana_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_paguIndikatif` (
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
CREATE TABLE `x_paguIndikatifSumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pagu_indikatif_id` INTEGER NOT NULL,
    `sumber_dana_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `x_paguIndikatifSumberDana_pagu_indikatif_id_sumber_dana_id_key`(`pagu_indikatif_id`, `sumber_dana_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_realisasiAnggaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paguIndikatif_id` INTEGER NOT NULL,
    `triwulan` INTEGER NOT NULL,
    `realisasi` DECIMAL(65, 30) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_realisasiAnggaranLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `realisasi_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `x_capaianTriwulan` (
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
CREATE TABLE `x_capaianTriwulanLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capaian_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `indikator` ADD CONSTRAINT `indikator_labelKabId_fkey` FOREIGN KEY (`labelKabId`) REFERENCES `labelKab`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_skpd_periode` ADD CONSTRAINT `x_skpd_periode_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `x_skpd_periode` ADD CONSTRAINT `x_skpd_periode_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `x_pagu_skpd` ADD CONSTRAINT `x_pagu_skpd_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `x_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_master` ADD CONSTRAINT `x_master_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `x_master`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_logMaster` ADD CONSTRAINT `x_logMaster_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_outcome` ADD CONSTRAINT `x_outcome_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `x_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_outcome` ADD CONSTRAINT `x_outcome_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_indikatorOutcome` ADD CONSTRAINT `x_indikatorOutcome_outcome_id_fkey` FOREIGN KEY (`outcome_id`) REFERENCES `x_outcome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_targetIndikatorOutcome` ADD CONSTRAINT `x_targetIndikatorOutcome_indikator_outcome_id_fkey` FOREIGN KEY (`indikator_outcome_id`) REFERENCES `x_indikatorOutcome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguProgram` ADD CONSTRAINT `x_paguProgram_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguKegiatan` ADD CONSTRAINT `x_paguKegiatan_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_indikator` ADD CONSTRAINT `x_indikator_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `x_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_indikator` ADD CONSTRAINT `x_indikator_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_indikator` ADD CONSTRAINT `x_indikator_labelKabId_fkey` FOREIGN KEY (`labelKabId`) REFERENCES `x_labelKab`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_rincianIndikator` ADD CONSTRAINT `x_rincianIndikator_indikator_id_fkey` FOREIGN KEY (`indikator_id`) REFERENCES `x_indikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguIndikatif` ADD CONSTRAINT `x_paguIndikatif_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `x_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguIndikatif` ADD CONSTRAINT `x_paguIndikatif_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `x_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguIndikatifSumberDana` ADD CONSTRAINT `x_paguIndikatifSumberDana_pagu_indikatif_id_fkey` FOREIGN KEY (`pagu_indikatif_id`) REFERENCES `x_paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_paguIndikatifSumberDana` ADD CONSTRAINT `x_paguIndikatifSumberDana_sumber_dana_id_fkey` FOREIGN KEY (`sumber_dana_id`) REFERENCES `x_sumberDana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_realisasiAnggaran` ADD CONSTRAINT `x_realisasiAnggaran_paguIndikatif_id_fkey` FOREIGN KEY (`paguIndikatif_id`) REFERENCES `x_paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_realisasiAnggaranLog` ADD CONSTRAINT `x_realisasiAnggaranLog_realisasi_id_fkey` FOREIGN KEY (`realisasi_id`) REFERENCES `x_realisasiAnggaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_capaianTriwulan` ADD CONSTRAINT `x_capaianTriwulan_rincianIndikator_id_fkey` FOREIGN KEY (`rincianIndikator_id`) REFERENCES `x_rincianIndikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `x_capaianTriwulanLog` ADD CONSTRAINT `x_capaianTriwulanLog_capaian_id_fkey` FOREIGN KEY (`capaian_id`) REFERENCES `x_capaianTriwulan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
