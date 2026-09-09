import type { User } from '@nisum-mfe/shared-types';

/**
 * Mock user directory for the training project's login flow. There is no
 * password hashing / session management here on purpose - real auth is out
 * of scope for this assignment (see README "Architecture Decisions"). Any
 * password is accepted as long as the email matches a seeded user.
 */
export const users: User[] = [
  { id: 'u1', name: 'Ava Chen', email: 'ava@example.com' },
  { id: 'u2', name: 'Marcus Diallo', email: 'marcus@example.com' },
];

export function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
