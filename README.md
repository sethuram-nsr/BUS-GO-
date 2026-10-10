# BusGo — basic multi-operator booking project

A runnable learning starter: React + TypeScript + Vite frontend, Express JavaScript backend and SQLite database. Uses npm only. SQLite keeps setup simple; move to PostgreSQL when building the full platform.

## Run

Install Node.js 24 or newer, then in this folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173. API runs at http://127.0.0.1:5000. Both bind locally. No API keys or database setup required.

## Try it

1. Search Chennai → Bengaluru for today or a future date.
2. Compare Sethu Travels and Southern Express.
3. Select 1–6 seats and enter a demo name/email.
4. Confirm the demo booking, then print the demo ticket.
5. Search again: those seats are unavailable on that date.

Other routes: Chennai → Madurai and Bengaluru → Chennai. Each seeded trip is a recurring daily service for demonstration. Dates use India time. Bookings persist in backend/bookings.sqlite; stop the server and delete that file to reset all demo data.

## Structure

- frontend/src/App.tsx — main application controller and user flows
- frontend/src/components/ — modular UI components (Navbar, Hero, SearchForm, TripList, TripCard, SeatMap, CheckoutCard, TicketVoucher, Toast, Footer, icons)
- frontend/src/api/ — type-safe API client for search and booking
- frontend/src/types/ — TypeScript interfaces and models
- frontend/src/utils/ — currency formatters, timezone date helpers, and duration calculators
- frontend/src/style.css — design system tokens, responsive grid, glassmorphism, animations, and print styling
- frontend/vite.config.js — development API proxy
- backend/app.js — Express application factory and middleware setup
- backend/server.js — HTTP listener and process lifecycle management
- backend/routes/ — modular API routes (tripRoutes.js, bookingRoutes.js)
- backend/database/ — SQLite schema (schema.js) and transactional store (store.js)
- backend/middleware/ — centralized error handler (errorHandler.js) and request logger (logger.js)
- backend/errors/ — typed HTTP error classes (AppError.js)
- backend/utils/ — date validation (date.js) and input validators (validation.js)
- backend/db.js — database store facade
- backend/booking.test.js — automated unit and integration tests

## API

GET /api/trips?origin=Chennai&destination=Bengaluru&date=YYYY-MM-DD

POST /api/bookings

```json
{
  "tripId": 1,
  "date": "2099-01-01",
  "seats": [1, 2],
  "passenger": "Demo Passenger",
  "email": "demo@example.com"
}
```

The server calculates the total from the trip fare. A database unique constraint on trip/date/seat and a transaction prevent duplicate seat allocation. A conflict returns HTTP 409. Passenger is the contact for the whole booking, not individual passenger records.

## Checks

```bash
npm test
npm run build
```

Build creates frontend/dist. The project provides a local development setup, not a production deployment configuration.

## Deliberately outside this basic version

No login, operator/admin dashboard, payment integration, cancellations, email delivery, temporary seat holds, stop-by-stop inventory, commissions, settlements or booking-history access. All operators/trips are seeded in backend/db.js. Bookings are marked DEMO_CONFIRMED, collect no money and are not travel tickets. Never use real personal information in this demo.

For the full platform, add user authentication and server-side operator authorization; operator_id checks on every protected query; dated trip schedules with departure cutoffs; passenger records; seat holds with expiration; verified payment webhooks and idempotency; cancellations and refunds. Do not expose this unauthenticated demo as a live reservation service. Payment confirmation must happen on the server before real tickets are issued.

## Verification in the authoring environment

The booking database test passed. Full frontend compilation and Express integration could not be verified because npm registry access was blocked. Run npm install, npm test and npm run build on your machine.
