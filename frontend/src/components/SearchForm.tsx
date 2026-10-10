import React from 'react';
import { MapPinIcon, CalendarIcon, SwapIcon, ArrowRightIcon } from './icons/Icons';
import { getTodayDateString, getTomorrowDateString } from '../utils/date';

interface SearchFormProps {
  origin: string;
  destination: string;
  date: string;
  isSearching: boolean;
  onOriginChange: (val: string) => void;
  onDestinationChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onSwapRoutes: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickRouteSelect: (origin: string, destination: string) => void;
}

const CITIES = ['Chennai', 'Bengaluru', 'Madurai', 'Coimbatore', 'Salem', 'Trichy'];

export const SearchForm: React.FC<SearchFormProps> = ({
  origin,
  destination,
  date,
  isSearching,
  onOriginChange,
  onDestinationChange,
  onDateChange,
  onSwapRoutes,
  onSubmit,
  onQuickRouteSelect,
}) => {
  const minDate = getTodayDateString();
  const tomorrowDate = getTomorrowDateString();

  return (
    <div className="search-widget-container">
      <form className="search-form-card" onSubmit={onSubmit} aria-label="Search bus routes">
        <div className="search-form-grid">
          {/* Origin Input */}
          <div className="search-field-group">
            <label htmlFor="search-origin" className="field-label">
              <MapPinIcon size={16} className="field-icon" />
              <span>Leaving From</span>
            </label>
            <div className="select-wrapper">
              <select
                id="search-origin"
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                className="search-select"
                disabled={isSearching}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} disabled={city === destination}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Swap Button */}
          <div className="swap-btn-container">
            <button
              type="button"
              className="swap-route-btn"
              onClick={onSwapRoutes}
              disabled={isSearching}
              title="Swap departure and arrival cities"
              aria-label="Swap origin and destination"
            >
              <SwapIcon size={18} />
            </button>
          </div>

          {/* Destination Input */}
          <div className="search-field-group">
            <label htmlFor="search-destination" className="field-label">
              <MapPinIcon size={16} className="field-icon" />
              <span>Going To</span>
            </label>
            <div className="select-wrapper">
              <select
                id="search-destination"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="search-select"
                disabled={isSearching}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} disabled={city === origin}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Input */}
          <div className="search-field-group">
            <div className="date-label-row">
              <label htmlFor="search-date" className="field-label">
                <CalendarIcon size={16} className="field-icon" />
                <span>Travel Date</span>
              </label>
              <div className="date-quick-buttons">
                <button
                  type="button"
                  className={`date-chip ${date === minDate ? 'active' : ''}`}
                  onClick={() => onDateChange(minDate)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`date-chip ${date === tomorrowDate ? 'active' : ''}`}
                  onClick={() => onDateChange(tomorrowDate)}
                >
                  Tomorrow
                </button>
              </div>
            </div>
            <input
              id="search-date"
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="search-input-date"
              required
              disabled={isSearching}
            />
          </div>

          {/* Search Action Button */}
          <div className="search-action-group">
            <button
              type="submit"
              className="search-submit-btn"
              disabled={isSearching || origin === destination}
              id="search-buses-btn"
            >
              {isSearching ? (
                <>
                  <span className="spinner" />
                  <span>Searching…</span>
                </>
              ) : (
                <>
                  <span>Find Buses</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick popular routes */}
        {/* <div className="quick-routes-bar">
          <span className="quick-routes-label">Popular corridors:</span>
          <div className="quick-routes-chips">
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Chennai', 'Bengaluru')}
            >
              Chennai ➔ Bengaluru
            </button>
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Bengaluru', 'Chennai')}
            >
              Bengaluru ➔ Chennai
            </button>
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Chennai', 'Coimbatore')}
            >
              Chennai ➔ Coimbatore
            </button>
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Chennai', 'Madurai')}
            >
              Chennai ➔ Madurai
            </button>
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Coimbatore', 'Bengaluru')}
            >
              Coimbatore ➔ Bengaluru
            </button>
            <button
              type="button"
              className="quick-route-chip"
              onClick={() => onQuickRouteSelect('Madurai', 'Chennai')}
            >
              Madurai ➔ Chennai
            </button>
          </div>
        </div> */}
      </form>
    </div>
  );
};
