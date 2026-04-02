<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

$user = requireAuth();
$pdo = getDb();

if ($user['role'] === 'guest') {
    $stmt = $pdo->query("
        SELECT v.id, v.table_id, v.shade, v.capacity, v.is_active,
               COALESCE(SUM(r.group_size), 0) AS booked,
               (v.capacity - COALESCE(SUM(r.group_size), 0)) AS remaining
        FROM venues v
        LEFT JOIN reservations r ON r.venue_id = v.id AND r.status = 'active'
        WHERE v.is_active = 1 AND v.shade = 'B'
        GROUP BY v.id
        ORDER BY v.shade, v.table_id
    ");
} else {
    $stmt = $pdo->query("
        SELECT v.id, v.table_id, v.shade, v.capacity, v.is_active,
               COALESCE(SUM(r.group_size), 0) AS booked,
               (v.capacity - COALESCE(SUM(r.group_size), 0)) AS remaining
        FROM venues v
        LEFT JOIN reservations r ON r.venue_id = v.id AND r.status = 'active'
        WHERE v.is_active = 1
        GROUP BY v.id
        ORDER BY v.shade, v.table_id
    ");
}

$venues = $stmt->fetchAll();

jsonResponse(['venues' => $venues]);
