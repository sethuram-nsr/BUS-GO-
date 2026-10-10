import React from 'react';
import { SparklesIcon, ShieldCheckIcon, ClockIcon } from './icons/Icons';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <SparklesIcon size={14} />
        <span>RELIABLE INTERCITY BUS NETWORK</span>
      </div>
      <h1 className="hero-title">
        Your next journey <br />
        <span className="hero-title-highlight">starts here.</span>
      </h1>
      <p className="hero-subtitle">
        Compare verified operators, pick your preferred seats with real-time availability, and reserve in seconds.
      </p>

      <div className="hero-perks">
        <div className="hero-perk-item">
          <ShieldCheckIcon size={16} className="perk-icon" />
          <span>Real-time Seat Lock</span>
        </div>
        <div className="hero-perk-divider" />
        <div className="hero-perk-item">
          <ClockIcon size={16} className="perk-icon" />
          <span>Transparent Schedules</span>
        </div>
        <div className="hero-perk-divider" />
        <div className="hero-perk-item">
          <span className="perk-accent">₹0</span>
          <span>Zero Booking Fee Demo</span>
        </div>
      </div>
    </section>
  );
};
