/*
  Warnings:

  - You are about to drop the `x_capaianTriwulan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `x_capaianTriwulanLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `x_realisasiAnggaran` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `x_realisasiAnggaranLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `x_capaianTriwulan` DROP FOREIGN KEY `x_capaianTriwulan_rincianIndikator_id_fkey`;

-- DropForeignKey
ALTER TABLE `x_capaianTriwulanLog` DROP FOREIGN KEY `x_capaianTriwulanLog_capaian_id_fkey`;

-- DropForeignKey
ALTER TABLE `x_realisasiAnggaran` DROP FOREIGN KEY `x_realisasiAnggaran_paguIndikatif_id_fkey`;

-- DropForeignKey
ALTER TABLE `x_realisasiAnggaranLog` DROP FOREIGN KEY `x_realisasiAnggaranLog_realisasi_id_fkey`;

-- AlterTable
ALTER TABLE `x_paguIndikatif` ADD COLUMN `realisasi` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `x_rincianIndikator` ADD COLUMN `capaian` DOUBLE NULL;

-- AlterTable
ALTER TABLE `x_targetIndikatorOutcome` ADD COLUMN `capaian` DOUBLE NULL;

-- DropTable
DROP TABLE `x_capaianTriwulan`;

-- DropTable
DROP TABLE `x_capaianTriwulanLog`;

-- DropTable
DROP TABLE `x_realisasiAnggaran`;

-- DropTable
DROP TABLE `x_realisasiAnggaranLog`;
