-- CreateTable
CREATE TABLE `dak_berkas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_dak` INTEGER NOT NULL,
    `group` ENUM('PERENCANAAN', 'PELAKSANAAN') NOT NULL,
    `name` TEXT NOT NULL,
    `keterangan` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

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
    `volume` DOUBLE NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
    `estimasi` VARCHAR(191) NOT NULL,
    `jumlah_penerima` VARCHAR(191) NOT NULL,
    `anggaran` DECIMAL(65, 30) NOT NULL,
    `des_kel` VARCHAR(191) NOT NULL,
    `kec` VARCHAR(191) NOT NULL,
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
    `mekanisme` ENUM('swakelola', 'kontrak', 'ekatalog') NOT NULL,
    `uang` DECIMAL(65, 30) NULL,
    `volume` DOUBLE NULL,
    `metode` VARCHAR(191) NOT NULL,
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
    `anggaran` DECIMAL(65, 30) NULL DEFAULT 0,
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
    `masalah_lain` TEXT NOT NULL,
    `file_masalah` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `fisik_masalah_realisasi_id_realisasi_key`(`id_realisasi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `fisik_masalah_realisasi` ADD CONSTRAINT `fisik_masalah_realisasi_id_realisasi_fkey` FOREIGN KEY (`id_realisasi`) REFERENCES `fisik_realisasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
