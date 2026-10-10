import React, { useState } from 'react';
import type { Trip } from '../types/booking';
import { SeatMap } from './SeatMap';
import { formatCurrency } from '../utils/formatters';
import { formatDisplayDate } from '../utils/date';
import { UsersIcon, MailIcon, ShieldCheckIcon, CloseIcon } from './icons/Icons';

interface CheckoutCardProps {
  trip: Trip;
  travelDate: string;
  selectedSeats: number[];
  passengerName: string;
  email: string;
  isBooking: boolean;
  onToggleSeat: (seatNum: number) => void;
  onPassengerNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onSubmitBooking: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CheckoutCard: React.FC<CheckoutCardProps> = ({
  trip,
  travelDate,
  selectedSeats,
  passengerName,
  email,
  isBooking,
  onToggleSeat,
  onPassengerNameChange,
  onEmailChange,
  onSubmitBooking,
  onCancel,
}) => {
  const [formTouched, setFormTouched] = useState(false);
  const totalAmount = selectedSeats.length * trip.fare;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    if (selectedSeats.length === 0) return;
    onSubmitBooking(e);
  };

  return (
    <section className="checkout-section-card" id="seat-selection-section" aria-label="Seat Selection and Checkout">
      {/* Checkout Top Bar */}
      <div className="checkout-banner">
        <div className="checkout-trip-meta">
          <span className="checkout-eyebrow">STEP 2 OF 2 · SEAT SELECTION & DETAILS</span>
          <h2 className="checkout-trip-title">
            {trip.operator} · {trip.origin} ➔ {trip.destination}
          </h2>
          <p className="checkout-trip-sub">
            Departure at <strong>{trip.departure}</strong> on <strong>{formatDisplayDate(travelDate)}</strong>
          </p>
        </div>
        <button
          type="button"
          className="checkout-close-btn"
          onClick={onCancel}
          disabled={isBooking}
          aria-label="Close seat selection"
          title="Close seat selection"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="checkout-content-grid">
        {/* Left Column: Interactive Bus Seat Layout */}
        <div className="checkout-seatmap-pane">
          <SeatMap
            trip={trip}
            selectedSeats={selectedSeats}
            onToggleSeat={onToggleSeat}
            disabled={isBooking}
          />
        </div>

        {/* Right Column: Passenger Form & Price Breakdown */}
        <div className="checkout-form-pane">
          <form onSubmit={handleSubmit} className="passenger-booking-form" noValidate={false}>
            <div className="form-card-header">
              <h3 className="form-card-title">Passenger Details</h3>
              <p className="form-card-subtitle">Tickets and notifications will be issued to this contact.</p>
            </div>

            {/* Selected Seats Chips */}
            <div className="selected-chips-container">
              <span className="chips-title">Allocated Seats:</span>
              {selectedSeats.length === 0 ? (
                <span className="no-seats-selected-warn">No seat chosen yet</span>
              ) : (
                <div className="chips-list">
                  {selectedSeats
                    .sort((a, b) => a - b)
                    .map((seatNum) => (
                      <span key={seatNum} className="seat-chip">
                        Seat {seatNum}
                        <button
                          type="button"
                          className="chip-remove-btn"
                          onClick={() => onToggleSeat(seatNum)}
                          disabled={isBooking}
                          title={`Deselect seat ${seatNum}`}
                          aria-label={`Remove seat ${seatNum}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Input: Full Name */}
            <div className="form-field">
              <label htmlFor="passenger-name" className="field-label">
                <UsersIcon size={16} />
                <span>Primary Passenger Full Name *</span>
              </label>
              <input
                id="passenger-name"
                type="text"
                value={passengerName}
                onChange={(e) => onPassengerNameChange(e.target.value)}
                placeholder="e.g. Anand Kumar"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                disabled={isBooking}
                className="form-input"
              />
            </div>

            {/* Input: Email */}
            <div className="form-field">
              <label htmlFor="passenger-email" className="field-label">
                <MailIcon size={16} />
                <span>Email Address *</span>
              </label>
              <input
                id="passenger-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="e.g. anand@example.com"
                required
                maxLength={254}
                autoComplete="email"
                disabled={isBooking}
                className="form-input"
              />
            </div>

            {/* Fare Breakdown Card */}
            <div className="fare-breakdown-box">
              <div className="breakdown-row">
                <span>Base Fare ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} × {formatCurrency(trip.fare)})</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="breakdown-row discount">
                <span>Platform Convenience Fee</span>
                <span className="free-badge">FREE (₹0)</span>
              </div>
              <div className="breakdown-row discount">
                <span>Taxes & GST (Demo)</span>
                <span className="free-badge">₹0</span>
              </div>
              <div className="breakdown-divider" />
              <div className="breakdown-row total-row">
                <span className="total-label">Total Payable</span>
                <span className="total-price">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Validation Notice if no seat selected */}
            {formTouched && selectedSeats.length === 0 && (
              <div className="form-warning-banner" role="alert">
                Please pick at least 1 seat from the coach layout on the left.
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              className="confirm-booking-btn"
              disabled={isBooking || selectedSeats.length === 0}
            >
              {isBooking ? (
                <>
                  <span className="spinner" />
                  <span>Securing your seats…</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon size={18} />
                  <span>Confirm Booking ({formatCurrency(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="demo-guarantee-note">
              <span className="secure-badge">🛡️ Demo Simulator</span>
              <span>No credit card needed · Instant database booking</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
