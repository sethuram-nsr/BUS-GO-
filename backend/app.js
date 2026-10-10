import express from 'express';
import { config } from './config/index.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createApiRouter } from './routes/index.js';

/**
 * Express application factory.
 * Configures middleware, routes, and error handlers.
 * @param {object} store Data store instance
 * @returns {express.Application}
 */
export function createApp(store) {
  const app = express();

  // Parse incoming JSON payloads with size limit
  app.use(express.json({ limit: config.bodyLimit }));

  // Request logger
  app.use(requestLogger);

  // Mount API routes under /api
  app.use('/api', createApiRouter(store));

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
