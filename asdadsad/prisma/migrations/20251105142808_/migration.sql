/*
  Warnings:

  - You are about to drop the column `sumber_dana` on the `paguIndikatif` table. All the data in the column will be lost.
  - Added the required column `skpd_periode_id` to the `labelKab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skpd_periode_id` to the `labelNasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skpd_periode_id` to the `labelProv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `indikator` ADD COLUMN `label_kab_id` INTEGER NULL,
    ADD COLUMN `label_nasional_id` INTEGER NULL,
    ADD COLUMN `label_prov_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `labelKab` ADD COLUMN `skpd_periode_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `labelNasional` ADD COLUMN `skpd_periode_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `labelProv` ADD COLUMN `skpd_periode_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `paguIndikatif` DROP COLUMN `sumber_dana`;

-- CreateTable
CREATE TABLE `paguIndikatifSumberDana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pagu_indikatif_id` INTEGER NOT NULL,
    `sumber_dana_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `paguIndikatifSumberDana_pagu_indikatif_id_sumber_dana_id_key`(`pagu_indikatif_id`, `sumber_dana_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paguIndikatifSumberDana` ADD CONSTRAINT `paguIndikatifSumberDana_pagu_indikatif_id_fkey` FOREIGN KEY (`pagu_indikatif_id`) REFERENCES `paguIndikatif`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paguIndikatifSumberDana` ADD CONSTRAINT `paguIndikatifSumberDana_sumber_dana_id_fkey` FOREIGN KEY (`sumber_dana_id`) REFERENCES `sumberDana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
