import { Router } from 'express';
import { isValidTravelDate } from '../utils/date.js';
import { isValidEmail, isValidPassengerName } from '../utils/validation.js';
import { BadRequestError } from '../errors/AppError.js';

/**
 * Creates and configures the bookings router.
 * @param {object} store Data store instance
 * @returns {Router}
 */
export function createBookingRouter(store) {
  const router = Router();

  /**
   * POST /api/bookings
   * Request body: { tripId, date, seats, passenger, email }
   */
  router.post('/', async (req, res, next) => {
    try {
      const body = req.body ?? {};
      const { tripId, date, seats, passenger, email } = body;

      const isDateValid = isValidTravelDate(date);
      const isPassengerValid = isValidPassengerName(passenger);
      const isEmailValid = isValidEmail(email);

      if (!isDateValid || !isPassengerValid || !isEmailValid) {
        throw new BadRequestError('Enter a valid date, passenger name and email.');
      }

      const booking = await store.book({
        tripId,
        date,
        seats,
        passenger: String(passenger).trim(),
        email: String(email).trim().toLowerCase(),
      });

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
