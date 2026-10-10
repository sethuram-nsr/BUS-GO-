import type { BookingConfirmation, BookingRequest, Trip } from '../types/booking';

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generic JSON API request handler with error interception
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    throw new ApiError('Network connection error. Is the server running?');
  }

  let data: { message?: string } & unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Unexpected server response format.', response.status);
  }

  if (!response.ok) {
    const message = (data as { message?: string })?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

/**
 * Searches available bus trips for a specific origin, destination, and travel date.
 */
export async function searchTrips(origin: string, destination: string, date: string): Promise<Trip[]> {
  const query = new URLSearchParams({
    origin: origin.trim(),
    destination: destination.trim(),
    date: date.trim(),
  });
  return request<Trip[]>(`/trips?${query.toString()}`);
}

/**
 * Creates and confirms a demo seat booking on a selected trip.
 */
export async function createBooking(payload: BookingRequest): Promise<BookingConfirmation> {
  return request<BookingConfirmation>('/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  createdAt: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  email?: string;
  password: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

/**
 * Registers a new user account.
 */
export async function signupUser(payload: SignupRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticates user with mobile number and password.
 */
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
