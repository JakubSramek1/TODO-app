export type GetFormattedDateOptions = {
  locale?: string;
};

const DEFAULT_LOCALE = 'cs-CZ';

export const formatDate = (date: Date, {locale = DEFAULT_LOCALE}: GetFormattedDateOptions = {}) => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getFormattedCurrentDate = (options?: GetFormattedDateOptions) =>
  formatDate(new Date(), options);
