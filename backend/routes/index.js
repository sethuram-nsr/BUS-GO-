import { Router } from 'express';
import { createTripRouter } from './tripRoutes.js';
import { createBookingRouter } from './bookingRoutes.js';
import { createAuthRouter } from './authRoutes.js';

/**
 * Creates main API router mounting all route controllers.
 * @param {object} store
 * @returns {Router}
 */
export function createApiRouter(store) {
  const router = Router();

  // Health check — used by frontend to detect if backend is reachable
  router.get('/health', (_req, res) => res.json({ status: 'ok' }));

  router.use('/auth', createAuthRouter(store));
  router.use('/trips', createTripRouter(store));
  router.use('/bookings', createBookingRouter(store));

  return router;
}
