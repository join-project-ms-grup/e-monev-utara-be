/*
  Warnings:

  - Added the required column `tahun` to the `rincianIndikator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rincianIndikator` ADD COLUMN `tahun` INTEGER NOT NULL;
