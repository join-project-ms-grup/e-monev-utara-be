-- CreateTable
CREATE TABLE `outcome` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode_id` INTEGER NOT NULL,
    `id_master` INTEGER NOT NULL,
    `tahun_ke` INTEGER NOT NULL,
    `outcome` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `outcome` ADD CONSTRAINT `outcome_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
