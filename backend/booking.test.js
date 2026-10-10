import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from './db.js';
import { isValidTravelDate, getTodayString } from './utils/date.js';
import { isValidEmail, isValidPassengerName } from './utils/validation.js';

test('booking inventory is atomic, date-specific, and priced on server', async () => {
  const s = createStore(':memory:');
  try {
    const input = {
      tripId: 1,
      date: '2099-01-01',
      seats: [1],
      passenger: 'Test User',
      email: 'test@example.com',
      total: 1, // Client total should be ignored in favor of server calculation
    };

    // 1. Initial valid booking is priced by server (₹650)
    const booking1 = await s.book(input);
    assert.equal(booking1.total, 650);

    // 2. Double booking on same seat and date throws 409 Conflict
    await assert.rejects(
      async () => await s.book({ ...input, seats: [2, 1] }),
      (e) => e.status === 409
    );

    // 3. Only the original seat is reserved
    const booked = await s.bookedSeats(1, input.date);
    assert.deepEqual(booked, [1]);

    // 4. Same seat on a different date is allowed
    const booking2 = await s.book({ ...input, date: '2099-01-02' });
    assert.equal(booking2.total, 650);

    // 5. Exceeding coach capacity throws 400 Bad Request
    await assert.rejects(
      async () => await s.book({ ...input, seats: [25] }),
      (e) => e.status === 400
    );

    // 6. Duplicate seat in same request throws 400 Bad Request
    await assert.rejects(
      async () => await s.book({ ...input, seats: [3, 3] }),
      (e) => e.status === 400
    );
  } finally {
    await s.close();
  }
});

test('seat selection limits and pricing calculations', async () => {
  const store = createStore(':memory:');
  try {
    const trip = await store.getTripById(1);
    assert.ok(trip);

    // Booking 3 seats calculates 3 * fare
    const result = await store.book({
      tripId: 1,
      date: '2099-05-10',
      seats: [5, 6, 7],
      passenger: 'Ramesh',
      email: 'ramesh@example.com',
    });

    assert.equal(result.total, 3 * trip.fare);
    assert.deepEqual(result.seats, [5, 6, 7]);

    // Booking > 6 seats throws 400
    await assert.rejects(
      async () =>
        await store.book({
          tripId: 1,
          date: '2099-05-10',
          seats: [8, 9, 10, 11, 12, 13, 14],
          passenger: 'Ramesh',
          email: 'ramesh@example.com',
        }),
      (e) => e.status === 400
    );

    // Empty seat selection throws 400
    await assert.rejects(
      async () =>
        await store.book({
          tripId: 1,
          date: '2099-05-10',
          seats: [],
          passenger: 'Ramesh',
          email: 'ramesh@example.com',
        }),
      (e) => e.status === 400
    );
  } finally {
    await store.close();
  }
});

test('date and input validation utilities', () => {
  const today = getTodayString();
  assert.equal(isValidTravelDate(today), true);
  assert.equal(isValidTravelDate('2099-12-31'), true);
  assert.equal(isValidTravelDate('2020-01-01'), false);
  assert.equal(isValidTravelDate('not-a-date'), false);
  assert.equal(isValidTravelDate(''), false);

  assert.equal(isValidEmail('user@test.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isValidEmail(''), false);

  assert.equal(isValidPassengerName('Anand Kumar'), true);
  assert.equal(isValidPassengerName('A'), false);
  assert.equal(isValidPassengerName(''), false);
});
