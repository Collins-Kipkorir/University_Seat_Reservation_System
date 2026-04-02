<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['authenticated' => false]);
}

$pdo = getDb();
$stmt = $pdo->prepare("SELECT id, student_id, full_name, email, role FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    $_SESSION = [];
    session_destroy();
    jsonResponse(['authenticated' => false]);
}

jsonResponse([
    'authenticated' => true,
    'user' => $user,
]);
