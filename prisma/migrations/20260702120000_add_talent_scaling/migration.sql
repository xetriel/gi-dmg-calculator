-- CreateTable
CREATE TABLE `TalentScaling` (
    `id` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,
    `talentType` VARCHAR(191) NOT NULL,
    `hitKey` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `kind` VARCHAR(191) NOT NULL DEFAULT 'damage',

    INDEX `TalentScaling_characterId_idx`(`characterId`),
    UNIQUE INDEX `TalentScaling_characterId_talentType_hitKey_level_key`(`characterId`, `talentType`, `hitKey`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
