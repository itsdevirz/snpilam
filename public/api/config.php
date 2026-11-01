<?php
/**
 * Ilam Medical Council Portal - Database & API Config
 * Configures CORS, Content-Type headers and PDO MySQL Connection
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$credentialsFile = __DIR__ . '/db_credentials.json';

function getDbConfig() {
    global $credentialsFile;
    if (file_exists($credentialsFile)) {
        $content = file_get_contents($credentialsFile);
        $data = json_decode($content, true);
        if ($data && isset($data['db_name'])) {
            return $data;
        }
    }
    return null;
}

function getPdoConnection($customConfig = null) {
    $config = $customConfig ? $customConfig : getDbConfig();
    
    if (!$config) {
        throw new Exception("تنظیمات اتصال به دیتابیس در فایل db_credentials.json یافت نشد.");
    }

    $host = !empty($config['db_host']) ? trim($config['db_host']) : 'localhost';
    $port = !empty($config['db_port']) ? trim($config['db_port']) : '3306';
    $dbname = isset($config['db_name']) ? trim($config['db_name']) : '';
    $user = isset($config['db_user']) ? trim($config['db_user']) : '';
    $pass = isset($config['db_pass']) ? $config['db_pass'] : '';

    if (empty($dbname) || empty($user)) {
        throw new Exception("نام دیتابیس یا نام کاربری MySQL تنظیم نشده است.");
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    return new PDO($dsn, $user, $pass, $options);
}
