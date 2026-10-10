export interface Trip {
  id: number;
  operator_id: number;
  operator: string;
  origin: string;
  destination: string;
  departure: string;
  fare: number;
  capacity: number;
  bookedSeats: number[];
}

export interface BookingRequest {
  tripId: number;
  date: string;
  seats: number[];
  passenger: string;
  email: string;
}

export interface BookingConfirmation {
  id: string;
  tripId: number;
  date: string;
  seats: number[];
  passenger: string;
  email: string;
  total: number;
  status: string;
  operator: string;
  origin: string;
  destination: string;
  departure: string;
}

export interface SearchCriteria {
  origin: string;
  destination: string;
  date: string;
}

export type SortOption = 'cheapest' | 'earliest' | 'availability';
