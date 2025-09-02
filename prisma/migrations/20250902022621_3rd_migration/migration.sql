-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `role_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `skpd` DROP FOREIGN KEY `skpd_author_id_fkey`;

-- AlterTable
ALTER TABLE `role` MODIFY `author_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `skpd` MODIFY `author_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skpd` ADD CONSTRAINT `skpd_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
