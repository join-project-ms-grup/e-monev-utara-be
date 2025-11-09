/*
  Warnings:

  - A unique constraint covering the columns `[no]` on the table `dak_berkas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `no` to the `dak_berkas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dak_berkas` ADD COLUMN `no` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dak_berkas_no_key` ON `dak_berkas`(`no`);
