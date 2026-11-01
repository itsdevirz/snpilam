<?php
/**
 * Ilam Medical Council Portal - MySQL Connection Tester & Table Bootstrapper
 * Accepts DB credentials, tests PDO connection, auto-creates tables, and saves configuration.
 */

require_once __DIR__ . '/config.php';

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    echo json_encode([
        'success' => false,
        'error' => 'اطلاعات ارسالی نامعتبر است (فرمت JSON معتبر نیست).'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$host = !empty($input['db_host']) ? trim($input['db_host']) : 'localhost';
$port = !empty($input['db_port']) ? trim($input['db_port']) : '3306';
$dbname = isset($input['db_name']) ? trim($input['db_name']) : '';
$user = isset($input['db_user']) ? trim($input['db_user']) : '';
$pass = isset($input['db_pass']) ? $input['db_pass'] : '';
$saveConfig = isset($input['save_config']) ? (bool)$input['save_config'] : true;

if (empty($dbname)) {
    echo json_encode([
        'success' => false,
        'error' => 'لطفاً نام دیتابیس را مشخص کنید.',
        'reason' => 'فیلد نام دیتابیس (Database Name) خالی است.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if (empty($user)) {
    echo json_encode([
        'success' => false,
        'error' => 'لطفاً نام کاربری دیتابیس را مشخص کنید.',
        'reason' => 'فیلد نام کاربری دیتابیس (Database User) خالی است.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // Step 1: Try raw connection to MySQL host first (to give precise host/auth error before database check)
    $dsnNoDb = "mysql:host={$host};port={$port};charset=utf8mb4";
    $pdoHost = new PDO($dsnNoDb, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);

    // Try auto-creating database if missing and user has permissions
    try {
        $pdoHost->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    } catch (Exception $e) {
        // Ignored if user lacks global privilege, PDO connection below will verify existence
    }

    // Step 2: Connect to target database
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 5,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);

    // Step 3: Auto-create required database tables
    $tableSchemas = [
        "physicians" => "CREATE TABLE IF NOT EXISTS `physicians` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "announcements" => "CREATE TABLE IF NOT EXISTS `announcements` (
            `id` VARCHAR(64) PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `date` VARCHAR(64) NOT NULL,
            `category` VARCHAR(128) NOT NULL,
            `isUrgent` TINYINT(1) DEFAULT 0,
            `priority` VARCHAR(64) DEFAULT 'عادی',
            `summary` TEXT,
            `content` LONGTEXT,
            `expirationDate` VARCHAR(64) DEFAULT '',
            `docNumber` VARCHAR(128) DEFAULT '',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "news" => "CREATE TABLE IF NOT EXISTS `news` (
            `id` VARCHAR(64) PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `date` VARCHAR(64) NOT NULL,
            `category` VARCHAR(128) NOT NULL,
            `summary` TEXT,
            `content` LONGTEXT,
            `readTime` VARCHAR(64) DEFAULT '',
            `imageUrl` TEXT,
            `isFeatured` TINYINT(1) DEFAULT 0,
            `source` VARCHAR(255) DEFAULT '',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "facilities" => "CREATE TABLE IF NOT EXISTS `facilities` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "classifieds" => "CREATE TABLE IF NOT EXISTS `classifieds` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "education" => "CREATE TABLE IF NOT EXISTS `education` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "regulations" => "CREATE TABLE IF NOT EXISTS `regulations` (
            `id` VARCHAR(64) PRIMARY KEY,
            `title` VARCHAR(255) NOT NULL,
            `docNumber` VARCHAR(128) NOT NULL,
            `date` VARCHAR(64),
            `issuingBody` VARCHAR(255),
            `category` VARCHAR(128),
            `description` TEXT,
            `fileSize` VARCHAR(64),
            `fileFormat` VARCHAR(64),
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "services" => "CREATE TABLE IF NOT EXISTS `services` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "messages" => "CREATE TABLE IF NOT EXISTS `messages` (
            `id` VARCHAR(64) PRIMARY KEY,
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
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "logs" => "CREATE TABLE IF NOT EXISTS `logs` (
            `id` VARCHAR(64) PRIMARY KEY,
            `action` VARCHAR(255) NOT NULL,
            `target` VARCHAR(255) NOT NULL,
            `timestamp` VARCHAR(128) NOT NULL,
            `user` VARCHAR(128) NOT NULL,
            `type` VARCHAR(64) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

        "admin_config" => "CREATE TABLE IF NOT EXISTS `admin_config` (
            `setting_key` VARCHAR(128) PRIMARY KEY,
            `setting_value` LONGTEXT NOT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
    ];

    $createdTables = [];
    foreach ($tableSchemas as $tableName => $sql) {
        $pdo->exec($sql);
        $createdTables[] = $tableName;
    }

    // Step 4: Save credentials if requested
    if ($saveConfig) {
        $configToSave = [
            'db_host' => $host,
            'db_port' => $port,
            'db_name' => $dbname,
            'db_user' => $user,
            'db_pass' => $pass,
            'status' => 'connected',
            'tables_count' => count($createdTables),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        file_put_contents($credentialsFile, json_encode($configToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    echo json_encode([
        'success' => true,
        'message' => 'اتصال به دیتابیس MySQL با موفقیت برقرار شد و کلیه جداول سامانه آماده‌سازی شدند.',
        'details' => [
            'host' => $host,
            'port' => $port,
            'database' => $dbname,
            'user' => $user,
            'tables_verified' => count($createdTables),
            'tables_list' => $createdTables
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    $code = (int)$e->getCode();
    $rawMsg = $e->getMessage();
    $reason = "خطا در برقرار ارتباط با دیتابیس MySQL.";

    if (strpos($rawMsg, 'Access denied') !== false || $code === 1045) {
        $reason = "خطای احراز هویت MySQL (کد 1045): نام کاربری ($user) یا کلمه عبور واردشده اشتباه است یا دسترسی لازم را ندارد.";
    } elseif (strpos($rawMsg, 'Unknown database') !== false || $code === 1049) {
        $reason = "دیتابیس یافت نشد (کد 1049): دیتابیسی با نام '$dbname' روی سرور MySQL وجود ندارد. لطفاً آن را در بخش MySQL Databases هاست cPanel ایجاد کنید.";
    } elseif (strpos($rawMsg, "Can't connect to MySQL server") !== false || strpos($rawMsg, "Unknown MySQL server host") !== false || $code === 2002) {
        $reason = "خطای شبکه/میزبان (کد 2002): سرور MySQL در آدرس '$host:$port' پاسخگو نیست. در هاست cPanel معمولاً آدرس Host برابر 'localhost' است.";
    } elseif (strpos($rawMsg, "Connection refused") !== false) {
        $reason = "ارتباط توسط پورت $port پذیرفته نشد. لطفاً پورت دیتابیس را بررسی کنید (پیش‌فرض 3306).";
    } else {
        $reason = "جزئیات خطای MySQL: " . $rawMsg;
    }

    echo json_encode([
        'success' => false,
        'error' => "اتصال به دیتابیس برقرار نشد.",
        'reason' => $reason,
        'raw_error' => $rawMsg,
        'code' => $code
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => "خطا در سیستم.",
        'reason' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
