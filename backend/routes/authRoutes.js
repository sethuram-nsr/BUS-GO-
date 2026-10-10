import { Router } from 'express';

/**
 * Creates authentication router for user registration and login.
 * @param {object} store
 * @returns {Router}
 */
export function createAuthRouter(store) {
  const router = Router();

  /**
   * POST /api/auth/signup
   * Registers a new user.
   */
  router.post('/signup', async (req, res, next) => {
    try {
      const { name, phone, email, password } = req.body ?? {};
      const user = await store.createUser({ name, phone, email, password });
      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        user,
      });
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /api/auth/login
   * Authenticates an existing user.
   */
  router.post('/login', async (req, res, next) => {
    try {
      const { phone, password } = req.body ?? {};
      const user = await store.loginUser({ phone, password });
      res.json({
        success: true,
        message: 'Logged in successfully.',
        user,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
