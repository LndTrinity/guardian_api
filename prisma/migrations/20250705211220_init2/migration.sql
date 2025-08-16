/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `email` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tokens` DROP FOREIGN KEY `Tokens_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Tokens_usuarioId_fkey` ON `tokens`;

-- AlterTable
ALTER TABLE `tokens` DROP COLUMN `usuarioId`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `email` VARCHAR(20) NOT NULL;
