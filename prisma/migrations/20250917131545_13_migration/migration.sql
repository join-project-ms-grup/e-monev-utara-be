/*
  Warnings:

  - The values [Program,Kegiatan,SubKegiatan,IndikatorProgram,IndikatorKegiatan,IndikatorSubKegiatan] on the enum `LogMaster_entity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `LogMaster` MODIFY `entity` ENUM('urusan', 'bidang', 'program', 'kegiatan', 'subKegiatan') NOT NULL;
