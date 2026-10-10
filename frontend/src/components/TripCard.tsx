import React from 'react';
import type { Trip } from '../types/booking';
import { formatCurrency, estimateArrivalTime, formatDuration } from '../utils/formatters';
import { WifiIcon, PowerPlugIcon, ShieldCheckIcon, ClockIcon } from './icons/Icons';

interface TripCardProps {
  trip: Trip;
  travelDate: string;
  isSelected: boolean;
  onSelectTrip: (trip: Trip) => void;
  disabled?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  isSelected,
  onSelectTrip,
  disabled = false,
}) => {
  const availableSeatsCount = trip.capacity - trip.bookedSeats.length;
  const isAlmostFull = availableSeatsCount <= 6;
  const isSoldOut = availableSeatsCount === 0;

  // Derive estimated duration (default 7h 30m for South India routes)
  const durationMinutes = trip.destination === 'Madurai' ? 480 : 450;
  const arrivalTime = estimateArrivalTime(trip.departure, durationMinutes);

  return (
    <article
      className={`trip-card ${isSelected ? 'selected-trip' : ''} ${isSoldOut ? 'sold-out' : ''}`}
      aria-label={`${trip.operator} from ${trip.origin} to ${trip.destination}`}
    >
      <div className="trip-card-main">
        {/* Operator & Bus Details */}
        <div className="trip-operator-column">
          <div className="operator-header">
            <span className="bus-category-tag">AC Seater · 2+2</span>
            <div className="rating-tag">
              <span className="star-icon">★</span>
              <span>4.7</span>
            </div>
          </div>
          <h3 className="operator-name">{trip.operator}</h3>
          <p className="bus-subtext">BharatBenz Luxury Executive</p>

          <div className="amenities-row">
            <span className="amenity-item" title="High-speed WiFi">
              <WifiIcon size={13} />
              <span>WiFi</span>
            </span>
            <span className="amenity-item" title="Charging Points">
              <PowerPlugIcon size={13} />
              <span>Power Plug</span>
            </span>
            <span className="amenity-item" title="GPS Tracked">
              <ShieldCheckIcon size={13} />
              <span>GPS Tracked</span>
            </span>
          </div>
        </div>

        {/* Schedule & Route Timeline */}
        <div className="trip-schedule-column">
          <div className="schedule-time-block">
            <span className="schedule-time">{trip.departure}</span>
            <span className="schedule-city">{trip.origin}</span>
          </div>

          <div className="schedule-journey-tracker">
            <span className="journey-duration">
              <ClockIcon size={13} />
              {formatDuration(durationMinutes)}
            </span>
            <div className="journey-line">
              <span className="line-dot start" />
              <div className="line-bar" />
              <span className="line-dot end" />
            </div>
            <span className="journey-stops">Direct Express</span>
          </div>

          <div className="schedule-time-block arrival">
            <span className="schedule-time">{arrivalTime}</span>
            <span className="schedule-city">{trip.destination}</span>
          </div>
        </div>

        {/* Fare & Booking Action */}
        <div className="trip-action-column">
          <div className="fare-container">
            <span className="fare-label">Starting from</span>
            <div className="fare-amount">{formatCurrency(trip.fare)}</div>
            <span className="fare-unit">per passenger</span>
          </div>

          <div className="availability-status">
            {isSoldOut ? (
              <span className="badge-sold-out">Sold Out</span>
            ) : isAlmostFull ? (
              <span className="badge-urgency">Only {availableSeatsCount} seats left!</span>
            ) : (
              <span className="badge-available">{availableSeatsCount} seats available</span>
            )}
          </div>

          <button
            type="button"
            className={`select-seats-cta ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectTrip(trip)}
            disabled={disabled || isSoldOut}
            aria-expanded={isSelected}
          >
            {isSelected ? 'Change Seats' : isSoldOut ? 'Sold Out' : 'Select Seats →'}
          </button>
        </div>
      </div>
    </article>
  );
};
