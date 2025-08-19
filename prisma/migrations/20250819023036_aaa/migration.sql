-- AlterTable
ALTER TABLE `dispositivos` ADD COLUMN `status` ENUM('Em_movimento', 'Parado', 'Ligado', 'Desligado', 'Standby') NOT NULL DEFAULT 'Desligado';
