-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_skpd_id_fkey`;

-- AlterTable
ALTER TABLE `skpd` MODIFY `kode` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_skpd_id_fkey` FOREIGN KEY (`skpd_id`) REFERENCES `skpd`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
