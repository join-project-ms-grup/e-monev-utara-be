/*
  Warnings:

  - You are about to drop the column `tahun_ke` on the `outcome` table. All the data in the column will be lost.
  - You are about to alter the column `target` on the `rincianIndikator` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `outcome` DROP COLUMN `tahun_ke`;

-- AlterTable
ALTER TABLE `rincianIndikator` MODIFY `target` VARCHAR(191) NULL;
