-- AlterTable
ALTER TABLE `users` MODIFY `avatar` VARCHAR(191) NULL,
    MODIFY `role_id` INTEGER NULL,
    MODIFY `skpd_id` INTEGER NULL,
    MODIFY `token` VARCHAR(191) NULL,
    MODIFY `session` DATETIME(3) NULL;
