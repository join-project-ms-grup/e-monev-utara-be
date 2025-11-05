-- DropIndex
DROP INDEX `sumberDana_nama_key` ON `sumberDana`;

-- AlterTable
ALTER TABLE `sumberDana` MODIFY `nama` TEXT NOT NULL;
