<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'university_seat_reservation');
define('DB_USER', 'Flowbiz');
define('DB_PASS', 'FlowbizPOC2024!');

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
