<?php
/**
 * Ilam Medical Council Portal - Connection Status API
 */

require_once __DIR__ . '/config.php';

$config = getDbConfig();

if (!$config) {
    echo json_encode([
        'configured' => false,
        'message' => 'تنظیمات دیتابیس MySQL هنوز ثبت نشده است.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $pdo = getPdoConnection($config);
    echo json_encode([
        'configured' => true,
        'status' => 'online',
        'db_name' => $config['db_name'],
        'db_host' => $config['db_host'],
        'updated_at' => isset($config['updated_at']) ? $config['updated_at'] : null
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode([
        'configured' => true,
        'status' => 'error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
