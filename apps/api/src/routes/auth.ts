import { Router } from 'express';
import { findUserByEmail } from '../data/users';
import { HttpError } from '../middleware/errorHandler';

export const authRouter = Router();

/**
 * Mock login: matches an email against the seeded user directory. There is
 * no password verification, hashing, or session/token issuance - this
 * endpoint exists to demonstrate "current user" as a real cross-MFE shared
 * state value (see @nisum-mfe/state authSlice), not to be a real auth
 * system. See README "Architecture Decisions" for the trade-off.
 */
authRouter.post('/login', (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== 'string' || !email) {
    throw new HttpError(400, 'invalid_request', 'Field "email" is required.');
  }
  const user = findUserByEmail(email);
  if (!user) {
    throw new HttpError(401, 'invalid_credentials', 'No account found for that email.');
  }
  res.json(user);
});
