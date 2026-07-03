-- CreateTable
CREATE TABLE `ExportLog` (
    `id` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `snapshot` JSON NOT NULL,
    `summary` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ExportLog_characterId_createdAt_idx`(`characterId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
