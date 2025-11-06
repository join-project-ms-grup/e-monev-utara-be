/*
  Warnings:

  - A unique constraint covering the columns `[skpd_periode_id,master_id]` on the table `indikator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `indikator_skpd_periode_id_master_id_key` ON `indikator`(`skpd_periode_id`, `master_id`);
