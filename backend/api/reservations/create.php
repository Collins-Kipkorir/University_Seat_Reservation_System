<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$user = requireAuth();
$pdo = getDb();
$input = json_decode(file_get_contents('php://input'), true);

$venueId = (int) ($input['venue_id'] ?? 0);
$groupSize = (int) ($input['group_size'] ?? 0);
$bookingTime = trim($input['booking_time'] ?? '');

if (!$venueId || $groupSize < 1 || !$bookingTime) {
    errorResponse('Venue ID, group size, and booking time are required.');
}

$bookingDate = new DateTime($bookingTime);
$now = new DateTime();
if ($bookingDate <= $now) {
    errorResponse('Booking time must be in the future.');
}

$venueStmt = $pdo->prepare("SELECT id, table_id, shade, capacity FROM venues WHERE id = ? AND is_active = 1");
$venueStmt->execute([$venueId]);
$venue = $venueStmt->fetch();

if (!$venue) {
    errorResponse('Venue not found or inactive.', 404);
}

if ($user['role'] === 'guest' && $venue['shade'] === 'A') {
    errorResponse('Guests cannot book in Shade A. Please select a table in Shade B.', 403);
}

$maxGroupSize = $user['role'] === 'guest' ? 3 : 6;
if ($groupSize > $maxGroupSize) {
    errorResponse("Guests are limited to a maximum group size of {$maxGroupSize}.", 400);
}

if ($groupSize > $venue['capacity']) {
    errorResponse("Group size exceeds venue capacity of {$venue['capacity']}.", 400);
}

if ($user['role'] === 'guest') {
    $activeStmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE user_id = ? AND status = 'active'");
    $activeStmt->execute([$user['id']]);
    if ((int) $activeStmt->fetchColumn() > 0) {
        errorResponse('Guests can only have one active reservation at a time.', 400);
    }
}

$bookedStmt = $pdo->prepare("
    SELECT COALESCE(SUM(r.group_size), 0) AS booked
    FROM reservations r
    WHERE r.venue_id = ? AND r.status = 'active'
");
$bookedStmt->execute([$venueId]);
$booked = (int) $bookedStmt->fetchColumn();

$remaining = $venue['capacity'] - $booked;
if ($groupSize > $remaining) {
    errorResponse("Only {$remaining} seats remaining at this venue.", 400);
}

$conflictStmt = $pdo->prepare("
    SELECT COUNT(*) FROM reservations
    WHERE venue_id = ? AND status = 'active'
      AND ABS(TIMESTAMPDIFF(MINUTE, booking_time, ?)) < 60
");
$conflictStmt->execute([$venueId, $bookingTime]);
if ((int) $conflictStmt->fetchColumn() > 0) {
    errorResponse('This venue is already booked within 60 minutes of the selected time.', 409);
}

$stmt = $pdo->prepare(
    "INSERT INTO reservations (user_id, venue_id, group_size, booking_time, status) VALUES (?, ?, ?, ?, 'active')"
);
$stmt->execute([$user['id'], $venueId, $groupSize, $bookingTime]);

jsonResponse([
    'message' => 'Reservation created successfully',
    'reservation' => [
        'id' => (int) $pdo->lastInsertId(),
        'venue_id' => $venueId,
        'table_id' => $venue['table_id'],
        'shade' => $venue['shade'],
        'group_size' => $groupSize,
        'booking_time' => $bookingTime,
    ],
], 201);
