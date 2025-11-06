/*
  Warnings:

  - Added the required column `tahun_ke` to the `paguIndikatif` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paguIndikatif` ADD COLUMN `tahun_ke` INTEGER NOT NULL;
