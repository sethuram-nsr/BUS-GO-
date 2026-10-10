import React from 'react';
import type { Trip } from '../types/booking';
import { SteeringWheelIcon, CheckIcon } from './icons/Icons';
import { formatCurrency } from '../utils/formatters';

interface SeatMapProps {
  trip: Trip;
  selectedSeats: number[];
  onToggleSeat: (seatNumber: number) => void;
  disabled?: boolean;
}

const MAX_SEATS = 6;

export const SeatMap: React.FC<SeatMapProps> = ({
  trip,
  selectedSeats,
  onToggleSeat,
  disabled = false,
}) => {
  const isBooked = (seatNum: number) => trip.bookedSeats.includes(seatNum);
  const isSelected = (seatNum: number) => selectedSeats.includes(seatNum);

  // Group seats into rows of 4 (2 Left, 2 Right)
  const rowsCount = Math.ceil(trip.capacity / 4);
  const rows = Array.from({ length: rowsCount }, (_, rowIndex) => {
    const start = rowIndex * 4 + 1;
    return {
      left: [start, start + 1].filter((s) => s <= trip.capacity),
      right: [start + 2, start + 3].filter((s) => s <= trip.capacity),
    };
  });

  return (
    <div className="seat-map-wrapper" aria-label="Bus seat selection map">
      <div className="seat-map-header">
        <h3 className="seat-map-title">Select Your Preferred Seats</h3>
        <p className="seat-map-subtitle">Click to pick your seat. You can select up to {MAX_SEATS} seats per booking.</p>
      </div>

      {/* Seat Legend */}
      <div className="seat-legend-bar" aria-hidden="true">
        <div className="legend-item">
          <span className="legend-seat-sample available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-seat-sample selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-seat-sample booked" />
          <span>Booked</span>
        </div>
      </div>

      {/* Bus Interior Mockup */}
      <div className="bus-chassis">
        {/* Driver Cabin */}
        <div className="driver-cabin">
          <div className="cabin-label">Front / Cabin</div>
          <div className="steering-wheel-wrapper" title="Driver Station">
            <SteeringWheelIcon size={26} className="steering-icon" />
          </div>
        </div>

        {/* Bus Deck / Seating Grid */}
        <div className="seats-deck" role="grid" aria-label="Seat layout">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="seat-row" role="row">
              {/* Left Column (2 seats) */}
              <div className="seat-subrow left">
                {row.left.map((seatNum) => {
                  const booked = isBooked(seatNum);
                  const selected = isSelected(seatNum);
                  const isMaxReached = selectedSeats.length >= MAX_SEATS && !selected;

                  return (
                    <button
                      key={seatNum}
                      type="button"
                      role="gridcell"
                      className={`seat-btn ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                      disabled={disabled || booked || isMaxReached}
                      onClick={() => onToggleSeat(seatNum)}
                      aria-label={`Seat ${seatNum}${booked ? ', already booked' : selected ? ', selected' : ', available'}`}
                      aria-pressed={selected}
                      title={booked ? `Seat ${seatNum} is booked` : `Seat ${seatNum} (${formatCurrency(trip.fare)})`}
                    >
                      {selected ? <CheckIcon size={14} className="seat-check-icon" /> : seatNum}
                    </button>
                  );
                })}
              </div>

              {/* Aisle */}
              <div className="bus-aisle" aria-hidden="true">
                <span className="aisle-row-num">{rIdx + 1}</span>
              </div>

              {/* Right Column (2 seats) */}
              <div className="seat-subrow right">
                {row.right.map((seatNum) => {
                  const booked = isBooked(seatNum);
                  const selected = isSelected(seatNum);
                  const isMaxReached = selectedSeats.length >= MAX_SEATS && !selected;

                  return (
                    <button
                      key={seatNum}
                      type="button"
                      role="gridcell"
                      className={`seat-btn ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                      disabled={disabled || booked || isMaxReached}
                      onClick={() => onToggleSeat(seatNum)}
                      aria-label={`Seat ${seatNum}${booked ? ', already booked' : selected ? ', selected' : ', available'}`}
                      aria-pressed={selected}
                      title={booked ? `Seat ${seatNum} is booked` : `Seat ${seatNum} (${formatCurrency(trip.fare)})`}
                    >
                      {selected ? <CheckIcon size={14} className="seat-check-icon" /> : seatNum}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Selection Summary */}
      <div className="seat-selection-summary">
        {selectedSeats.length === 0 ? (
          <p className="hint-text">Please click on available seats in the coach to proceed.</p>
        ) : (
          <div className="selection-stats">
            <span className="selected-seats-badge">
              <strong>{selectedSeats.length}</strong> {selectedSeats.length === 1 ? 'seat' : 'seats'} chosen: {selectedSeats.sort((a, b) => a - b).join(', ')}
            </span>
            <span className="subtotal-amount">
              Total: <strong>{formatCurrency(selectedSeats.length * trip.fare)}</strong>
            </span>
          </div>
        )}

        {selectedSeats.length >= MAX_SEATS && (
          <p className="max-seats-alert" role="status">
            Maximum limit reached ({MAX_SEATS} seats per booking).
          </p>
        )}
      </div>
    </div>
  );
};
