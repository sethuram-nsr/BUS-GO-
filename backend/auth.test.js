import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from './db.js';

test('user authentication lifecycle: signup and login', async () => {
  const store = createStore(':memory:');
  try {
    // 1. Successful signup
    const user = await store.createUser({
      name: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya@example.com',
      password: 'securePassword123',
    });

    assert.ok(user.id);
    assert.equal(user.name, 'Priya Sharma');
    assert.equal(user.phone, '9876543210');
    assert.equal(user.email, 'priya@example.com');
    assert.equal(user.passwordHash, undefined); // Sensitive hash must not leak

    // 2. Duplicate phone throws 409 Conflict
    await assert.rejects(
      async () =>
        await store.createUser({
          name: 'Another User',
          phone: '9876543210',
          password: 'anotherPassword',
        }),
      (err) => err.status === 409
    );

    // 3. Short password throws 400 Bad Request
    await assert.rejects(
      async () =>
        await store.createUser({
          name: 'Test',
          phone: '9876543211',
          password: '123',
        }),
      (err) => err.status === 400
    );

    // 4. Invalid phone throws 400 Bad Request
    await assert.rejects(
      async () =>
        await store.createUser({
          name: 'Test',
          phone: '123',
          password: 'password123',
        }),
      (err) => err.status === 400
    );

    // 5. Successful login
    const loggedIn = await store.loginUser({
      phone: '9876543210',
      password: 'securePassword123',
    });
    assert.equal(loggedIn.id, user.id);
    assert.equal(loggedIn.name, 'Priya Sharma');

    // 6. Wrong password throws 401 Unauthorized
    await assert.rejects(
      async () =>
        await store.loginUser({
          phone: '9876543210',
          password: 'wrongPassword',
        }),
      (err) => err.status === 401
    );

    // 7. Nonexistent phone throws 401 Unauthorized
    await assert.rejects(
      async () =>
        await store.loginUser({
          phone: '9999999999',
          password: 'somePassword',
        }),
      (err) => err.status === 401
    );
  } finally {
    await store.close();
  }
});
