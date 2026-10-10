import React from 'react';
import type { BookingConfirmation } from '../types/booking';
import { formatCurrency, estimateArrivalTime, formatDuration } from '../utils/formatters';
import { formatDisplayDate } from '../utils/date';
import { PrinterIcon, CheckIcon, BusIcon, ArrowRightIcon } from './icons/Icons';

interface TicketVoucherProps {
  booking: BookingConfirmation;
  onBookAnother: () => void;
}

export const TicketVoucher: React.FC<TicketVoucherProps> = ({ booking, onBookAnother }) => {
  const arrivalTime = estimateArrivalTime(booking.departure, 450);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="ticket-voucher-section" aria-live="polite" aria-label="Booking Confirmation Ticket">
      <div className="ticket-success-banner">
        <div className="success-icon-badge">
          <CheckIcon size={24} />
        </div>
        <div className="success-text-group">
          <h2 className="success-title">Booking Confirmed!</h2>
          <p className="success-subtitle">
            Your seats have been successfully reserved in the system. Print or save this voucher for your demo journey.
          </p>
        </div>
      </div>

      {/* The Printable Boarding Pass Card */}
      <div className="boarding-pass-card" id="printable-ticket">
        {/* Pass Header */}
        <div className="pass-header">
          <div className="pass-brand">
            <BusIcon size={22} className="pass-logo-icon" />
            <span className="pass-company-name">BusGo Express Pass</span>
          </div>
          <div className="pass-status-pill">
            <span className="pill-dot" />
            <span>CONFIRMED</span>
          </div>
        </div>

        {/* Route Bar */}
        <div className="pass-route-row">
          <div className="route-city-block">
            <span className="city-code">{booking.origin.slice(0, 3).toUpperCase()}</span>
            <span className="city-name">{booking.origin}</span>
            <span className="dep-time">{booking.departure}</span>
          </div>

          <div className="route-flight-path">
            <span className="path-duration">{formatDuration(450)}</span>
            <div className="path-graphics">
              <span className="path-point" />
              <div className="path-line" />
              <BusIcon size={16} className="path-bus" />
              <div className="path-line" />
              <span className="path-point" />
            </div>
            <span className="path-type">AC Luxury Coach</span>
          </div>

          <div className="route-city-block arrival">
            <span className="city-code">{booking.destination.slice(0, 3).toUpperCase()}</span>
            <span className="city-name">{booking.destination}</span>
            <span className="dep-time">{arrivalTime}</span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="ticket-perforation">
          <div className="perforation-notch left" />
          <div className="perforation-dashed-line" />
          <div className="perforation-notch right" />
        </div>

        {/* Passenger & Journey Grid */}
        <div className="pass-details-grid">
          <div className="detail-item">
            <span className="detail-label">PASSENGER NAME</span>
            <span className="detail-value">{booking.passenger}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">OPERATOR</span>
            <span className="detail-value highlight">{booking.operator}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">TRAVEL DATE</span>
            <span className="detail-value">{formatDisplayDate(booking.date)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SEATS ALLOCATED</span>
            <span className="detail-value seat-badge">
              Seats {booking.seats.sort((a, b) => a - b).join(', ')} ({booking.seats.length} total)
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">CONTACT EMAIL</span>
            <span className="detail-value text-break">{booking.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">TOTAL AMOUNT PAID</span>
            <span className="detail-value price">{formatCurrency(booking.total)} <small className="demo-tag">(Demo Paid)</small></span>
          </div>
        </div>

        {/* Barcode & Reference Section */}
        <div className="pass-footer-strip">
          <div className="reference-code-box">
            <span className="ref-label">BOOKING REFERENCE (PNR)</span>
            <span className="ref-id-code">{booking.id}</span>
          </div>

          {/* Stylized Barcode */}
          <div className="ticket-barcode-wrap" title="Demo Barcode">
            <div className="barcode-bars" aria-hidden="true">
              {Array.from({ length: 36 }).map((_, idx) => (
                <span
                  key={idx}
                  className="bar"
                  style={{
                    width: idx % 3 === 0 ? '3px' : idx % 2 === 0 ? '1px' : '2px',
                    opacity: idx % 5 === 0 ? 0.4 : 1,
                  }}
                />
              ))}
            </div>
            <span className="barcode-number">*{booking.id.slice(0, 13).toUpperCase()}*</span>
          </div>
        </div>
      </div>

      {/* Ticket Action Buttons */}
      <div className="ticket-actions-bar">
        <button type="button" className="btn-print-ticket" onClick={handlePrint}>
          <PrinterIcon size={18} />
          <span>Print Boarding Pass</span>
        </button>

        <button type="button" className="btn-book-another" onClick={onBookAnother}>
          <span>Book Another Journey</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </section>
  );
};
