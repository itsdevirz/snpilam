<?php
/**
 * Ilam Medical Council Portal - MySQL REST Data API for cPanel
 * Handles CRUD operations for physicians, announcements, news, facilities, classifieds, education, regulations, services, messages, and logs.
 */

require_once __DIR__ . '/config.php';

try {
    $pdo = getPdoConnection();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

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

        // Format JSON encoded fields inside records
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

if ($action === 'sync_all' && $input) {
    try {
        $pdo->beginTransaction();
        
        $entityTables = [
            'physicians' => 'id',
            'announcements' => 'id',
            'news' => 'id',
            'facilities' => 'id',
            'classifieds' => 'id',
            'education' => 'id',
            'regulations' => 'id',
            'services' => 'id',
            'messages' => 'id',
            'logs' => 'id'
        ];

        foreach ($entityTables as $table => $idCol) {
            if (isset($input[$table]) && is_array($input[$table])) {
                $pdo->exec("DELETE FROM `$table`");
                if (empty($input[$table])) continue;

                foreach ($input[$table] as $item) {
                    $keys = array_keys($item);
                    $escapedCols = array_map(function($k) { return "`$k`"; }, $keys);
                    $placeholders = array_map(function($k) { return ":$k"; }, $keys);

                    $sql = "INSERT INTO `$table` (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $placeholders) . ")";
                    $stmt = $pdo->prepare($sql);

                    $params = [];
                    foreach ($item as $k => $v) {
                        if (is_array($v) || is_object($v)) {
                            $params[":$k"] = json_encode($v, JSON_UNESCAPED_UNICODE);
                        } elseif (is_bool($v)) {
                            $params[":$k"] = $v ? 1 : 0;
                        } else {
                            $params[":$k"] = $v;
                        }
                    }
                    $stmt->execute($params);
                }
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'کلیه داده‌ها با دیتابیس MySQL همگام‌سازی شدند.'], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

echo json_encode(['success' => false, 'error' => 'اکشن مشخص نشده است.'], JSON_UNESCAPED_UNICODE);
