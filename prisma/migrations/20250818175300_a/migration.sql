/*
  Warnings:

  - You are about to drop the column `activade` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dispositivos` ADD COLUMN `activade` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `activade`;
