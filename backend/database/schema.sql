-- University Seat Reservation System - Database Schema

CREATE DATABASE IF NOT EXISTS university_seat_reservation
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE university_seat_reservation;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'staff', 'guest') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Venues (tables/seats)
CREATE TABLE venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id VARCHAR(10) NOT NULL UNIQUE,
    shade ENUM('A', 'B') NOT NULL,
    capacity INT NOT NULL DEFAULT 6,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Reservations
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    venue_id INT NOT NULL,
    group_size INT NOT NULL,
    booking_time DATETIME NOT NULL,
    status ENUM('active', 'cancelled', 'completed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_venue_time (venue_id, booking_time)
) ENGINE=InnoDB;

-- Seed default venues
-- Shade A: 6 tables (restricted - students/staff only)
INSERT INTO venues (table_id, shade, capacity) VALUES
('A1', 'A', 6), ('A2', 'A', 6), ('A3', 'A', 6),
('A4', 'A', 6), ('A5', 'A', 6), ('A6', 'A', 6);

-- Shade B: 25 tables (accessible to all including guests)
INSERT INTO venues (table_id, shade, capacity) VALUES
('B1', 'B', 6), ('B2', 'B', 6), ('B3', 'B', 6), ('B4', 'B', 6), ('B5', 'B', 6),
('B6', 'B', 6), ('B7', 'B', 6), ('B8', 'B', 6), ('B9', 'B', 6), ('B10', 'B', 6),
('B11', 'B', 6), ('B12', 'B', 6), ('B13', 'B', 6), ('B14', 'B', 6), ('B15', 'B', 6),
('B16', 'B', 6), ('B17', 'B', 6), ('B18', 'B', 6), ('B19', 'B', 6), ('B20', 'B', 6),
('B21', 'B', 6), ('B22', 'B', 6), ('B23', 'B', 6), ('B24', 'B', 6), ('B25', 'B', 6);

-- Seed a default admin/student user (password: password123)
INSERT INTO users (student_id, full_name, email, password_hash, role) VALUES
('STU001', 'Demo Student', 'demo@university.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');
