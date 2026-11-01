<?php
/**
 * Ilam Medical Council Portal - Fast MySQL REST API for cPanel
 * Performs CRUD operations for all entities (Physicians, Announcements, News, Facilities, Classifieds, Education, Regulations, Services, Messages, Logs, Settings)
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

        // Fetch settings (e.g. custom admin password if set)
        $settingsRaw = $pdo->query("SELECT setting_key, setting_value FROM admin_config")->fetchAll();
        $settings = [];
        foreach ($settingsRaw as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        $data['settings'] = $settings;

        // Decode JSON fields & format types
        foreach ($data['physicians'] as &$p) {
            $p['services'] = !empty($p['services']) ? json_decode($p['services'], true) : [];
        }
        foreach ($data['facilities'] as &$f) {
            $f['services'] = !empty($f['services']) ? json_decode($f['services'], true) : [];
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
            // Ignore created_at if passed from client
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

// 3. DELETE INDIVIDUAL ITEM
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

// 4. BULK SYNC ALL DATA
if ($action === 'sync_all' && $input) {
    try {
        $pdo->beginTransaction();

        foreach ($allowedTables as $table) {
            if ($table === 'admin_config') continue;
            if (isset($input[$table]) && is_array($input[$table])) {
                $pdo->exec("DELETE FROM `$table`");
                if (empty($input[$table])) continue;

                foreach ($input[$table] as $item) {
                    if (empty($item['id'])) continue;
                    $cols = [];
                    $placeholders = [];
                    $params = [];

                    foreach ($item as $k => $v) {
                        if ($k === 'created_at') continue;
                        $cols[] = "`$k`";
                        $placeholders[] = ":$k";

                        if (is_array($v) || is_object($v)) {
                            $params[":$k"] = json_encode($v, JSON_UNESCAPED_UNICODE);
                        } elseif (is_bool($v)) {
                            $params[":$k"] = $v ? 1 : 0;
                        } else {
                            $params[":$k"] = $v;
                        }
                    }

                    $sql = "INSERT INTO `$table` (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $placeholders) . ")";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                }
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'تمامی اطلاعات با موفقیت با دیتابیس MySQL همگام‌سازی شدند.'], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// 5. SAVE SYSTEM SETTING (e.g., admin password)
if ($action === 'save_setting' && $input) {
    $key = isset($input['key']) ? trim($input['key']) : '';
    $value = isset($input['value']) ? $input['value'] : '';

    if (empty($key)) {
        echo json_encode(['success' => false, 'error' => 'کلید تنظیمات نامعتبر است.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO `admin_config` (`setting_key`, `setting_value`) VALUES (:key, :val) ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)");
        $stmt->execute([':key' => $key, ':val' => (is_array($value) || is_object($value)) ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value]);

        echo json_encode(['success' => true, 'message' => 'تنظیمات در دیتابیس ذخیره شد.'], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

echo json_encode(['success' => false, 'error' => 'دستور ارسالی نامعتبر است.'], JSON_UNESCAPED_UNICODE);
