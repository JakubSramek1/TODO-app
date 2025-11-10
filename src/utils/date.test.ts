import {formatDate, getFormattedCurrentDate} from './date';

describe('date utils', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats provided date with default locale', () => {
    const date = new Date('2023-11-20T00:00:00Z');
    const result = formatDate(date);

    expect(result).toBe('20. listopadu 2023');
  });

  it('formats provided date with custom locale', () => {
    const date = new Date('2023-11-20T00:00:00Z');
    const result = formatDate(date, {locale: 'en-US'});

    expect(result).toBe('November 20, 2023');
  });

  it('formats current date', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-11-20T12:34:56Z'));

    const result = getFormattedCurrentDate();

    expect(result).toBe('20. listopadu 2023');
  });
});
