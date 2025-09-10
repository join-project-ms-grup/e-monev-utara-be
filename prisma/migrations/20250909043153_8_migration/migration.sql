/*
  Warnings:

  - A unique constraint covering the columns `[mulai]` on the table `periode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[akhir]` on the table `periode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `periode_mulai_key` ON `periode`(`mulai`);

-- CreateIndex
CREATE UNIQUE INDEX `periode_akhir_key` ON `periode`(`akhir`);
