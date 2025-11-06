/*
  Warnings:

  - A unique constraint covering the columns `[kode]` on the table `skpd` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kode` to the `skpd` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_skpd_id_fkey`;

-- AlterTable
ALTER TABLE `skpd` ADD COLUMN `kode` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `skpd_kode_key` ON `skpd`(`kode`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`kode`) ON DELETE NO ACTION ON UPDATE NO ACTION;
