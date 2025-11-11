-- CreateTable
CREATE TABLE `x_catatan_eval` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skpd_periode` INTEGER NOT NULL,
    `type` ENUM('rpjmd', 'renstra') NOT NULL,
    `pendorong` TEXT NULL,
    `penghambat` TEXT NULL,
    `tl_1` TEXT NULL,
    `tl_2` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `x_catatan_eval_skpd_periode_type_key`(`skpd_periode`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
