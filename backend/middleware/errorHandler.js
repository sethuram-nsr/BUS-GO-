/**
 * Centralized Express Error Handling Middleware
 */
export function errorHandler(error, req, res, next) {
  // If response headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || (error instanceof SyntaxError && error.status === 400 ? 400 : 500);

  if (status >= 500) {
    console.error('[SERVER ERROR]', error);
  }

  let message = error.message;
  if (status === 500) {
    if (error.code === '28P01' || error.message?.includes('password')) {
      message = 'PostgreSQL authentication failed. Please configure DB_PASSWORD in backend/.env with the password for user bus_admin.';
    } else if (error.code === 'ECONNREFUSED') {
      message = 'Unable to connect to PostgreSQL server. Please verify PostgreSQL service is running.';
    } else {
      message = 'Internal server error. Please retry.';
    }
  }

  res.status(status).json({ message });
}
