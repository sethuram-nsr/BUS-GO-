import { Router } from 'express';
import { isValidTravelDate } from '../utils/date.js';
import { BadRequestError } from '../errors/AppError.js';

/**
 * Creates and configures the trips router.
 * @param {object} store Data store instance
 * @returns {Router}
 */
export function createTripRouter(store) {
  const router = Router();

  /**
   * GET /api/trips
   * Query params: origin, destination, date
   */
  router.get('/', async (req, res, next) => {
    try {
      const { origin = '', destination = '', date = '' } = req.query;

      if (!isValidTravelDate(date)) {
        throw new BadRequestError('Choose today or a future travel date.');
      }

      const cleanOrigin = String(origin).trim().toLowerCase();
      const cleanDestination = String(destination).trim().toLowerCase();

      // Find matching scheduled services
      const allTrips = await store.listTrips();
      const matchingTrips = allTrips.filter(
        (t) =>
          t.origin.toLowerCase() === cleanOrigin &&
          t.destination.toLowerCase() === cleanDestination
      );

      // Hydrate with current date-specific booked seats
      const enrichedTrips = await Promise.all(
        matchingTrips.map(async (trip) => ({
          ...trip,
          bookedSeats: await store.bookedSeats(trip.id, date),
        }))
      );

      res.json(enrichedTrips);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
