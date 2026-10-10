import { config } from '../config/index.js';

/**
 * Returns today's date formatted as YYYY-MM-DD in the given timezone (default: Asia/Kolkata).
 * @param {string} [timeZone]
 * @returns {string}
 */
export function getTodayString(timeZone = config.timezone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

/**
 * Validates whether a date string is in valid YYYY-MM-DD format and is today or a future date.
 * @param {string} date
 * @param {string} [timeZone]
 * @returns {boolean}
 */
export function isValidTravelDate(date, timeZone = config.timezone) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return false;
  }

  const today = getTodayString(timeZone);
  return date >= today;
}
