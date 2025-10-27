/*
  Warnings:

  - You are about to drop the column `pagu_anggaran` on the `rincianIndikator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parent_id,kode,type]` on the table `master` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pagu_indikator` to the `rincianIndikator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `indikator` ADD COLUMN `jenis_satuan` ENUM('akumulatif', 'tetap') NOT NULL DEFAULT 'akumulatif';

-- AlterTable
ALTER TABLE `rincianIndikator` DROP COLUMN `pagu_anggaran`,
    ADD COLUMN `pagu_indikator` DECIMAL(65, 30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `master_parent_id_kode_type_key` ON `master`(`parent_id`, `kode`, `type`);
