/*
  Warnings:

  - Added the required column `shortname` to the `skpd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `skpd` ADD COLUMN `shortname` VARCHAR(191) NOT NULL;
