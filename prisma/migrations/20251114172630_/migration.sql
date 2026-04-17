-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NULL,
    `skpd_id` INTEGER NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `session` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_name_key`(`name`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `author_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `role_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mulai` INTEGER NOT NULL,
    `akhir` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `periode_mulai_akhir_key`(`mulai`, `akhir`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skpd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortname` VARCHAR(191) NULL,
    `author_id` INTEGER NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `skpd_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `pagu_skpd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `pagu` DECIMAL(18, 2) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `master_parent_id_kode_type_key`(`parent_id`, `kode`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logMaster` (
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
CREATE TABLE `outcome` (
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
CREATE TABLE `indikatorOutcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outcome_id` INTEGER NOT NULL,
    `nama` TEXT NOT NULL,
    `satuan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif',
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
    `target` DOUBLE NULL,
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
    `pagu` DECIMAL(18, 2) NULL,
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
    `pagu` DECIMAL(18, 2) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labelNasional` (
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
CREATE TABLE `labelProv` (
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
CREATE TABLE `labelKab` (
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
CREATE TABLE `indikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `master_id` INTEGER NOT NULL,
    `label_nasional_id` INTEGER NULL,
    `label_prov_id` INTEGER NULL,
    `label_kab_id` INTEGER NULL,
    `name` TEXT NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NULL,
    `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `labelKabId` INTEGER NULL,

    UNIQUE INDEX `indikator_skpd_periode_id_master_id_key`(`skpd_periode_id`, `master_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rincianIndikator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indikator_id` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `target` DOUBLE NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rincianIndikator_indikator_id_tahun_ke_key`(`indikator_id`, `tahun_ke`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` TEXT NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sumberDana_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paguIndikatif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `pagu` DECIMAL(18, 2) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paguIndikatifSumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pagu_indikatif_id` INTEGER NOT NULL,
    `sumber_dana_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `paguIndikatifSumberDana_pagu_indikatif_id_sumber_dana_id_key`(`pagu_indikatif_id`, `sumber_dana_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catatan_eval` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode` INTEGER NOT NULL,
    `type` ENUM('rkpd', 'renja') NOT NULL,
    `pendorong` TEXT NULL,
    `penghambat` TEXT NULL,
    `tl_1` TEXT NULL,
    `tl_2` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `catatan_eval_skpd_periode_type_key`(`skpd_periode`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `realisasiAnggaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paguIndikatif_id` INTEGER NOT NULL,
    `triwulan` INTEGER NOT NULL,
    `realisasi` DECIMAL(18, 2) NULL,
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
    `master_id` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `base_line` VARCHAR(191) NOT NULL,
    `perhitungan` VARCHAR(191) NOT NULL DEFAULT 'akumulatif',
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
    `pagu` DECIMAL(18, 2) NULL,
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
    `capaian` DOUBLE NULL,
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
    `pagu` DECIMAL(18, 2) NULL,
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
    `pagu` DECIMAL(18, 2) NULL,
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
    `jenis_satuan` ENUM('akumulatif', 'negatif', 'tetap') NOT NULL DEFAULT 'akumulatif',
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
    `capaian` DOUBLE NULL,
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
    `pagu` DECIMAL(18, 2) NULL,
    `realisasi` DECIMAL(18, 2) NULL,
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
CREATE TABLE `x_catatan_eval` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode` INTEGER NOT NULL,
    `type` ENUM('rpjmd', 'renstra') NOT NULL,
    `pendorong` TEXT NULL,
    `penghambat` TEXT NULL,
    `tl_1` TEXT NULL,
    `tl_2` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_catatan_eval_skpd_periode_type_key`(`skpd_periode`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_tahun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dak_tahun_tahun_key`(`tahun`),
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
CREATE TABLE `dak_opd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NULL,
    `shortname` VARCHAR(191) NULL,
    `fullname` TEXT NOT NULL,
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
    `jenis_dak` INTEGER NULL,
    `nama` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_bidang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_dak` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
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
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_masalah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_dak` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dak_berkas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_dak` INTEGER NOT NULL,
    `no` INTEGER NOT NULL,
    `group` ENUM('PERENCANAAN', 'PELAKSANAAN') NOT NULL,
    `name` TEXT NOT NULL,
    `keterangan` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dak_berkas_no_key`(`no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_ident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_jenis` INTEGER NOT NULL,
    `sub_bidang_dak` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `opd_id` INTEGER NOT NULL,
    `bidangOpd` VARCHAR(191) NOT NULL,
    `sub_kegiatan` INTEGER NOT NULL,
    `catatan` TEXT NULL,
    `verifikasi` ENUM('di_periksa', 'cek_ulang', 'di_verifikasi', 'belum_sesuai') NOT NULL DEFAULT 'di_periksa',
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ident` INTEGER NOT NULL,
    `nama_paket` TEXT NOT NULL,
    `detail_paket` TEXT NOT NULL,
    `volume` DOUBLE NULL,
    `satuan` VARCHAR(191) NULL,
    `estimasi` VARCHAR(191) NULL,
    `jumlah_penerima` VARCHAR(191) NULL,
    `anggaran` DECIMAL(18, 2) NULL,
    `des_kel` VARCHAR(191) NULL,
    `kec` VARCHAR(191) NULL,
    `bujur` JSON NOT NULL,
    `lintang` JSON NOT NULL,
    `foto` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fisik_detail_id_ident_key`(`id_ident`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_mekanisme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ident` INTEGER NOT NULL,
    `mekanisme` ENUM('swakelola', 'kontrak', 'ekatalog') NULL,
    `uang` DECIMAL(18, 2) NULL,
    `volume` DOUBLE NULL,
    `metode` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fisik_mekanisme_id_ident_key`(`id_ident`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_dokumen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_berkas` INTEGER NOT NULL,
    `id_ident` INTEGER NOT NULL,
    `file` TEXT NULL,
    `Kesesuaian` VARCHAR(191) NULL,
    `Waktu` DATETIME(3) NULL,
    `Keterangan` TEXT NULL,
    `pesan` TEXT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fisik_dokumen_id_berkas_id_ident_key`(`id_berkas`, `id_ident`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_realisasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ident` INTEGER NOT NULL,
    `triwulan` INTEGER NOT NULL,
    `fisik` DOUBLE NULL DEFAULT 0,
    `anggaran` DECIMAL(18, 2) NULL DEFAULT 0,
    `sasaran_lokasi` BOOLEAN NULL,
    `kesesuaian_juknis` BOOLEAN NULL,
    `kodefikasi` VARCHAR(191) NULL,
    `masalah_lain` VARCHAR(191) NULL,
    `catatan` TEXT NULL,
    `kunci` BOOLEAN NOT NULL DEFAULT false,
    `disetujui` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fisik_masalah_realisasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_realisasi` INTEGER NOT NULL,
    `masalah` JSON NULL,
    `masalah_lain` TEXT NULL,
    `file_masalah` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fisik_masalah_realisasi_id_realisasi_key`(`id_realisasi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`kode`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userLoginLog` ADD CONSTRAINT `userLoginLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userChangeLog` ADD CONSTRAINT `userChangeLog_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userChangeLog` ADD CONSTRAINT `userChangeLog_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skpd` ADD CONSTRAINT `skpd_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skpd_periode` ADD CONSTRAINT `skpd_periode_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `skpd_periode` ADD CONSTRAINT `skpd_periode_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pagu_skpd` ADD CONSTRAINT `pagu_skpd_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master` ADD CONSTRAINT `master_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `master`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logMaster` ADD CONSTRAINT `logMaster_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `indikator` ADD CONSTRAINT `indikator_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indikator` ADD CONSTRAINT `indikator_labelKabId_fkey` FOREIGN KEY (`labelKabId`) REFERENCES `labelKab`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rincianIndikator` ADD CONSTRAINT `rincianIndikator_indikator_id_fkey` FOREIGN KEY (`indikator_id`) REFERENCES `indikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatif` ADD CONSTRAINT `paguIndikatif_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatif` ADD CONSTRAINT `paguIndikatif_skpd_periode_id_fkey` FOREIGN KEY (`skpd_periode_id`) REFERENCES `skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatifSumberDana` ADD CONSTRAINT `paguIndikatifSumberDana_pagu_indikatif_id_fkey` FOREIGN KEY (`pagu_indikatif_id`) REFERENCES `paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatifSumberDana` ADD CONSTRAINT `paguIndikatifSumberDana_sumber_dana_id_fkey` FOREIGN KEY (`sumber_dana_id`) REFERENCES `sumberDana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiAnggaran` ADD CONSTRAINT `realisasiAnggaran_paguIndikatif_id_fkey` FOREIGN KEY (`paguIndikatif_id`) REFERENCES `paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `realisasiAnggaranLog` ADD CONSTRAINT `realisasiAnggaranLog_realisasi_id_fkey` FOREIGN KEY (`realisasi_id`) REFERENCES `realisasiAnggaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capaianTriwulan` ADD CONSTRAINT `capaianTriwulan_rincianIndikator_id_fkey` FOREIGN KEY (`rincianIndikator_id`) REFERENCES `rincianIndikator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capaianTriwulanLog` ADD CONSTRAINT `capaianTriwulanLog_capaian_id_fkey` FOREIGN KEY (`capaian_id`) REFERENCES `capaianTriwulan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_skpd_periode` ADD CONSTRAINT `w_skpd_periode_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `w_skpd_periode` ADD CONSTRAINT `w_skpd_periode_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `w_master` ADD CONSTRAINT `w_master_skpdId_fkey` FOREIGN KEY (`skpdId`) REFERENCES `w_skpd_periode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_uraian` ADD CONSTRAINT `w_uraian_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `w_master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `w_targetRealisasiUraian` ADD CONSTRAINT `w_targetRealisasiUraian_uraian_id_fkey` FOREIGN KEY (`uraian_id`) REFERENCES `w_uraian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `dak_master` ADD CONSTRAINT `dak_master_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `dak_master`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_subJenis` ADD CONSTRAINT `dak_subJenis_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_bidang` ADD CONSTRAINT `dak_bidang_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_subBidang` ADD CONSTRAINT `dak_subBidang_dak_bidangId_fkey` FOREIGN KEY (`dak_bidangId`) REFERENCES `dak_bidang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_masalah` ADD CONSTRAINT `dak_masalah_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_berkas` ADD CONSTRAINT `dak_berkas_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_ident` ADD CONSTRAINT `fisik_ident_sub_jenis_fkey` FOREIGN KEY (`sub_jenis`) REFERENCES `dak_subJenis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_ident` ADD CONSTRAINT `fisik_ident_sub_bidang_dak_fkey` FOREIGN KEY (`sub_bidang_dak`) REFERENCES `dak_subBidang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_ident` ADD CONSTRAINT `fisik_ident_opd_id_fkey` FOREIGN KEY (`opd_id`) REFERENCES `dak_opd`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_ident` ADD CONSTRAINT `fisik_ident_sub_kegiatan_fkey` FOREIGN KEY (`sub_kegiatan`) REFERENCES `dak_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_detail` ADD CONSTRAINT `fisik_detail_id_ident_fkey` FOREIGN KEY (`id_ident`) REFERENCES `fisik_ident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_mekanisme` ADD CONSTRAINT `fisik_mekanisme_id_ident_fkey` FOREIGN KEY (`id_ident`) REFERENCES `fisik_ident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_dokumen` ADD CONSTRAINT `fisik_dokumen_id_ident_fkey` FOREIGN KEY (`id_ident`) REFERENCES `fisik_ident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_dokumen` ADD CONSTRAINT `fisik_dokumen_id_berkas_fkey` FOREIGN KEY (`id_berkas`) REFERENCES `dak_berkas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_realisasi` ADD CONSTRAINT `fisik_realisasi_id_ident_fkey` FOREIGN KEY (`id_ident`) REFERENCES `fisik_ident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fisik_masalah_realisasi` ADD CONSTRAINT `fisik_masalah_realisasi_id_realisasi_fkey` FOREIGN KEY (`id_realisasi`) REFERENCES `fisik_realisasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
