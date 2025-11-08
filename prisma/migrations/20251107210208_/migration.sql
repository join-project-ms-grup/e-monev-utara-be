/*
  Warnings:

  - A unique constraint covering the columns `[tahun]` on the table `dak_tahun` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `dak_tahun_tahun_key` ON `dak_tahun`(`tahun`);
