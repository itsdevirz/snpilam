-- =========================================================
-- Ilam Province Medical Council Portal (پورتال سازمان نظام پزشکی ایلام)
-- MySQL Database Schema for cPanel Upload
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: physicians (پزشکان و اعضای کادر درمان)
CREATE TABLE IF NOT EXISTS `physicians` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `medicalRegNo` VARCHAR(64) NOT NULL,
  `specialtyGroup` VARCHAR(128) NOT NULL,
  `specialty` VARCHAR(255) NOT NULL,
  `subSpecialty` VARCHAR(255) DEFAULT '',
  `city` VARCHAR(128) NOT NULL,
  `county` VARCHAR(128) NOT NULL,
  `clinicName` VARCHAR(255) DEFAULT '',
  `address` TEXT,
  `phone` VARCHAR(128),
  `licenseStatus` VARCHAR(128),
  `consultationDays` TEXT,
  `consultationHours` VARCHAR(128),
  `services` TEXT,
  `status` VARCHAR(64) DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: announcements (اطلاعیه‌ها و ابلاغیه‌ها)
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(64) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `isUrgent` TINYINT(1) DEFAULT 0,
  `priority` VARCHAR(64) DEFAULT 'عادی',
  `summary` TEXT,
  `content` LONGTEXT,
  `expirationDate` VARCHAR(64) DEFAULT '',
  `docNumber` VARCHAR(128) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: news (اخبار و گزارش‌های سازمان)
CREATE TABLE IF NOT EXISTS `news` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(64) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `summary` TEXT,
  `content` LONGTEXT,
  `readTime` VARCHAR(64) DEFAULT '',
  `imageUrl` TEXT,
  `isFeatured` TINYINT(1) DEFAULT 0,
  `source` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: facilities (مراکز درمانی و تشخیصی)
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(128) NOT NULL,
  `county` VARCHAR(128) NOT NULL,
  `city` VARCHAR(128) NOT NULL,
  `manager` VARCHAR(255) DEFAULT '',
  `technicalSupervisor` VARCHAR(255) DEFAULT '',
  `address` TEXT,
  `phone` VARCHAR(128),
  `workingHours` VARCHAR(128),
  `licenseStatus` VARCHAR(128),
  `services` TEXT,
  `status` VARCHAR(64) DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: classifieds (نیازمندی‌ها و فرصت‌های شغلی)
CREATE TABLE IF NOT EXISTS `classifieds` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `county` VARCHAR(128) NOT NULL,
  `city` VARCHAR(128) NOT NULL,
  `specialtyGroup` VARCHAR(128) DEFAULT '',
  `description` TEXT,
  `publishDate` VARCHAR(64),
  `expirationDate` VARCHAR(64),
  `contactName` VARCHAR(255),
  `contactPhone` VARCHAR(128),
  `status` VARCHAR(64) DEFAULT 'active',
  `compensation` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: education (دوره‌های بازآموزی CME)
CREATE TABLE IF NOT EXISTS `education` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(128) NOT NULL,
  `cmeCredits` INT DEFAULT 0,
  `date` VARCHAR(64),
  `time` VARCHAR(64),
  `venue` TEXT,
  `instructor` VARCHAR(255),
  `targetAudience` TEXT,
  `capacity` INT DEFAULT 0,
  `registeredCount` INT DEFAULT 0,
  `registrationStatus` VARCHAR(64) DEFAULT 'open',
  `fee` VARCHAR(128),
  `officialSystemCode` VARCHAR(128),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: regulations (بخشنامه‌ها و آیین‌نامه‌ها)
CREATE TABLE IF NOT EXISTS `regulations` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `docNumber` VARCHAR(128) NOT NULL,
  `date` VARCHAR(64),
  `issuingBody` VARCHAR(255),
  `category` VARCHAR(128),
  `description` TEXT,
  `fileSize` VARCHAR(64),
  `fileFormat` VARCHAR(64),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: services (خدمات اعضا و راهنماهای اداری)
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `summary` TEXT,
  `description` LONGTEXT,
  `prerequisites` TEXT,
  `requiredDocuments` TEXT,
  `steps` TEXT,
  `department` VARCHAR(255),
  `phoneExtension` VARCHAR(64),
  `processingTime` VARCHAR(128),
  `feeInfo` TEXT,
  `downloadableForms` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: messages (پیام‌ها، شکایات و استعلامات)
CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(64) NOT NULL,
  `fullName` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(128) NOT NULL,
  `email` VARCHAR(255) DEFAULT '',
  `department` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `date` VARCHAR(64) NOT NULL,
  `type` VARCHAR(64) DEFAULT 'inquiry',
  `status` VARCHAR(64) DEFAULT 'new',
  `adminReply` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: logs (ثبت تغییرات و وقایع)
CREATE TABLE IF NOT EXISTS `logs` (
  `id` VARCHAR(64) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `timestamp` VARCHAR(128) NOT NULL,
  `user` VARCHAR(128) NOT NULL,
  `type` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: admin_config (تنظیمات پنل مدیریت)
CREATE TABLE IF NOT EXISTS `admin_config` (
  `setting_key` VARCHAR(128) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
