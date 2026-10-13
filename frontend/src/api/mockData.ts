/**
 * mockData.ts
 * Offline / demo-mode fallback data.
 * Used when the backend server is not reachable.
 */

import type { Trip, BookingConfirmation, BookingRequest } from '../types/booking';

// ─── Demo user ────────────────────────────────────────────────────────────────
export const DEMO_USER = {
  id: 'demo-001',
  name: 'Sethuram',
  phone: '2407000000',           // not used for demo login
  email: 'sethuram2407@gmail.com',
  createdAt: new Date().toISOString(),
};

/** Credentials accepted in offline demo mode */
export const DEMO_CREDENTIALS = {
  email: 'sethuram2407@gmail.com',
  password: 'Sethu@123',
};

// ─── Mock trips ───────────────────────────────────────────────────────────────

const BASE_DATE = new Date().toISOString().split('T')[0]; // today

function makeTrips(
  origin: string,
  destination: string,
  idOffset: number,
): Trip[] {
  return [
    {
      id: idOffset + 1,
      operator_id: 1,
      operator: 'VRL Travels',
      origin,
      destination,
      departure: '06:00 AM',
      fare: 450,
      capacity: 40,
      bookedSeats: [3, 7, 12, 18],
    },
    {
      id: idOffset + 2,
      operator_id: 2,
      operator: 'SRS Travels',
      origin,
      destination,
      departure: '09:30 AM',
      fare: 380,
      capacity: 45,
      bookedSeats: [1, 5, 22],
    },
    {
      id: idOffset + 3,
      operator_id: 3,
      operator: 'KPN Travels',
      origin,
      destination,
      departure: '02:00 PM',
      fare: 520,
      capacity: 36,
      bookedSeats: [2, 4, 6, 8, 10, 14, 20, 30],
    },
    {
      id: idOffset + 4,
      operator_id: 4,
      operator: 'Orange Tours',
      origin,
      destination,
      departure: '10:30 PM',
      fare: 600,
      capacity: 40,
      bookedSeats: [15, 16, 25],
    },
  ];
}

// All popular routes bundled
const MOCK_ROUTES: Record<string, Trip[]> = {
  'chennai→bengaluru': makeTrips('Chennai', 'Bengaluru', 100),
  'bengaluru→chennai': makeTrips('Bengaluru', 'Chennai', 200),
  'chennai→coimbatore': makeTrips('Chennai', 'Coimbatore', 300),
  'coimbatore→chennai': makeTrips('Coimbatore', 'Chennai', 400),
  'bengaluru→coimbatore': makeTrips('Bengaluru', 'Coimbatore', 500),
  'coimbatore→bengaluru': makeTrips('Coimbatore', 'Bengaluru', 600),
  'chennai→madurai': makeTrips('Chennai', 'Madurai', 700),
  'madurai→chennai': makeTrips('Madurai', 'Chennai', 800),
  'chennai→hyderabad': makeTrips('Chennai', 'Hyderabad', 900),
  'hyderabad→chennai': makeTrips('Hyderabad', 'Chennai', 1000),
  'bengaluru→hyderabad': makeTrips('Bengaluru', 'Hyderabad', 1100),
  'hyderabad→bengaluru': makeTrips('Hyderabad', 'Bengaluru', 1200),
  'mumbai→pune': makeTrips('Mumbai', 'Pune', 1300),
  'pune→mumbai': makeTrips('Pune', 'Mumbai', 1400),
  'delhi→agra': makeTrips('Delhi', 'Agra', 1500),
  'agra→delhi': makeTrips('Agra', 'Delhi', 1600),
};

// Locally booked seats during demo session (resets on page refresh)
const sessionBookedSeats: Record<number, number[]> = {};

/**
 * Returns mock trips for a given route.
 * Returns an empty array if route not found (no error thrown).
 */
export function getMockTrips(origin: string, destination: string): Trip[] {
  const key = `${origin.toLowerCase()}→${destination.toLowerCase()}`;
  const trips = MOCK_ROUTES[key] ?? [];

  // Merge in any seats booked during this session
  return trips.map((trip) => ({
    ...trip,
    bookedSeats: [
      ...trip.bookedSeats,
      ...(sessionBookedSeats[trip.id] ?? []),
    ],
  }));
}

/** All distinct cities available in demo mode */
export const DEMO_CITIES = [
  'Chennai', 'Bengaluru', 'Coimbatore', 'Madurai',
  'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Agra',
];

/**
 * Simulates a booking confirmation in demo mode.
 * Marks the seats as booked in the session store.
 */
export function createMockBooking(
  payload: BookingRequest,
  trips: Trip[],
): BookingConfirmation {
  const trip = trips.find((t) => t.id === payload.tripId);
  if (!trip) throw new Error('Trip not found in demo data.');

  // Check if any seat is already booked
  const existing = [
    ...trip.bookedSeats,
    ...(sessionBookedSeats[trip.id] ?? []),
  ];
  const conflict = payload.seats.find((s) => existing.includes(s));
  if (conflict) {
    throw new Error(`Seat ${conflict} was just taken! Please choose another.`);
  }

  // Register seats for this session
  sessionBookedSeats[trip.id] = [
    ...(sessionBookedSeats[trip.id] ?? []),
    ...payload.seats,
  ];

  return {
    id: `DEMO-${Date.now()}`,
    tripId: trip.id,
    date: payload.date || BASE_DATE,
    seats: payload.seats,
    passenger: payload.passenger,
    email: payload.email,
    total: payload.seats.length * trip.fare,
    status: 'confirmed',
    operator: trip.operator,
    origin: trip.origin,
    destination: trip.destination,
    departure: trip.departure,
  };
}
