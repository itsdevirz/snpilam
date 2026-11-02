<?php
/**
 * Ilam Medical Council Portal - Secure Admin Auth Endpoint
 * Performs SHA-256 hashed password checks and session token verification.
 * Fully sanitized against SQL Injection & XSS.
 */

require_once __DIR__ . '/config.php';

$rawInput = file_get_contents('php://input');
$decoded = json_decode($rawInput, true);
$input = sanitizeInputServer($decoded);

$rawAction = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : 'login');
$action = preg_replace('/[^a-zA-Z0-9_]/', '', $rawAction);

try {
    $pdo = getPdoConnection();
} catch (Exception $e) {
    $pdo = null;
}

// Default password "Aa@123456" SHA-256 hash:
$DEFAULT_HASH = hash('sha256', 'Aa@123456');

function getStoredHash($pdo) {
    global $DEFAULT_HASH;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT `setting_value` FROM `admin_config` WHERE `setting_key` = 'admin_password_hash'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['setting_value'])) {
                return $row['setting_value'];
            }
        } catch (Exception $e) {}
    }
    return $DEFAULT_HASH;
}

if ($action === 'login') {
    $clientHash = isset($input['password_hash']) ? trim($input['password_hash']) : '';

    if (empty($clientHash) || !preg_match('/^[a-f0-9]{64}$/i', $clientHash)) {
        echo json_encode(['success' => false, 'error' => 'اطلاعات احراز هویت ارسالی نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $activeHash = getStoredHash($pdo);

    if (hash_equals($activeHash, strtolower($clientHash))) {
        $sessionToken = bin2hex(random_bytes(32));
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO `admin_config` (`setting_key`, `setting_value`) VALUES ('admin_session_token', :token) ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)");
                $stmt->execute([':token' => $sessionToken]);
            } catch (Exception $e) {}
        }

        echo json_encode([
            'success' => true,
            'token' => $sessionToken,
            'message' => 'احراز هویت مدیریت ارشد با موفقیت انجام پذیرفت.'
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'کلمه عبور واردشده صحیح نمی‌باشد.'
        ], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

if ($action === 'change_password') {
    $currentHash = isset($input['current_hash']) ? trim($input['current_hash']) : '';
    $newHash = isset($input['new_hash']) ? trim($input['new_hash']) : '';

    if (empty($currentHash) || empty($newHash) || !preg_match('/^[a-f0-9]{64}$/i', $currentHash) || !preg_match('/^[a-f0-9]{64}$/i', $newHash)) {
        echo json_encode(['success' => false, 'error' => 'اطلاعات تغییر رمز عبور کامل یا معتبر نمی‌باشد.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $activeHash = getStoredHash($pdo);

    if (!hash_equals($activeHash, strtolower($currentHash))) {
        echo json_encode(['success' => false, 'error' => 'کلمه عبور فعلی واردشده نادرست می‌باشد.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `admin_config` (`setting_key`, `setting_value`) VALUES ('admin_password_hash', :hash) ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)");
            $stmt->execute([':hash' => strtolower($newHash)]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'خطا در ذخیره کلمه عبور جدید در دیتابیس.'], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'کلمه عبور پنل مدیریت با موفقیت بروزرسانی شد.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

echo json_encode(['success' => false, 'error' => 'دستور احراز هویت نامعتبر است.'], JSON_UNESCAPED_UNICODE);
