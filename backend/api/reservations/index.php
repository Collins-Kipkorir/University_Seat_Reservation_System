<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

$user = requireAuth();
$pdo = getDb();

$stmt = $pdo->prepare("
    SELECT r.id, r.group_size, r.booking_time, r.status, r.created_at,
           v.table_id, v.shade,
           u.student_id, u.full_name, u.role AS user_role
    FROM reservations r
    JOIN venues v ON r.venue_id = v.id
    JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ? AND r.status = 'active'
    ORDER BY r.booking_time ASC
");
$stmt->execute([$user['id']]);

jsonResponse(['reservations' => $stmt->fetchAll()]);
