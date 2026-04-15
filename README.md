# University Seat Reservation System

A full-stack web app for reserving seats/tables at a university campus venue, with role-based access (student, staff, guest).

**Stack:** React + Vite (frontend) · PHP built-in server (backend) · MySQL via XAMPP

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [XAMPP](https://www.apachefriends.org/) | Any recent | For MySQL only (Apache not required) |
| [PHP](https://www.php.net/) | 8.0+ | Included with XAMPP; add to PATH |
| [Node.js](https://nodejs.org/) | 18+ | For the React frontend |

### Add PHP to PATH (Windows/XAMPP)

1. Open **System Properties → Advanced → Environment Variables**
2. Under **System variables**, edit **Path**
3. Add `C:\xampp\php`
4. Restart your terminal and verify: `php --version`

---

## One-Time Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd University_Seat_Reservation_System
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure the database credentials

Copy the example env file and edit if needed:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env`. The defaults match a fresh XAMPP install (root user, no password):

```env
DB_HOST=127.0.0.1
DB_NAME=university_seat_reservation
DB_USER=root
DB_PASS=
CORS_ORIGIN=http://localhost:5173
```

### 4. Create the MySQL database

1. Start **XAMPP Control Panel** and click **Start** next to **MySQL**
2. Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Click **New** and create a database named `university_seat_reservation`
4. Select the new database, go to the **SQL** tab, paste the contents of `backend/database/schema.sql`, and click **Go**

This creates the tables and seeds 31 venue tables plus a demo user.

**Demo login credentials:**

| Field | Value |
|-------|-------|
| Student ID | `STU001` |
| Password | `password123` |

---

## Running the Project

Start both the PHP backend and Vite frontend with a single command:

```bash
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (PHP) | http://localhost:8000 |

To stop both servers press `Ctrl + C`.

---

## Project Structure

```
University_Seat_Reservation_System/
├── backend/
│   ├── .env                  # Your local credentials (gitignored)
│   ├── .env.example          # Template — copy to .env
│   ├── api/
│   │   ├── auth/             # login.php, register.php, logout.php, me.php
│   │   ├── reservations/     # index.php, create.php, update.php, cancel.php
│   │   └── venues/           # index.php
│   ├── config/
│   │   └── database.php      # DB connection + CORS + session helpers
│   └── database/
│       └── schema.sql        # DB schema + seed data
├── frontend/
│   ├── src/
│   │   ├── api.js            # All fetch calls to the backend
│   │   ├── main.jsx          # Router entry point
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Home.jsx
│   │   └── Components/
│   │       ├── SeatMap.jsx
│   │       ├── ReservationForm.jsx
│   │       └── ReservationList.jsx
│   ├── vite.config.js
│   └── package.json
├── package.json              # Root scripts (dev, backend, frontend, install:all)
└── README.md
```

---

## Role Permissions

| Feature | Student | Staff | Guest |
|---------|---------|-------|-------|
| Book Shade A tables | Yes | Yes | No |
| Book Shade B tables | Yes | Yes | Yes |
| Max group size | 6 | 6 | 3 |
| Edit reservations | Yes | Yes | No |
| Multiple active bookings | Yes | Yes | No (1 max) |

---

## Troubleshooting

**`php` not found** — PHP is not in your PATH. Follow the PATH setup steps above.

**"Access denied for user 'root'"** — Open `backend/.env` and set the correct `DB_USER` / `DB_PASS` for your MySQL installation.

**Frontend shows "Something went wrong"** — Make sure the PHP server is running on port 8000 (`npm run backend`) and MySQL is started in XAMPP.

**Port 8000 already in use** — Change the port in `package.json` (`backend` script) and in `frontend/src/api.js` (`API_BASE`).
