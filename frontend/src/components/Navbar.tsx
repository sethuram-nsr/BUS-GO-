import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, User, LogOut, ChevronDown } from 'lucide-react';
import { BusIcon } from './icons/Icons';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onReset?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <button
          type="button"
          className="brand-logo-btn"
          onClick={() => {
            onReset?.();
            navigate('/');
          }}
          aria-label="BusGo Home"
        >
          <div className="brand-icon-wrapper">
            <BusIcon size={24} className="brand-bus-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">BusGo</span>
            {/* <span className="brand-badge">Express</span> */}
          </div>
        </button>

        <div className="navbar-meta">
          {user ? (
            <div className="nav-user-wrapper" ref={menuRef}>
              <button
                type="button"
                className="nav-user-chip"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                aria-label="User account menu"
              >
                <div className="nav-user-avatar">
                  <User size={16} aria-hidden="true" />
                </div>
                <span className="nav-user-name">{user.name}</span>
                <ChevronDown
                  size={14}
                  className={`nav-user-chevron ${isMenuOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isMenuOpen && (
                <div className="nav-user-dropdown" role="menu">
                  <div className="nav-dropdown-profile">
                    <div className="nav-dropdown-avatar">
                      <User size={20} aria-hidden="true" />
                    </div>
                    <div className="nav-dropdown-info">
                      <p className="nav-dropdown-name">{user.name}</p>
                      <p className="nav-dropdown-phone">{user.phone}</p>
                      {user.email && <p className="nav-dropdown-email">{user.email}</p>}
                    </div>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-item nav-logout-btn"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut size={15} aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <button
                type="button"
                className="nav-auth-btn nav-auth-btn-login"
                onClick={() => {
                  navigate('/login');
                }}
                aria-label="Log in"
              >
                <LogIn size={15} aria-hidden="true" />
                <span>Login</span>
              </button>
              <button
                type="button"
                className="nav-auth-btn nav-auth-btn-signup"
                onClick={() => {
                  navigate('/signup');
                }}
                aria-label="Create account"
              >
                <UserPlus size={15} aria-hidden="true" />
                <span>Sign up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
