-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `role_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `skpd` DROP FOREIGN KEY `skpd_author_id_fkey`;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `skpd` ADD CONSTRAINT `skpd_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
