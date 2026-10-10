/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message = 'Invalid request parameters.') {
    super(message, 400);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 404);
  }
}

/**
 * 409 Conflict (e.g. seat already reserved)
 */
export class ConflictError extends AppError {
  constructor(message = 'A selected seat was just booked. Please choose again.') {
    super(message, 409);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication failed.') {
    super(message, 401);
  }
}
