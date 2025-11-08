/*
  Warnings:

  - You are about to drop the column `dak_jenisId` on the `dak_bidang` table. All the data in the column will be lost.
  - You are about to drop the column `dak_jenisId` on the `dak_subJenis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `dak_bidang` DROP FOREIGN KEY `dak_bidang_dak_jenisId_fkey`;

-- DropForeignKey
ALTER TABLE `dak_subJenis` DROP FOREIGN KEY `dak_subJenis_dak_jenisId_fkey`;

-- AlterTable
ALTER TABLE `dak_bidang` DROP COLUMN `dak_jenisId`,
    ADD COLUMN `jenis_dak` INTEGER NULL;

-- AlterTable
ALTER TABLE `dak_masalah` ADD COLUMN `jenis_dak` INTEGER NULL;

-- AlterTable
ALTER TABLE `dak_subJenis` DROP COLUMN `dak_jenisId`,
    ADD COLUMN `jenis_dak` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `dak_subJenis` ADD CONSTRAINT `dak_subJenis_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_bidang` ADD CONSTRAINT `dak_bidang_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dak_masalah` ADD CONSTRAINT `dak_masalah_jenis_dak_fkey` FOREIGN KEY (`jenis_dak`) REFERENCES `dak_jenis`(`kode`) ON DELETE SET NULL ON UPDATE CASCADE;
