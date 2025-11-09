-- AlterTable
ALTER TABLE `fisik_detail` MODIFY `volume` DOUBLE NULL,
    MODIFY `satuan` VARCHAR(191) NULL,
    MODIFY `estimasi` VARCHAR(191) NULL,
    MODIFY `jumlah_penerima` VARCHAR(191) NULL,
    MODIFY `anggaran` DECIMAL(65, 30) NULL,
    MODIFY `des_kel` VARCHAR(191) NULL,
    MODIFY `kec` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `fisik_mekanisme` MODIFY `mekanisme` ENUM('swakelola', 'kontrak', 'ekatalog') NULL,
    MODIFY `metode` VARCHAR(191) NULL;
