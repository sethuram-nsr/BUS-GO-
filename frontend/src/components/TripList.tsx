import React, { useState } from 'react';
import type { Trip, SortOption } from '../types/booking';
import { TripCard } from './TripCard';
import { formatDisplayDate } from '../utils/date';
import { BusIcon } from './icons/Icons';

interface TripListProps {
  trips: Trip[];
  origin: string;
  destination: string;
  searchedDate: string;
  selectedTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  onQuickRouteSelect: (origin: string, destination: string) => void;
  isLoading: boolean;
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  origin,
  destination,
  searchedDate,
  selectedTrip,
  onSelectTrip,
  onQuickRouteSelect,
  isLoading,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('cheapest');

  // Sorted list based on current sort option
  const sortedTrips = [...trips].sort((a, b) => {
    if (sortOption === 'cheapest') return a.fare - b.fare;
    if (sortOption === 'earliest') return a.departure.localeCompare(b.departure);
    if (sortOption === 'availability') {
      const availA = a.capacity - a.bookedSeats.length;
      const availB = b.capacity - b.bookedSeats.length;
      return availB - availA;
    }
    return 0;
  });

  return (
    <section className="results-container" id="bus-results-section" aria-label="Available bus trips">
      <div className="results-header-bar">
        <div className="results-title-group">
          <h2 className="results-heading">
            {isLoading ? 'Searching Buses...' : `${trips.length} ${trips.length === 1 ? 'Bus' : 'Buses'} Available`}
          </h2>
          <span className="results-route-meta">
            {origin} ➔ {destination} · {formatDisplayDate(searchedDate)}
          </span>
        </div>

        {!isLoading && trips.length > 1 && (
          <div className="sort-buttons-group" role="radiogroup" aria-label="Sort buses by">
            <span className="sort-label">Sort by:</span>
            <button
              type="button"
              className={`sort-tab ${sortOption === 'cheapest' ? 'active' : ''}`}
              onClick={() => setSortOption('cheapest')}
              aria-checked={sortOption === 'cheapest'}
              role="radio"
            >
              Price: Low to High
            </button>
            <button
              type="button"
              className={`sort-tab ${sortOption === 'earliest' ? 'active' : ''}`}
              onClick={() => setSortOption('earliest')}
              aria-checked={sortOption === 'earliest'}
              role="radio"
            >
              Earliest Departure
            </button>
            <button
              type="button"
              className={`sort-tab ${sortOption === 'availability' ? 'active' : ''}`}
              onClick={() => setSortOption('availability')}
              aria-checked={sortOption === 'availability'}
              role="radio"
            >
              Max Availability
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="trips-loading-skeleton" aria-live="polite" aria-label="Loading available buses">
          <div className="skeleton-loading-banner">
            <span className="spinner" />
            <span>Finding real-time buses from <strong>{origin}</strong> to <strong>{destination}</strong>...</span>
          </div>
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : trips.length === 0 ? (
        <div className="empty-trips-card">
          <div className="empty-icon-circle">
            <BusIcon size={32} />
          </div>
          <h3>No buses found for this route</h3>
          <p>
            We couldn't find scheduled buses between <strong>{origin}</strong> and <strong>{destination}</strong> on {formatDisplayDate(searchedDate)}.
          </p>
          <div className="empty-suggestions">
            <p className="suggestions-prompt">Try these popular scheduled corridors:</p>
            <div className="suggestion-pills">
              <button
                type="button"
                className="suggestion-pill-btn"
                onClick={() => onQuickRouteSelect('Chennai', 'Bengaluru')}
              >
                Chennai ➔ Bengaluru
              </button>
              <button
                type="button"
                className="suggestion-pill-btn"
                onClick={() => onQuickRouteSelect('Bengaluru', 'Chennai')}
              >
                Bengaluru ➔ Chennai
              </button>
              <button
                type="button"
                className="suggestion-pill-btn"
                onClick={() => onQuickRouteSelect('Chennai', 'Coimbatore')}
              >
                Chennai ➔ Coimbatore
              </button>
              <button
                type="button"
                className="suggestion-pill-btn"
                onClick={() => onQuickRouteSelect('Chennai', 'Madurai')}
              >
                Chennai ➔ Madurai
              </button>
              <button
                type="button"
                className="suggestion-pill-btn"
                onClick={() => onQuickRouteSelect('Coimbatore', 'Bengaluru')}
              >
                Coimbatore ➔ Bengaluru
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="trips-grid">
          {sortedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              travelDate={searchedDate}
              isSelected={selectedTrip?.id === trip.id}
              onSelectTrip={onSelectTrip}
              disabled={isLoading}
            />
          ))}
        </div>
      )}
    </section>
  );
};
