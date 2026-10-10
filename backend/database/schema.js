/**
 * PostgreSQL DDL schema and initial seed data.
 */
export const PG_INITIAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS operators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    operator_id INTEGER REFERENCES operators(id),
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure VARCHAR(20) NOT NULL,
    fare INTEGER NOT NULL,
    capacity INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    travel_date VARCHAR(20) NOT NULL,
    passenger VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    total INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS booked_seats (
    booking_id VARCHAR(64) REFERENCES bookings(id) ON DELETE CASCADE,
    trip_id INTEGER NOT NULL,
    travel_date VARCHAR(20) NOT NULL,
    seat INTEGER NOT NULL,
    UNIQUE(trip_id, travel_date, seat)
  );

  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash TEXT NOT NULL,
    created_at VARCHAR(50) NOT NULL
  );

  -- Initial Seed Data: Operators
  INSERT INTO operators (id, name) VALUES (1, 'Sethu Travels') ON CONFLICT (id) DO NOTHING;
  INSERT INTO operators (id, name) VALUES (2, 'Southern Express') ON CONFLICT (id) DO NOTHING;
  INSERT INTO operators (id, name) VALUES (3, 'Coastal Connect') ON CONFLICT (id) DO NOTHING;
  INSERT INTO operators (id, name) VALUES (4, 'Greenline Transports') ON CONFLICT (id) DO NOTHING;
  INSERT INTO operators (id, name) VALUES (5, 'KPN Travels') ON CONFLICT (id) DO NOTHING;
  INSERT INTO operators (id, name) VALUES (6, 'SRS Travels') ON CONFLICT (id) DO NOTHING;

  -- Initial Seed Data: Trips
  -- Chennai <-> Bengaluru
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (1, 1, 'Chennai', 'Bengaluru', '06:30', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (2, 2, 'Chennai', 'Bengaluru', '14:00', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (3, 1, 'Chennai', 'Bengaluru', '22:00', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (4, 2, 'Chennai', 'Bengaluru', '23:00', 750, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (5, 4, 'Chennai', 'Bengaluru', '23:30', 850, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (6, 2, 'Bengaluru', 'Chennai', '07:00', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (7, 1, 'Bengaluru', 'Chennai', '13:30', 600, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (8, 6, 'Bengaluru', 'Chennai', '21:00', 750, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (9, 1, 'Bengaluru', 'Chennai', '22:30', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (10, 4, 'Bengaluru', 'Chennai', '23:15', 850, 24) ON CONFLICT (id) DO NOTHING;

  -- Chennai <-> Madurai
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (11, 5, 'Chennai', 'Madurai', '08:00', 550, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (12, 3, 'Chennai', 'Madurai', '21:30', 580, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (13, 1, 'Chennai', 'Madurai', '22:15', 620, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (14, 2, 'Chennai', 'Madurai', '23:00', 680, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (15, 3, 'Madurai', 'Chennai', '07:30', 580, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (16, 5, 'Madurai', 'Chennai', '14:00', 550, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (17, 1, 'Madurai', 'Chennai', '21:30', 620, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (18, 2, 'Madurai', 'Chennai', '22:45', 680, 24) ON CONFLICT (id) DO NOTHING;

  -- Chennai <-> Coimbatore
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (19, 4, 'Chennai', 'Coimbatore', '06:00', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (20, 6, 'Chennai', 'Coimbatore', '21:00', 780, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (21, 5, 'Chennai', 'Coimbatore', '22:00', 750, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (22, 2, 'Chennai', 'Coimbatore', '23:00', 820, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (23, 6, 'Coimbatore', 'Chennai', '07:00', 780, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (24, 4, 'Coimbatore', 'Chennai', '13:30', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (25, 5, 'Coimbatore', 'Chennai', '21:30', 750, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (26, 2, 'Coimbatore', 'Chennai', '22:30', 820, 24) ON CONFLICT (id) DO NOTHING;

  -- Chennai <-> Salem & Trichy
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (27, 1, 'Chennai', 'Salem', '07:00', 480, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (28, 6, 'Chennai', 'Salem', '23:00', 550, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (29, 2, 'Salem', 'Chennai', '08:30', 480, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (30, 6, 'Salem', 'Chennai', '23:30', 550, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (31, 3, 'Chennai', 'Trichy', '06:00', 450, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (32, 5, 'Chennai', 'Trichy', '22:00', 500, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (33, 1, 'Trichy', 'Chennai', '07:30', 450, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (34, 5, 'Trichy', 'Chennai', '22:30', 500, 24) ON CONFLICT (id) DO NOTHING;

  -- Bengaluru <-> Coimbatore, Madurai, Salem, Trichy
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (35, 6, 'Bengaluru', 'Coimbatore', '06:30', 550, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (36, 4, 'Bengaluru', 'Coimbatore', '14:00', 600, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (37, 5, 'Bengaluru', 'Coimbatore', '22:30', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (38, 4, 'Coimbatore', 'Bengaluru', '07:00', 600, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (39, 5, 'Coimbatore', 'Bengaluru', '22:45', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (40, 2, 'Bengaluru', 'Madurai', '20:30', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (41, 6, 'Bengaluru', 'Madurai', '22:30', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (42, 2, 'Madurai', 'Bengaluru', '21:30', 650, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (43, 6, 'Madurai', 'Bengaluru', '22:15', 700, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (44, 4, 'Bengaluru', 'Salem', '07:30', 400, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (45, 1, 'Bengaluru', 'Salem', '23:00', 450, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (46, 4, 'Salem', 'Bengaluru', '08:00', 400, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (47, 1, 'Salem', 'Bengaluru', '23:30', 450, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (48, 3, 'Bengaluru', 'Trichy', '21:00', 600, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (49, 3, 'Trichy', 'Bengaluru', '22:30', 600, 24) ON CONFLICT (id) DO NOTHING;

  -- Coimbatore <-> Madurai & Salem
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (50, 3, 'Coimbatore', 'Madurai', '07:00', 380, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (51, 5, 'Coimbatore', 'Madurai', '18:30', 420, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (52, 3, 'Madurai', 'Coimbatore', '08:30', 380, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (53, 5, 'Madurai', 'Coimbatore', '19:00', 420, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (54, 4, 'Coimbatore', 'Salem', '06:30', 300, 24) ON CONFLICT (id) DO NOTHING;
  INSERT INTO trips (id, operator_id, origin, destination, departure, fare, capacity) VALUES (55, 6, 'Salem', 'Coimbatore', '09:00', 300, 24) ON CONFLICT (id) DO NOTHING;

  SELECT setval(pg_get_serial_sequence('operators', 'id'), GREATEST((SELECT MAX(id) FROM operators), 1));
  SELECT setval(pg_get_serial_sequence('trips', 'id'), GREATEST((SELECT MAX(id) FROM trips), 1));
`;

/**
 * SQLite DDL schema and initial seed data (for testing / fallback).
 */
export const INITIAL_SCHEMA_SQL = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY,
    operator_id INTEGER REFERENCES operators(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure TEXT NOT NULL,
    fare INTEGER NOT NULL,
    capacity INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id),
    travel_date TEXT NOT NULL,
    passenger TEXT NOT NULL,
    email TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS booked_seats (
    booking_id TEXT REFERENCES bookings(id),
    trip_id INTEGER NOT NULL,
    travel_date TEXT NOT NULL,
    seat INTEGER NOT NULL,
    UNIQUE(trip_id, travel_date, seat)
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  -- Initial Seed Data: Operators
  INSERT OR IGNORE INTO operators VALUES (1, 'Sethu Travels');
  INSERT OR IGNORE INTO operators VALUES (2, 'Southern Express');
  INSERT OR IGNORE INTO operators VALUES (3, 'Coastal Connect');
  INSERT OR IGNORE INTO operators VALUES (4, 'Greenline Transports');
  INSERT OR IGNORE INTO operators VALUES (5, 'KPN Travels');
  INSERT OR IGNORE INTO operators VALUES (6, 'SRS Travels');

  -- Initial Seed Data: Trips
  INSERT OR IGNORE INTO trips VALUES (1, 1, 'Chennai', 'Bengaluru', '06:30', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (2, 2, 'Chennai', 'Bengaluru', '14:00', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (3, 1, 'Chennai', 'Bengaluru', '22:00', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (4, 2, 'Chennai', 'Bengaluru', '23:00', 750, 24);
  INSERT OR IGNORE INTO trips VALUES (5, 4, 'Chennai', 'Bengaluru', '23:30', 850, 24);
  INSERT OR IGNORE INTO trips VALUES (6, 2, 'Bengaluru', 'Chennai', '07:00', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (7, 1, 'Bengaluru', 'Chennai', '13:30', 600, 24);
  INSERT OR IGNORE INTO trips VALUES (8, 6, 'Bengaluru', 'Chennai', '21:00', 750, 24);
  INSERT OR IGNORE INTO trips VALUES (9, 1, 'Bengaluru', 'Chennai', '22:30', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (10, 4, 'Bengaluru', 'Chennai', '23:15', 850, 24);
  INSERT OR IGNORE INTO trips VALUES (11, 5, 'Chennai', 'Madurai', '08:00', 550, 24);
  INSERT OR IGNORE INTO trips VALUES (12, 3, 'Chennai', 'Madurai', '21:30', 580, 24);
  INSERT OR IGNORE INTO trips VALUES (13, 1, 'Chennai', 'Madurai', '22:15', 620, 24);
  INSERT OR IGNORE INTO trips VALUES (14, 2, 'Chennai', 'Madurai', '23:00', 680, 24);
  INSERT OR IGNORE INTO trips VALUES (15, 3, 'Madurai', 'Chennai', '07:30', 580, 24);
  INSERT OR IGNORE INTO trips VALUES (16, 5, 'Madurai', 'Chennai', '14:00', 550, 24);
  INSERT OR IGNORE INTO trips VALUES (17, 1, 'Madurai', 'Chennai', '21:30', 620, 24);
  INSERT OR IGNORE INTO trips VALUES (18, 2, 'Madurai', 'Chennai', '22:45', 680, 24);
  INSERT OR IGNORE INTO trips VALUES (19, 4, 'Chennai', 'Coimbatore', '06:00', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (20, 6, 'Chennai', 'Coimbatore', '21:00', 780, 24);
  INSERT OR IGNORE INTO trips VALUES (21, 5, 'Chennai', 'Coimbatore', '22:00', 750, 24);
  INSERT OR IGNORE INTO trips VALUES (22, 2, 'Chennai', 'Coimbatore', '23:00', 820, 24);
  INSERT OR IGNORE INTO trips VALUES (23, 6, 'Coimbatore', 'Chennai', '07:00', 780, 24);
  INSERT OR IGNORE INTO trips VALUES (24, 4, 'Coimbatore', 'Chennai', '13:30', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (25, 5, 'Coimbatore', 'Chennai', '21:30', 750, 24);
  INSERT OR IGNORE INTO trips VALUES (26, 2, 'Coimbatore', 'Chennai', '22:30', 820, 24);
  INSERT OR IGNORE INTO trips VALUES (27, 1, 'Chennai', 'Salem', '07:00', 480, 24);
  INSERT OR IGNORE INTO trips VALUES (28, 6, 'Chennai', 'Salem', '23:00', 550, 24);
  INSERT OR IGNORE INTO trips VALUES (29, 2, 'Salem', 'Chennai', '08:30', 480, 24);
  INSERT OR IGNORE INTO trips VALUES (30, 6, 'Salem', 'Chennai', '23:30', 550, 24);
  INSERT OR IGNORE INTO trips VALUES (31, 3, 'Chennai', 'Trichy', '06:00', 450, 24);
  INSERT OR IGNORE INTO trips VALUES (32, 5, 'Chennai', 'Trichy', '22:00', 500, 24);
  INSERT OR IGNORE INTO trips VALUES (33, 1, 'Trichy', 'Chennai', '07:30', 450, 24);
  INSERT OR IGNORE INTO trips VALUES (34, 5, 'Trichy', 'Chennai', '22:30', 500, 24);
  INSERT OR IGNORE INTO trips VALUES (35, 6, 'Bengaluru', 'Coimbatore', '06:30', 550, 24);
  INSERT OR IGNORE INTO trips VALUES (36, 4, 'Bengaluru', 'Coimbatore', '14:00', 600, 24);
  INSERT OR IGNORE INTO trips VALUES (37, 5, 'Bengaluru', 'Coimbatore', '22:30', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (38, 4, 'Coimbatore', 'Bengaluru', '07:00', 600, 24);
  INSERT OR IGNORE INTO trips VALUES (39, 5, 'Coimbatore', 'Bengaluru', '22:45', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (40, 2, 'Bengaluru', 'Madurai', '20:30', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (41, 6, 'Bengaluru', 'Madurai', '22:30', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (42, 2, 'Madurai', 'Bengaluru', '21:30', 650, 24);
  INSERT OR IGNORE INTO trips VALUES (43, 6, 'Madurai', 'Bengaluru', '22:15', 700, 24);
  INSERT OR IGNORE INTO trips VALUES (44, 4, 'Bengaluru', 'Salem', '07:30', 400, 24);
  INSERT OR IGNORE INTO trips VALUES (45, 1, 'Bengaluru', 'Salem', '23:00', 450, 24);
  INSERT OR IGNORE INTO trips VALUES (46, 4, 'Salem', 'Bengaluru', '08:00', 400, 24);
  INSERT OR IGNORE INTO trips VALUES (47, 1, 'Salem', 'Bengaluru', '23:30', 450, 24);
  INSERT OR IGNORE INTO trips VALUES (48, 3, 'Bengaluru', 'Trichy', '21:00', 600, 24);
  INSERT OR IGNORE INTO trips VALUES (49, 3, 'Trichy', 'Bengaluru', '22:30', 600, 24);
  INSERT OR IGNORE INTO trips VALUES (50, 3, 'Coimbatore', 'Madurai', '07:00', 380, 24);
  INSERT OR IGNORE INTO trips VALUES (51, 5, 'Coimbatore', 'Madurai', '18:30', 420, 24);
  INSERT OR IGNORE INTO trips VALUES (52, 3, 'Madurai', 'Coimbatore', '08:30', 380, 24);
  INSERT OR IGNORE INTO trips VALUES (53, 5, 'Madurai', 'Coimbatore', '19:00', 420, 24);
  INSERT OR IGNORE INTO trips VALUES (54, 4, 'Coimbatore', 'Salem', '06:30', 300, 24);
  INSERT OR IGNORE INTO trips VALUES (55, 6, 'Salem', 'Coimbatore', '09:00', 300, 24);
`;
