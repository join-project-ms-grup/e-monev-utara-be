/*
  Warnings:

  - You are about to alter the column `target` on the `rincianIndikator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `target` on the `targetIndikatorOutcome` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `rincianIndikator` MODIFY `target` DOUBLE NULL;

-- AlterTable
ALTER TABLE `targetIndikatorOutcome` MODIFY `target` DOUBLE NULL;
