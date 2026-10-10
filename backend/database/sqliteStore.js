import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { INITIAL_SCHEMA_SQL } from './schema.js';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/AppError.js';
import { validateSeatSelection, isValidPassengerName, isValidPhone, isValidEmail, isValidPassword } from '../utils/validation.js';
import { hashPassword, verifyPassword } from '../utils/auth.js';

/**
 * Creates and initializes SQLite data store with async-compatible interface.
 * @param {string} [filename] SQLite database filename or ':memory:'
 * @returns {object} Store methods and database instance
 */
export function createSqliteStore(filename) {
  const db = new DatabaseSync(filename);
  db.exec(INITIAL_SCHEMA_SQL);

  const stmtListTrips = db.prepare(`
    SELECT trips.*, operators.name AS operator
    FROM trips
    JOIN operators ON operators.id = trips.operator_id
    ORDER BY trips.id ASC
  `);

  const stmtBookedSeats = db.prepare(`
    SELECT seat FROM booked_seats
    WHERE trip_id = ? AND travel_date = ?
    ORDER BY seat ASC
  `);

  const stmtInsertBooking = db.prepare(`
    INSERT INTO bookings (id, trip_id, travel_date, passenger, email, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const stmtInsertBookedSeat = db.prepare(`
    INSERT INTO booked_seats (booking_id, trip_id, travel_date, seat)
    VALUES (?, ?, ?, ?)
  `);

  const stmtInsertUser = db.prepare(`
    INSERT INTO users (id, name, phone, email, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const stmtGetUserByPhone = db.prepare(`
    SELECT * FROM users WHERE phone = ?
  `);

  const stmtGetUserById = db.prepare(`
    SELECT id, name, phone, email, created_at FROM users WHERE id = ?
  `);

  async function init() {
    // Already initialized synchronously on create
    return Promise.resolve();
  }

  async function listTrips() {
    return stmtListTrips.all();
  }

  async function getTripById(tripId) {
    const numericId = Number(tripId);
    const trips = stmtListTrips.all();
    return trips.find((t) => t.id === numericId) || null;
  }

  async function bookedSeats(tripId, date) {
    return stmtBookedSeats.all(Number(tripId), date).map((row) => row.seat);
  }

  async function book({ tripId, date, seats, passenger, email }) {
    const numericTripId = Number(tripId);
    const trip = await getTripById(numericTripId);
    if (!trip) {
      throw new BadRequestError('Selected trip does not exist.');
    }

    validateSeatSelection(seats, trip.capacity);

    db.exec('BEGIN IMMEDIATE');
    try {
      const currentlyBooked = await bookedSeats(tripId, date);
      const isConflict = seats.some((seat) => currentlyBooked.includes(seat));

      if (isConflict) {
        throw new ConflictError('A selected seat was just booked. Please choose again.');
      }

      const totalFare = trip.fare * seats.length;
      const booking = {
        id: randomUUID(),
        tripId: numericTripId,
        date,
        seats,
        passenger,
        email,
        total: totalFare,
        status: 'DEMO_CONFIRMED',
        operator: trip.operator,
        origin: trip.origin,
        destination: trip.destination,
        departure: trip.departure,
      };

      stmtInsertBooking.run(
        booking.id,
        numericTripId,
        date,
        passenger,
        email,
        booking.total,
        booking.status
      );

      for (const seat of seats) {
        stmtInsertBookedSeat.run(booking.id, numericTripId, date, seat);
      }

      db.exec('COMMIT');
      return booking;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }

  async function createUser({ name, phone, email, password }) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const cleanedPhone = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
    const trimmedEmail = typeof email === 'string' && email.trim().length > 0 ? email.trim() : null;

    if (!isValidPassengerName(trimmedName)) {
      throw new BadRequestError('Please provide a valid full name (2–80 characters).');
    }
    if (!isValidPhone(cleanedPhone)) {
      throw new BadRequestError('Please provide a valid 10-digit mobile number.');
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      throw new BadRequestError('Please provide a valid email address.');
    }
    if (!isValidPassword(password)) {
      throw new BadRequestError('Password must be at least 6 characters.');
    }

    const existing = stmtGetUserByPhone.get(cleanedPhone);
    if (existing) {
      throw new ConflictError('An account with this mobile number already exists.');
    }

    const id = randomUUID();
    const passwordHash = hashPassword(password);
    const createdAt = new Date().toISOString();

    stmtInsertUser.run(id, trimmedName, cleanedPhone, trimmedEmail, passwordHash, createdAt);

    return {
      id,
      name: trimmedName,
      phone: cleanedPhone,
      email: trimmedEmail,
      createdAt,
    };
  }

  async function loginUser({ phone, password }) {
    const cleanedPhone = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
    if (!cleanedPhone || !password) {
      throw new BadRequestError('Mobile number and password are required.');
    }

    const user = stmtGetUserByPhone.get(cleanedPhone);
    if (!user || !verifyPassword(password, user.password_hash)) {
      throw new UnauthorizedError('Invalid mobile number or password.');
    }

    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      createdAt: user.created_at,
    };
  }

  async function getUserById(id) {
    return stmtGetUserById.get(id) || null;
  }

  return {
    db,
    init,
    listTrips,
    getTripById,
    bookedSeats,
    book,
    createUser,
    loginUser,
    getUserById,
    close: () => db.close(),
  };
}
