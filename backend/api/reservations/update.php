<?php
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    errorResponse('Method not allowed', 405);
}

$user = requireAuth();
$pdo = getDb();
$input = json_decode(file_get_contents('php://input'), true);

$reservationId = (int) ($input['id'] ?? 0);
$groupSize = isset($input['group_size']) ? (int) $input['group_size'] : null;
$bookingTime = isset($input['booking_time']) ? trim($input['booking_time']) : null;

if (!$reservationId) {
    errorResponse('Reservation ID is required.');
}

$stmt = $pdo->prepare("SELECT r.id, r.venue_id, r.group_size, r.booking_time, v.table_id, v.shade, v.capacity FROM reservations r JOIN venues v ON r.venue_id = v.id WHERE r.id = ? AND r.user_id = ? AND r.status = 'active'");
$stmt->execute([$reservationId, $user['id']]);
$reservation = $stmt->fetch();

if (!$reservation) {
    errorResponse('Reservation not found or cannot be edited.', 404);
}

if ($user['role'] === 'guest') {
    errorResponse('Guests cannot edit reservations.', 403);
}

$updates = [];
$params = [];

if ($groupSize !== null) {
    $maxGroupSize = $user['role'] === 'guest' ? 3 : 6;
    if ($groupSize < 1 || $groupSize > $maxGroupSize) {
        errorResponse("Invalid group size. Maximum is {$maxGroupSize}.", 400);
    }
    if ($groupSize > $reservation['capacity']) {
        errorResponse("Group size exceeds venue capacity of {$reservation['capacity']}.", 400);
    }
    $bookedStmt = $pdo->prepare("SELECT COALESCE(SUM(r2.group_size), 0) AS booked FROM reservations r2 WHERE r2.venue_id = ? AND r2.status = 'active' AND r2.id != ?");
    $bookedStmt->execute([$reservation['venue_id'], $reservationId]);
    $booked = (int) $bookedStmt->fetchColumn();
    $remaining = $reservation['capacity'] - $booked;
    if ($groupSize > $remaining) {
        errorResponse("Only {$remaining} seats remaining at this venue.", 400);
    }
    $updates[] = 'group_size = ?';
    $params[] = $groupSize;
}

if ($bookingTime !== null) {
    $bookingDate = new DateTime($bookingTime);
    $now = new DateTime();
    if ($bookingDate <= $now) {
        errorResponse('Booking time must be in the future.', 400);
    }
    $conflictStmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE venue_id = ? AND status = 'active' AND id != ? AND ABS(TIMESTAMPDIFF(MINUTE, booking_time, ?)) < 60");
    $conflictStmt->execute([$reservation['venue_id'], $reservationId, $bookingTime]);
    if ((int) $conflictStmt->fetchColumn() > 0) {
        errorResponse('This venue is already booked within 60 minutes of the selected time.', 409);
    }
    $updates[] = 'booking_time = ?';
    $params[] = $bookingTime;
}

if (empty($updates)) {
    errorResponse('No valid fields to update.', 400);
}

$params[] = $reservationId;
$sql = "UPDATE reservations SET " . implode(', ', $updates) . " WHERE id = ? AND user_id = ?";
$params[] = $user['id'];
$pdo->prepare($sql)->execute($params);

jsonResponse(['message' => 'Reservation updated successfully']);
