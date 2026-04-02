<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$studentId = trim($input['student_id'] ?? '');
$fullName = trim($input['full_name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$role = $input['role'] ?? 'student';

if (!$studentId || !$fullName || !$email || !$password) {
    errorResponse('All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    errorResponse('Invalid email format.');
}

if (strlen($password) < 6) {
    errorResponse('Password must be at least 6 characters.');
}

if (!in_array($role, ['student', 'staff', 'guest'], true)) {
    errorResponse('Invalid role.');
}

$pdo = getDb();

$stmt = $pdo->prepare("SELECT id FROM users WHERE student_id = ? OR email = ?");
$stmt->execute([$studentId, $email]);
if ($stmt->fetch()) {
    errorResponse('Student ID or email already registered.');
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    "INSERT INTO users (student_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
);
$stmt->execute([$studentId, $fullName, $email, $passwordHash, $role]);

$userId = (int) $pdo->lastInsertId();

$_SESSION['user_id'] = $userId;
$_SESSION['student_id'] = $studentId;
$_SESSION['full_name'] = $fullName;
$_SESSION['role'] = $role;

jsonResponse([
    'message' => 'Registration successful',
    'user' => [
        'id' => $userId,
        'student_id' => $studentId,
        'full_name' => $fullName,
        'email' => $email,
        'role' => $role,
    ],
], 201);
