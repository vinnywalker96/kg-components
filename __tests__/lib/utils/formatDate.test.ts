import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  test('formats date correctly with default options', () => {
    const date = new Date('2023-01-15T12:30:45');
    const formattedDate = formatDate(date);
    expect(formattedDate).toMatch(/Jan 15, 2023/);
  });

  test('formats date with time when includeTime is true', () => {
    const date = new Date('2023-01-15T12:30:45');
    const formattedDate = formatDate(date, { includeTime: true });
    expect(formattedDate).toMatch(/Jan 15, 2023/);
    expect(formattedDate).toMatch(/12:30/);
  });

  test('handles null or undefined date', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  test('formats date with custom locale', () => {
    const date = new Date('2023-01-15T12:30:45');
    const formattedDate = formatDate(date, { locale: 'fr-FR' });
    // Different locales will format differently, but should still contain the year
    expect(formattedDate).toContain('2023');
  });
});

