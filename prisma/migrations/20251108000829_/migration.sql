-- AlterTable
ALTER TABLE `dak_bidang` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `dak_masalah` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `dak_subBidang` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `dak_subJenis` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
