-- AddForeignKey
ALTER TABLE `paguIndikatif` ADD CONSTRAINT `paguIndikatif_id_master_fkey` FOREIGN KEY (`id_master`) REFERENCES `master`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
