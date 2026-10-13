/**
 * busApi.ts
 * All API calls. When the backend is unreachable, functions transparently
 * fall back to offline demo data so the frontend keeps working.
 */

import type { BookingConfirmation, BookingRequest, Trip } from '../types/booking';
import { getMockTrips, createMockBooking, DEMO_USER, DEMO_CREDENTIALS } from './mockData';
import { checkBackendHealth, isOffline, setOffline } from './demoMode';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Internal fetch wrapper ───────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    setOffline(true);
    throw new ApiError('Network connection error. Is the server running?');
  }

  let data: { message?: string } & unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Unexpected server response format.', response.status);
  }

  if (!response.ok) {
    const message = (data as { message?: string })?.message
      || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

// ─── Trip search ──────────────────────────────────────────────────────────────

/**
 * Searches available bus trips for a specific origin, destination, and travel date.
 * Falls back to mock trips when the backend is unreachable.
 */
export async function searchTrips(
  origin: string,
  destination: string,
  date: string,
): Promise<Trip[]> {
  // If we already know we're offline, skip the network call
  if (isOffline()) {
    return getMockTrips(origin, destination);
  }

  try {
    const query = new URLSearchParams({
      origin: origin.trim(),
      destination: destination.trim(),
      date: date.trim(),
    });
    const results = await request<Trip[]>(`/trips?${query.toString()}`);
    setOffline(false);
    return results;
  } catch (err) {
    // Network error → use mock data silently
    if (err instanceof ApiError && !err.status) {
      setOffline(true);
      return getMockTrips(origin, destination);
    }
    throw err;
  }
}

// ─── Booking ──────────────────────────────────────────────────────────────────

// Store last searched trips for use in offline booking
let _lastTrips: Trip[] = [];
export function cacheTrips(trips: Trip[]) { _lastTrips = trips; }

/**
 * Creates and confirms a seat booking.
 * Falls back to an in-memory mock booking when the backend is unreachable.
 */
export async function createBooking(
  payload: BookingRequest,
): Promise<BookingConfirmation> {
  if (isOffline()) {
    return createMockBooking(payload, _lastTrips);
  }

  try {
    const confirmation = await request<BookingConfirmation>('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setOffline(false);
    return confirmation;
  } catch (err) {
    if (err instanceof ApiError && !err.status) {
      setOffline(true);
      return createMockBooking(payload, _lastTrips);
    }
    throw err;
  }
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  createdAt?: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  email?: string;
  password: string;
}

export interface LoginRequest {
  phone?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Registers a new user account.
 */
export async function signupUser(payload: SignupRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Authenticates user with mobile number (or demo email) and password.
 * When backend is unreachable, accepts the hardcoded demo credentials.
 */
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  // ── Demo / offline login ──────────────────────────────────────────────────
  const isEmailLogin = Boolean(payload.email);
  const emailMatch =
    isEmailLogin &&
    payload.email?.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
    payload.password === DEMO_CREDENTIALS.password;

  if (isOffline() || (await checkBackendHealth())) {
    // Backend is down — only allow demo credentials
    if (emailMatch) {
      return {
        success: true,
        message: 'Demo login successful',
        user: DEMO_USER,
      };
    }
    if (isOffline()) {
      throw new ApiError(
        'Server is offline. Use demo credentials: sethuram2407@gmail.com / Sethu@123',
      );
    }
  }

  // ── Normal backend login ──────────────────────────────────────────────────
  try {
    const response = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setOffline(false);
    return response;
  } catch (err) {
    if (err instanceof ApiError && !err.status) {
      // Backend just went down mid-session
      setOffline(true);
      if (emailMatch) {
        return { success: true, message: 'Demo login successful', user: DEMO_USER };
      }
      throw new ApiError(
        'Server is offline. Use demo credentials: sethuram2407@gmail.com / Sethu@123',
      );
    }
    throw err;
  }
}
