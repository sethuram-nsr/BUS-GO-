import React from 'react';
import { BusIcon, ShieldCheckIcon } from './icons/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand-side">
          <div className="footer-brand-title">
            <BusIcon size={18} />
            <span>BusGo Express</span>
          </div>
          <p className="footer-tagline">
            Lightweight, high-performance multi-operator bus booking prototype.
          </p>
        </div>


      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} BusGo Inc.</span>
        <span>Standard Indian Time (IST)</span>
      </div>
    </footer>
  );
};
