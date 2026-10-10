import React, { useState, useEffect, type FormEvent } from 'react';
import type { BookingConfirmation, Trip } from './types/booking';
import { searchTrips, createBooking } from './api/busApi';
import { getTodayDateString } from './utils/date';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchForm } from './components/SearchForm';
import { TripList } from './components/TripList';
import { CheckoutCard } from './components/CheckoutCard';
import { TicketVoucher } from './components/TicketVoucher';
import { FeaturesPreview } from './components/FeaturesPreview';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { user } = useAuth();

  // Search parameters
  const [origin, setOrigin] = useState<string>('Chennai');
  const [destination, setDestination] = useState<string>('Bengaluru');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [searchedDate, setSearchedDate] = useState<string>('');

  // Results & status
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Selection & Checkout
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerName, setPassengerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);

  // Sync logged in user profile into booking fields
  useEffect(() => {
    if (user) {
      if (!passengerName) setPassengerName(user.name);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user]);

  // Confirmed booking
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null);

  // Notifications
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Performs the trip search against backend API
   */
  const executeSearch = async (fromCity: string, toCity: string, travelDate: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setErrorMessage('');
    setSelectedTrip(null);
    setSelectedSeats([]);
    setConfirmedBooking(null);
    setSearchedDate(travelDate);

    // Smooth scroll down to the bus results section
    setTimeout(() => {
      document.getElementById('bus-results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);

    try {
      const results = await searchTrips(fromCity, toCity, travelDate);
      setTrips(results);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Unable to fetch trips. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Search form submission handler
   */
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch(origin, destination, date);
  };

  /**
   * Swaps departure and destination cities
   */
  const handleSwapRoutes = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  /**
   * Quick popular route shortcut selector
   */
  const handleQuickRouteSelect = (fromCity: string, toCity: string) => {
    setOrigin(fromCity);
    setDestination(toCity);
    executeSearch(fromCity, toCity, date);
  };

  /**
   * Handles user choosing a bus trip to view/select seats
   */
  const handleSelectTrip = (trip: Trip) => {
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(null);
      setSelectedSeats([]);
      return;
    }

    setSelectedTrip(trip);
    setSelectedSeats([]);
    setErrorMessage('');
    setConfirmedBooking(null);

    // Smooth scroll down to seat selection
    setTimeout(() => {
      document.getElementById('seat-selection-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  /**
   * Toggles seat selection with limit of 6 seats
   */
  const handleToggleSeat = (seatNum: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNum)) {
        return prev.filter((s) => s !== seatNum);
      }
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, seatNum];
    });
  };

  /**
   * Handles confirming demo booking
   */
  const handleConfirmBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || selectedSeats.length === 0) return;

    setIsBooking(true);
    setErrorMessage('');

    try {
      const confirmation = await createBooking({
        tripId: selectedTrip.id,
        date: searchedDate,
        seats: selectedSeats,
        passenger: passengerName.trim(),
        email: email.trim(),
      });

      setConfirmedBooking(confirmation);
      setSelectedTrip(null);
      setSelectedSeats([]);
      setTrips([]);
      setHasSearched(false);

      // Show success toast
      const seatLabel = selectedSeats.length === 1 ? 'seat' : 'seats';
      setSuccessMessage(
        `🎉 Booking confirmed! ${selectedSeats.length} ${seatLabel} on ${selectedTrip.operator} — enjoy your journey!`
      );

      // Smooth scroll to confirmed ticket
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = (err as Error).message || 'Booking failed.';
      setErrorMessage(message);

      // In case of conflict (someone else booked the seat), refresh current trip seats
      try {
        const refreshedTrips = await searchTrips(selectedTrip.origin, selectedTrip.destination, searchedDate);
        setTrips(refreshedTrips);
        const updatedTrip = refreshedTrips.find((t) => t.id === selectedTrip.id);
        if (updatedTrip) {
          setSelectedTrip(updatedTrip);
          // Drop seats that were just taken
          setSelectedSeats((current) => current.filter((s) => !updatedTrip.bookedSeats.includes(s)));
        }
      } catch {
        // Keep primary error message
      }
    } finally {
      setIsBooking(false);
    }
  };

  /**
   * Resets booking to allow booking another trip
   */
  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setSelectedTrip(null);
    setSelectedSeats([]);
    setHasSearched(false);
    setTrips([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Global reset to clean home state
   */
  const handleResetHome = () => {
    setConfirmedBooking(null);
    setSelectedTrip(null);
    setSelectedSeats([]);
    setErrorMessage('');
    setHasSearched(false);
    setTrips([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <Navbar onReset={handleResetHome} />

      <main className="main-content-wrapper">
        <Toast message={successMessage} type="success" onDismiss={() => setSuccessMessage('')} />
        <Toast message={errorMessage} onDismiss={() => setErrorMessage('')} />

        {/* If booking is confirmed, display boarding pass ticket */}
        {confirmedBooking ? (
          <TicketVoucher booking={confirmedBooking} onBookAnother={handleBookAnother} />
        ) : (
          <>
            <Hero />

            <SearchForm
              origin={origin}
              destination={destination}
              date={date}
              isSearching={isSearching}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onDateChange={setDate}
              onSwapRoutes={handleSwapRoutes}
              onSubmit={handleSearchSubmit}
              onQuickRouteSelect={handleQuickRouteSelect}
            />

            {/* Selected Trip Checkout & Seat Selection */}
            {selectedTrip && (
              <CheckoutCard
                trip={selectedTrip}
                travelDate={searchedDate}
                selectedSeats={selectedSeats}
                passengerName={passengerName}
                email={email}
                isBooking={isBooking}
                onToggleSeat={handleToggleSeat}
                onPassengerNameChange={setPassengerName}
                onEmailChange={setEmail}
                onSubmitBooking={handleConfirmBooking}
                onCancel={() => setSelectedTrip(null)}
              />
            )}

            {/* Trip Search Results: Show bus list when user searches, otherwise show features */}
            {hasSearched ? (
              <TripList
                trips={trips}
                origin={origin}
                destination={destination}
                searchedDate={searchedDate}
                selectedTrip={selectedTrip}
                onSelectTrip={handleSelectTrip}
                onQuickRouteSelect={handleQuickRouteSelect}
                isLoading={isSearching}
              />
            ) : (
              <FeaturesPreview />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
