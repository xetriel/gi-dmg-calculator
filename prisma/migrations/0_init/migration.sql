-- CreateTable
CREATE TABLE `Build` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,
    `enemy` JSON NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Build_characterId_idx`(`characterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rotation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `buildId` VARCHAR(191) NOT NULL,
    `steps` JSON NOT NULL,
    `totalTime` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Rotation_buildId_idx`(`buildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rotation` ADD CONSTRAINT `Rotation_buildId_fkey` FOREIGN KEY (`buildId`) REFERENCES `Build`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
