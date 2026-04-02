<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    errorResponse('Method not allowed', 405);
}

$user = requireAuth();
$pdo = getDb();
$input = json_decode(file_get_contents('php://input'), true);

$reservationId = (int) ($input['id'] ?? 0);

if (!$reservationId) {
    errorResponse('Reservation ID is required.');
}

$stmt = $pdo->prepare("SELECT id, user_id, status FROM reservations WHERE id = ? AND user_id = ? AND status = 'active'");
$stmt->execute([$reservationId, $user['id']]);
$reservation = $stmt->fetch();

if (!$reservation) {
    errorResponse('Reservation not found or cannot be cancelled.', 404);
}

$pdo->prepare("UPDATE reservations SET status = 'cancelled' WHERE id = ?")->execute([$reservationId]);

jsonResponse(['message' => 'Reservation cancelled successfully']);
