import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { PG_INITIAL_SCHEMA_SQL } from './schema.js';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/AppError.js';
import { validateSeatSelection, isValidPassengerName, isValidPhone, isValidEmail, isValidPassword } from '../utils/validation.js';
import { hashPassword, verifyPassword } from '../utils/auth.js';

const { Pool } = pg;

/**
 * Creates and initializes PostgreSQL data store.
 * @param {object} [dbConfig] PostgreSQL pool configuration
 * @returns {object} Store methods and pool instance
 */
export function createPostgresStore(dbConfig = {}) {
  const poolConfig = dbConfig.connectionString
    ? { connectionString: dbConfig.connectionString }
    : {
        host: dbConfig.host || 'localhost',
        port: Number(dbConfig.port) || 5432,
        database: dbConfig.database || 'bus_booking',
        user: dbConfig.user || 'bus_admin',
        password: String(dbConfig.password ?? ''),
        max: dbConfig.max || 20,
        idleTimeoutMillis: dbConfig.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: dbConfig.connectionTimeoutMillis || 5000,
      };

  const pool = new Pool(poolConfig);

  /**
   * Initializes database schema and runs initial seeds if necessary.
   */
  async function init() {
    try {
      const client = await pool.connect();
      try {
        await client.query(PG_INITIAL_SCHEMA_SQL);
        console.log(`[Database] PostgreSQL schema initialized on ${poolConfig.database || 'bus_booking'}`);
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(`[Database] PostgreSQL connection error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Returns all trips with their operator details.
   */
  async function listTrips() {
    const res = await pool.query(`
      SELECT trips.id, trips.operator_id, trips.origin, trips.destination,
             trips.departure, trips.fare, trips.capacity,
             operators.name AS operator
      FROM trips
      JOIN operators ON operators.id = trips.operator_id
      ORDER BY trips.id ASC
    `);
    return res.rows;
  }

  /**
   * Retrieves a single trip by ID.
   * @param {number|string} tripId
   */
  async function getTripById(tripId) {
    const numericId = Number(tripId);
    const res = await pool.query(`
      SELECT trips.id, trips.operator_id, trips.origin, trips.destination,
             trips.departure, trips.fare, trips.capacity,
             operators.name AS operator
      FROM trips
      JOIN operators ON operators.id = trips.operator_id
      WHERE trips.id = $1
    `, [numericId]);
    return res.rows[0] || null;
  }

  /**
   * Returns list of booked seat numbers for a given trip and date.
   * @param {number|string} tripId
   * @param {string} date
   * @returns {Promise<number[]>}
   */
  async function bookedSeats(tripId, date) {
    const res = await pool.query(`
      SELECT seat FROM booked_seats
      WHERE trip_id = $1 AND travel_date = $2
      ORDER BY seat ASC
    `, [Number(tripId), date]);
    return res.rows.map((row) => row.seat);
  }

  /**
   * Creates an atomic booking with transactional seat allocation.
   * Prevents double bookings and enforces server-calculated pricing.
   * @param {object} params
   * @param {number|string} params.tripId
   * @param {string} params.date
   * @param {number[]} params.seats
   * @param {string} params.passenger
   * @param {string} params.email
   */
  async function book({ tripId, date, seats, passenger, email }) {
    const numericTripId = Number(tripId);
    const trip = await getTripById(numericTripId);
    if (!trip) {
      throw new BadRequestError('Selected trip does not exist.');
    }

    validateSeatSelection(seats, trip.capacity);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check for seat collisions
      const collisionCheck = await client.query(`
        SELECT seat FROM booked_seats
        WHERE trip_id = $1 AND travel_date = $2 AND seat = ANY($3::int[])
        FOR UPDATE
      `, [numericTripId, date, seats]);

      if (collisionCheck.rows.length > 0) {
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

      // Record booking
      await client.query(`
        INSERT INTO bookings (id, trip_id, travel_date, passenger, email, total, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [booking.id, numericTripId, date, passenger, email, booking.total, booking.status]);

      // Record reserved seats
      for (const seat of seats) {
        await client.query(`
          INSERT INTO booked_seats (booking_id, trip_id, travel_date, seat)
          VALUES ($1, $2, $3, $4)
        `, [booking.id, numericTripId, date, seat]);
      }

      await client.query('COMMIT');
      return booking;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Registers a new user account.
   * @param {object} params
   * @param {string} params.name
   * @param {string} params.phone
   * @param {string} [params.email]
   * @param {string} params.password
   */
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

    const existingRes = await pool.query('SELECT id FROM users WHERE phone = $1', [cleanedPhone]);
    if (existingRes.rows.length > 0) {
      throw new ConflictError('An account with this mobile number already exists.');
    }

    const id = randomUUID();
    const passwordHash = hashPassword(password);
    const createdAt = new Date().toISOString();

    try {
      await pool.query(`
        INSERT INTO users (id, name, phone, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [id, trimmedName, cleanedPhone, trimmedEmail, passwordHash, createdAt]);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictError('An account with this mobile number already exists.');
      }
      throw err;
    }

    return {
      id,
      name: trimmedName,
      phone: cleanedPhone,
      email: trimmedEmail,
      createdAt,
    };
  }

  /**
   * Authenticates a user with phone and password.
   * @param {object} params
   * @param {string} params.phone
   * @param {string} params.password
   */
  async function loginUser({ phone, password }) {
    const cleanedPhone = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
    if (!cleanedPhone || !password) {
      throw new BadRequestError('Mobile number and password are required.');
    }

    const res = await pool.query('SELECT * FROM users WHERE phone = $1', [cleanedPhone]);
    const user = res.rows[0];
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

  /**
   * Retrieves user profile by ID without password hash.
   * @param {string} id
   */
  async function getUserById(id) {
    const res = await pool.query('SELECT id, name, phone, email, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  return {
    pool,
    init,
    listTrips,
    getTripById,
    bookedSeats,
    book,
    createUser,
    loginUser,
    getUserById,
    close: () => pool.end(),
  };
}
