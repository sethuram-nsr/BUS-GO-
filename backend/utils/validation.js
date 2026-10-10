import { BadRequestError } from '../errors/AppError.js';
import { config } from '../config/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email string format and length.
 * @param {unknown} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return typeof email === 'string' && email.length > 0 && email.length <= 254 && EMAIL_REGEX.test(email);
}

/**
 * Validates passenger or user name.
 * @param {unknown} name
 * @returns {boolean}
 */
export function isValidPassengerName(name) {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 80;
}

/**
 * Validates 10-digit mobile phone number.
 * @param {unknown} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
}

/**
 * Validates password format and minimum length.
 * @param {unknown} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6 && password.length <= 128;
}

/**
 * Validates seat array selection.
 * @param {unknown} seats
 * @param {number} capacity
 * @param {number} [maxSeats]
 * @throws {BadRequestError}
 */
export function validateSeatSelection(seats, capacity, maxSeats = config.maxSeatsPerBooking) {
  if (!Array.isArray(seats) || seats.length < 1 || seats.length > maxSeats) {
    throw new BadRequestError(`Choose 1–${maxSeats} valid, different seats.`);
  }

  const uniqueSeats = new Set(seats);
  if (uniqueSeats.size !== seats.length) {
    throw new BadRequestError(`Choose 1–${maxSeats} valid, different seats.`);
  }

  const hasInvalidSeat = seats.some((seat) => !Number.isInteger(seat) || seat < 1 || seat > capacity);
  if (hasInvalidSeat) {
    throw new BadRequestError(`Choose 1–${maxSeats} valid, different seats.`);
  }
}
