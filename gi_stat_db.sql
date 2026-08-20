-- =====================================================================
--  Genshin Damage Calculator — Initial Database Schema (Phase 1)
--  Target : MySQL 8.0.13+  (built for MySQL Workbench)
--  Mirrors : Prisma models `Build` + `Rotation` from the implementation plan
--  Run it : Workbench → File ▸ Open SQL Script ▸ (this file) → Execute (⚡)
--
--  Design notes:
--   * `data`, `enemy`, `steps` are JSON columns — a build/rotation is stored
--     as a whole snapshot (per the plan's "JSON column, not normalized" choice).
--   * Primary keys default to UUID() so you can INSERT manually in Workbench.
--     The plan used app-generated cuid(); see the "Prisma reconciliation"
--     block at the bottom to keep either approach in sync.
--   * updatedAt auto-bumps on UPDATE for convenience when editing in Workbench;
--     Prisma will also set it explicitly, which is harmless.
-- =====================================================================

-- ---- Optional reset: uncomment these two lines to wipe & rebuild -----
-- DROP TABLE IF EXISTS `Rotation`;   -- child first (FK)
-- DROP TABLE IF EXISTS `Build`;

CREATE DATABASE IF NOT EXISTS `gi_calc`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `gi_calc`;

-- ---------------------------------------------------------------------
--  Build — one saved character build = a snapshot of calculator inputs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Build` (
  `id`          CHAR(36)      NOT NULL DEFAULT (UUID()),
  `name`        VARCHAR(191)  NOT NULL,
  `characterId` VARCHAR(191)  NOT NULL,          -- registry id, e.g. 'arlecchino' (not a FK)
  `data`        JSON          NOT NULL,          -- stat inputs: {atk:{base,flat}, critRate, critDmg, em, ...}
  `enemy`       JSON          NOT NULL,          -- {levelChar, levelEnemy, enemyRes, defReduction, defIgnore}
  `notes`       TEXT          NULL,
  `createdAt`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Build_characterId_idx` (`characterId`), -- filter builds by character (sidebar grouping)
  INDEX `Build_updatedAt_idx`   (`updatedAt`)    -- "recent builds" ordering (listBuilds query)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Rotation — an ordered list of steps belonging to a Build
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Rotation` (
  `id`        CHAR(36)     NOT NULL DEFAULT (UUID()),
  `name`      VARCHAR(191) NOT NULL,
  `buildId`   CHAR(36)     NOT NULL,             -- FK → Build.id (types must match: CHAR(36))
  `steps`     JSON         NOT NULL,             -- ordered RotationStep[]: [{talentKey,count,reaction,critMode,...}]
  `totalTime` DOUBLE       NULL,                 -- seconds; optional, only when computing DPS
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Rotation_buildId_idx` (`buildId`),
  CONSTRAINT `Rotation_buildId_fkey`
    FOREIGN KEY (`buildId`) REFERENCES `Build` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,          -- deleting a build removes its rotations
  CONSTRAINT `Rotation_totalTime_nonneg`
    CHECK (`totalTime` IS NULL OR `totalTime` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Weapon — weapon definitions, base stats at Lv90, passives & support buffs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Weapon` (
  `id`           VARCHAR(191)  NOT NULL,          -- e.g. 'crimson-moons-semblance'
  `name`         VARCHAR(191)  NOT NULL,
  `type`         VARCHAR(32)   NOT NULL,          -- 'Sword' | 'Claymore' | 'Polearm' | 'Bow' | 'Catalyst'
  `rarity`       INT           NOT NULL,          -- 1..5
  `baseAtk`      DOUBLE        NOT NULL,          -- Lv90 Base ATK
  `subStatType`  VARCHAR(64)   NULL,              -- 'em' | 'critRate' | 'critDmg' | 'atkPct' | etc.
  `subStatValue` DOUBLE        NULL,              -- Lv90 Substat value
  `passiveName`  VARCHAR(191)  NULL,
  `passiveDesc`  TEXT          NULL,
  `isSupport`    BOOLEAN       NOT NULL DEFAULT FALSE,
  `buffType`     VARCHAR(32)   NULL DEFAULT 'self', -- 'team' | 'self' | 'both'
  `buffConfig`   JSON          NULL,
  `createdAt`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Weapon_type_idx` (`type`),
  INDEX `Weapon_isSupport_idx` (`isSupport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Artifact — artifact set definitions, set piece effects & team buffs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Artifact` (
  `id`            VARCHAR(191)  NOT NULL,          -- e.g. 'scarlet-proof', 'heart-of-the-furnace'
  `name`          VARCHAR(191)  NOT NULL,
  `rarity`        INT           NOT NULL,          -- 4..5
  `twoPieceDesc`  TEXT          NOT NULL,
  `fourPieceDesc` TEXT          NOT NULL,
  `isSupport`     BOOLEAN       NOT NULL DEFAULT FALSE,
  `buffType`      VARCHAR(32)   NULL DEFAULT 'self', -- 'team' | 'self' | 'both'
  `buffConfig`    JSON          NULL,
  `createdAt`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Artifact_isSupport_idx` (`isSupport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =====================================================================
--  OPTIONAL — smoke-test seed (matches Phase-1 Task T7). Safe to skip.
--  Uses explicit ids so the Rotation can reference the Build.
-- =====================================================================
INSERT INTO `Build` (`id`, `name`, `characterId`, `data`, `enemy`, `notes`) VALUES
  ('seed-build-arlecchino-0001', 'Smoke Test — Arlecchino', 'arlecchino',
   JSON_OBJECT(
     'hp',  JSON_OBJECT('base', 13103, 'flat', 6270),
     'atk', JSON_OBJECT('base', 1016,  'flat', 1470),
     'def', JSON_OBJECT('base', 765,   'flat', 146),
     'em', 16, 'critRate', 80.3, 'critDmg', 227.5,
     'energyRecharge', 111, 'dmgBonus', 46.6, 'healingBonus', 0
   ),
   JSON_OBJECT('levelChar', 90, 'levelEnemy', 100, 'enemyRes', 10, 'defReduction', 0, 'defIgnore', 0),
   'Created from schema seed to verify the tables.');

INSERT INTO `Rotation` (`id`, `name`, `buildId`, `steps`, `totalTime`) VALUES
  ('seed-rotation-arlecchino-0001', 'Sample combo', 'seed-build-arlecchino-0001',
   JSON_ARRAY(
     JSON_OBJECT('id','s1','talentKey','na.1Hit',      'label','1-Hit',     'count',1,'reaction','none',    'critMode','avg'),
     JSON_OBJECT('id','s2','talentKey','skill.spike',  'label','Spike',     'count',1,'reaction','vaporize','critMode','avg'),
     JSON_OBJECT('id','s3','talentKey','burst.skillDmg','label','Skill DMG','count',1,'reaction','none',    'critMode','avg')
   ),
   12.5);

INSERT INTO `Weapon` (`id`, `name`, `type`, `rarity`, `baseAtk`, `subStatType`, `subStatValue`, `passiveName`, `passiveDesc`, `isSupport`, `buffType`, `buffConfig`) VALUES
  ('crimson-moons-semblance', 'Crimson Moon''s Semblance', 'Polearm', 5, 674, 'critRate', 22.1, 'Ashen Sun''s Shadow',
   'Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. This effect can be triggered up to once every 14s. In addition, when the equipping character has a Bond of Life, they gain a 12~28% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, then gain an additional 24~56% DMG.',
   FALSE, 'self', JSON_OBJECT('dmgBonusWithBol', JSON_ARRAY(12,16,20,24,28), 'dmgBonusBol30', JSON_ARRAY(24,32,40,48,56))),
  ('a-thousand-floating-dreams', 'A Thousand Floating Dreams', 'Catalyst', 5, 542, 'em', 265, 'A Thousand Nights'' Dawnsong',
   'Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by 32~64. If not, increase the equipping character''s DMG Bonus from their Elemental Type by 10~26%. Each of the aforementioned effects can have up to 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by 40~48. Multiple such effects from multiple such weapons can stack.',
   TRUE, 'both', JSON_OBJECT('partyEm', JSON_ARRAY(40,42,44,46,48), 'sameElementEm', JSON_ARRAY(32,40,48,56,64), 'diffElementDmgBonus', JSON_ARRAY(10,14,18,22,26)));

INSERT INTO `Artifact` (`id`, `name`, `rarity`, `twoPieceDesc`, `fourPieceDesc`, `isSupport`, `buffType`, `buffConfig`) VALUES
  ('scarlet-proof', 'Scarlet Proof', 5,
   'ATK increased by 18%.',
   'Increases the equipping character''s CRIT Rate by 16%, and their Stellar Swirl reaction dealt by 40%, for 10s after they trigger a Stellar Swirl reaction.',
   FALSE, 'self', JSON_OBJECT('twoPieceAtkPct', 18, 'fourPieceCritRate', 16, 'fourPieceStellarSwirlDmg', 40)),
  ('heart-of-the-furnace', 'Heart of the Furnace', 5,
   'ATK increased by 18%.',
   'Increases the equipping character''s ATK by 12% for 12s when they trigger a Stellar Glimmer reaction or deal Stellar Glimmer reaction DMG. Also increases Stellar Glimmer reaction DMG dealt by all nearby party members by 50%. The above effects can trigger even when the equipping character is not on the field, and the DMG bonus from multiple Artifact Sets with the same name do not stack.',
   TRUE, 'both', JSON_OBJECT('twoPieceAtkPct', 18, 'fourPieceWielderAtkPct', 12, 'fourPiecePartyStellarGlimmerDmg', 50));


-- ---- Verify ----
SHOW TABLES;
SELECT `id`, `name`, `characterId`, `createdAt` FROM `Build`;
SELECT `id`, `name`, `buildId`, JSON_LENGTH(`steps`) AS step_count, `totalTime` FROM `Rotation`;

-- =====================================================================
--  future export-history table (Plan 2, export phase).
--  Left commented; uncomment when you add PDF/PNG export records.
-- =====================================================================
-- CREATE TABLE IF NOT EXISTS `ExportRecord` (
--   `id`         CHAR(36)     NOT NULL DEFAULT (UUID()),
--   `rotationId` CHAR(36)     NOT NULL,
--   `format`     ENUM('csv','json','xlsx','pdf','png') NOT NULL,
--   `total`      DOUBLE       NULL,        -- computed rotation total at export time
--   `createdAt`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--   PRIMARY KEY (`id`),
--   INDEX `ExportRecord_rotationId_idx` (`rotationId`),
--   CONSTRAINT `ExportRecord_rotationId_fkey`
--     FOREIGN KEY (`rotationId`) REFERENCES `Rotation` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
--  PRISMA RECONCILIATION (read once, then pick a lane)
--
--  Because these tables already exist, do NOT run `prisma migrate dev`
--  (it would try to re-create them). Instead go database-first:
--     1) npx prisma db pull      -- introspect this schema into schema.prisma
--     2) npx prisma generate     -- regenerate the typed client
--
--  Prisma will represent the id columns like this after db pull:
--     id CHAR(36) DEFAULT (UUID())  ->  `id String @id @default(uuid()) @db.Char(36)`
--
--  If you'd rather keep the plan's cuid() ids instead of DB UUIDs:
--     * change both `id` columns to  VARCHAR(191) NOT NULL  (remove DEFAULT (UUID())),
--       and change `buildId` to VARCHAR(191) to match,
--     * let the app supply ids via  `@id @default(cuid())`.
-- =====================================================================