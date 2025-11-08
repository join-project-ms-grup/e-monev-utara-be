-- AlterTable
ALTER TABLE `fisik_masalah_realisasi` MODIFY `masalah_lain` TEXT NULL;

-- AddForeignKey
ALTER TABLE `fisik_realisasi` ADD CONSTRAINT `fisik_realisasi_id_ident_fkey` FOREIGN KEY (`id_ident`) REFERENCES `fisik_ident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
