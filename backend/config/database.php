<?php
// Load .env file from backend/ directory
$_envFile = __DIR__ . '/../.env';
if (file_exists($_envFile)) {
    foreach (file($_envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $_line) {
        $_line = trim($_line);
        if ($_line === '' || $_line[0] === '#' || strpos($_line, '=') === false) continue;
        [$_key, $_val] = explode('=', $_line, 2);
        $_key = trim($_key);
        $_val = trim($_val);
        if (!empty($_key)) {
            putenv("$_key=$_val");
            $_ENV[$_key] = $_val;
        }
    }
}
unset($_envFile, $_line, $_key, $_val);

session_start();
header('Content-Type: application/json');

$_corsOrigin = getenv('CORS_ORIGIN') ?: 'http://localhost:5173';
header("Access-Control-Allow-Origin: $_corsOrigin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
unset($_corsOrigin);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'university_seat_reservation');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getDb() {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
    return $pdo;
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function errorResponse($message, $code = 400) {
    jsonResponse(['error' => $message], $code);
}

function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        errorResponse('Unauthenticated. Please log in.', 401);
    }
    return [
        'id' => $_SESSION['user_id'],
        'student_id' => $_SESSION['student_id'],
        'role' => $_SESSION['role'],
        'full_name' => $_SESSION['full_name'],
    ];
}

function requireRole(...$roles) {
    $user = requireAuth();
    if (!in_array($user['role'], $roles, true)) {
        errorResponse('Insufficient permissions.', 403);
    }
    return $user;
}
