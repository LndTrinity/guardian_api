-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `senha` VARCHAR(60) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispositivos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelo` VARCHAR(45) NOT NULL,
    `numero_de_serie` VARCHAR(45) NOT NULL,
    `data_fabricacao` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispositivo_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `intervalo_envio` INTEGER NOT NULL,
    `standby` BOOLEAN NOT NULL,
    `dispositivoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alertas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(45) NOT NULL,
    `ativo` BOOLEAN NOT NULL,
    `dispositivoId` INTEGER NOT NULL,
    `alertaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alertas_tipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `regra` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localizacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `longitude` DECIMAL(65, 30) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `dispositivoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dispositivo_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_hora` DATETIME(3) NOT NULL,
    `status_bateria` VARCHAR(10) NOT NULL,
    `descricao` VARCHAR(45) NULL,
    `banda_dados` VARCHAR(45) NOT NULL,
    `dispositivoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(45) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dispositivos` ADD CONSTRAINT `dispositivos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispositivo_config` ADD CONSTRAINT `dispositivo_config_dispositivoId_fkey` FOREIGN KEY (`dispositivoId`) REFERENCES `dispositivos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alertas` ADD CONSTRAINT `alertas_dispositivoId_fkey` FOREIGN KEY (`dispositivoId`) REFERENCES `dispositivos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alertas` ADD CONSTRAINT `alertas_alertaId_fkey` FOREIGN KEY (`alertaId`) REFERENCES `alertas_tipo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `localizacoes` ADD CONSTRAINT `localizacoes_dispositivoId_fkey` FOREIGN KEY (`dispositivoId`) REFERENCES `dispositivos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dispositivo_log` ADD CONSTRAINT `dispositivo_log_dispositivoId_fkey` FOREIGN KEY (`dispositivoId`) REFERENCES `dispositivos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_log` ADD CONSTRAINT `usuario_log_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
