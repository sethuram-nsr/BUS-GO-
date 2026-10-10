import React from 'react';
import { TicketIcon, ShieldCheckIcon, ClockIcon, BusIcon } from './icons/Icons';

export const FeaturesPreview: React.FC = () => {
  return (
    <div className="features-preview-card" aria-label="BusGo platform highlights">
      <div className="features-preview-header">
        <span className="features-kicker">
          <BusIcon size={16} />
          <span>FAST & HASSLE-FREE BOOKING</span>
        </span>
        <h2 className="features-heading">Reserve Your Ideal Coach In 3 Steps</h2>
        <p className="features-subtext">
          Select your departure city, destination and travel date above, then click <strong>Find Buses</strong> to browse verified operators, view real-time seat availability, and lock your seat instantly.
        </p>
      </div>

      <div className="features-cards-grid">
        <div className="feature-card">
          <div className="feature-icon-bubble">
            <TicketIcon size={24} />
          </div>
          <h3 className="feature-title">Interactive 24-Seat Coach</h3>
          <p className="feature-desc">
            View exact window and aisle seats with live availability before booking.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-bubble">
            <ShieldCheckIcon size={24} />
          </div>
          <h3 className="feature-title">Verified Fleets</h3>
          <p className="feature-desc">
            Top operators like Sethu Travels, Southern Express, KPN, and Greenline.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-bubble">
            <ClockIcon size={24} />
          </div>
          <h3 className="feature-title">Punctual Intercity Network</h3>
          <p className="feature-desc">
            Frequent morning, evening, and overnight express buses across South India.
          </p>
        </div>
      </div>
    </div>
  );
};
