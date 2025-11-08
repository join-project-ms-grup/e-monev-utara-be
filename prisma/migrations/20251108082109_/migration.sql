-- AlterTable
ALTER TABLE `dak_opd` MODIFY `kode` VARCHAR(191) NULL,
    MODIFY `shortname` VARCHAR(191) NULL,
    MODIFY `status` BOOLEAN NOT NULL DEFAULT true;
