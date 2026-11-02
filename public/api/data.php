<?php
/**
 * Ilam Medical Council Portal - Fast MySQL REST API for cPanel
 * Performs CRUD & approval status operations for all entities.
 */

require_once __DIR__ . '/config.php';

try {
    $pdo = getPdoConnection();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'عدم امکان اتصال به دیتابیس MySQL: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Auto-migration helper: ensure 'status' column exists in physicians and facilities
try {
    $pdo->exec("ALTER TABLE `physicians` ADD COLUMN `status` VARCHAR(64) DEFAULT 'approved'");
} catch (Exception $e) {}

try {
    $pdo->exec("ALTER TABLE `facilities` ADD COLUMN `status` VARCHAR(64) DEFAULT 'approved'");
} catch (Exception $e) {}

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$allowedTables = [
    'physicians', 'announcements', 'news', 'facilities', 
    'classifieds', 'education', 'regulations', 'services', 
    'messages', 'logs', 'admin_config'
];

// 1. GET ALL DATA (Public & Admin initial load)
if ($action === 'get_all') {
    try {
        $data = [
            'physicians' => $pdo->query("SELECT * FROM physicians ORDER BY created_at DESC")->fetchAll(),
            'announcements' => $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC")->fetchAll(),
            'news' => $pdo->query("SELECT * FROM news ORDER BY created_at DESC")->fetchAll(),
            'facilities' => $pdo->query("SELECT * FROM facilities ORDER BY created_at DESC")->fetchAll(),
            'classifieds' => $pdo->query("SELECT * FROM classifieds ORDER BY created_at DESC")->fetchAll(),
            'education' => $pdo->query("SELECT * FROM education ORDER BY created_at DESC")->fetchAll(),
            'regulations' => $pdo->query("SELECT * FROM regulations ORDER BY created_at DESC")->fetchAll(),
            'services' => $pdo->query("SELECT * FROM services ORDER BY created_at DESC")->fetchAll(),
            'messages' => $pdo->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll(),
            'logs' => $pdo->query("SELECT * FROM logs ORDER BY created_at DESC")->fetchAll(),
        ];

        // Fetch settings
        $settingsRaw = $pdo->query("SELECT setting_key, setting_value FROM admin_config")->fetchAll();
        $settings = [];
        foreach ($settingsRaw as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        $data['settings'] = $settings;

        // Format JSON fields & status defaults
        foreach ($data['physicians'] as &$p) {
            $p['services'] = !empty($p['services']) ? json_decode($p['services'], true) : [];
            if (empty($p['status'])) {
                $p['status'] = 'approved';
            }
        }
        foreach ($data['facilities'] as &$f) {
            $f['services'] = !empty($f['services']) ? json_decode($f['services'], true) : [];
            if (empty($f['status'])) {
                $f['status'] = 'approved';
            }
        }
        foreach ($data['education'] as &$e) {
            $e['targetAudience'] = !empty($e['targetAudience']) ? json_decode($e['targetAudience'], true) : [];
            $e['cmeCredits'] = (int)$e['cmeCredits'];
            $e['capacity'] = (int)$e['capacity'];
            $e['registeredCount'] = (int)$e['registeredCount'];
        }
        foreach ($data['services'] as &$s) {
            $s['prerequisites'] = !empty($s['prerequisites']) ? json_decode($s['prerequisites'], true) : [];
            $s['requiredDocuments'] = !empty($s['requiredDocuments']) ? json_decode($s['requiredDocuments'], true) : [];
            $s['steps'] = !empty($s['steps']) ? json_decode($s['steps'], true) : [];
            $s['downloadableForms'] = !empty($s['downloadableForms']) ? json_decode($s['downloadableForms'], true) : [];
        }
        foreach ($data['announcements'] as &$a) {
            $a['isUrgent'] = (bool)$a['isUrgent'];
        }
        foreach ($data['news'] as &$n) {
            $n['isFeatured'] = (bool)$n['isFeatured'];
        }

        echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// 2. SAVE OR UPDATE INDIVIDUAL ITEM
if ($action === 'save_item' && $input) {
    $table = isset($input['table']) ? trim($input['table']) : '';
    $item = isset($input['item']) ? $input['item'] : null;

    if (!in_array($table, $allowedTables) || !$item || empty($item['id'])) {
        echo json_encode(['success' => false, 'error' => 'نام جدول یا داده ارسالی نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        $cols = [];
        $placeholders = [];
        $updateParts = [];
        $params = [];

        foreach ($item as $key => $val) {
            if ($key === 'created_at') continue;

            $cols[] = "`$key`";
            $placeholders[] = ":$key";
            if ($key !== 'id') {
                $updateParts[] = "`$key` = VALUES(`$key`)";
            }

            if (is_array($val) || is_object($val)) {
                $params[":$key"] = json_encode($val, JSON_UNESCAPED_UNICODE);
            } elseif (is_bool($val)) {
                $params[":$key"] = $val ? 1 : 0;
            } else {
                $params[":$key"] = $val;
            }
        }

        $sql = "INSERT INTO `$table` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $placeholders) . ") ";
        if (!empty($updateParts)) {
            $sql .= "ON DUPLICATE KEY UPDATE " . implode(', ', $updateParts);
        } else {
            $sql .= "ON DUPLICATE KEY UPDATE `id` = `id`";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'اطلاعات با موفقیت در دیتابیس MySQL ذخیره گردید.'], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// 3. APPROVE OR REJECT ITEM STATUS
if ($action === 'approve_item' && $input) {
    $table = isset($input['table']) ? trim($input['table']) : '';
    $id = isset($input['id']) ? trim($input['id']) : '';
    $status = isset($input['status']) ? trim($input['status']) : 'approved';

    if (!in_array($table, ['physicians', 'facilities']) || empty($id)) {
        echo json_encode(['success' => false, 'error' => 'اطلاعات تایید درخواست نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE `$table` SET `status` = :status WHERE `id` = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode([
            'success' => true,
            'message' => $status === 'approved' ? 'درخواست با موفقیت تایید و در سایت منتشر شد.' : 'درخواست رد شد.'
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// 4. DELETE INDIVIDUAL ITEM
if ($action === 'delete_item' && $input) {
    $table = isset($input['table']) ? trim($input['table']) : '';
    $id = isset($input['id']) ? trim($input['id']) : '';

    if (!in_array($table, $allowedTables) || empty($id)) {
        echo json_encode(['success' => false, 'error' => 'اطلاعات برای حذف نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `$table` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'آیتم با موفقیت از دیتابیس حذف شد.'], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

echo json_encode(['success' => false, 'error' => 'دستور ارسالی نامعتبر است.'], JSON_UNESCAPED_UNICODE);
