import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats a number as USD', () => {
    expect(formatCurrency(19.9)).toBe('$19.90');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
