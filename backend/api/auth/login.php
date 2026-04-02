<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$studentId = trim($input['student_id'] ?? '');
$password = $input['password'] ?? '';

if (!$studentId || !$password) {
    errorResponse('Student ID and password are required.');
}

$pdo = getDb();

$stmt = $pdo->prepare("SELECT id, student_id, full_name, email, password_hash, role FROM users WHERE student_id = ?");
$stmt->execute([$studentId]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    errorResponse('Invalid credentials.', 401);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['student_id'] = $user['student_id'];
$_SESSION['full_name'] = $user['full_name'];
$_SESSION['role'] = $user['role'];

jsonResponse([
    'message' => 'Login successful',
    'user' => [
        'id' => $user['id'],
        'student_id' => $user['student_id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ],
]);
