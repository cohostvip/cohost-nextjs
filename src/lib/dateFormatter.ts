/**
 * Date Formatter Utility
 *
 * Formats dates with timezone support and various display options.
 */

export type DateInput = Date | string;

export interface DateFormatOptions {
  /** Intl.DateTimeFormat options */
  format?: Intl.DateTimeFormatOptions;
  /** Remove :00 from time display (e.g., "7:00 PM" -> "7 PM") */
  removeZeroMinutes?: boolean;
  /** Locale for formatting (default: 'en-US') */
  locale?: string;
}

export interface RelativeDateOptions extends DateFormatOptions {
  /** Show relative date within this many days (e.g., "tomorrow", "in 3 days") */
  relativeDays?: number;
  /** Reference date for relative calculations (default: now) */
  referenceDate?: Date;
}

export interface DateRangeOptions extends DateFormatOptions {
  /** End date for range display */
  end: DateInput;
  /** Show time in range */
  showTime?: boolean;
}

const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Parses a date input into a Date object
 */
function parseDate(input: DateInput): Date | null {
  if (!input) return null;

  try {
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Removes :00 minutes from time string
 */
function removeZeroMinutes(timeStr: string): string {
  return timeStr.replace(/:00(\s*[AP]M)/i, '$1');
}

/**
 * Gets the timezone abbreviation (e.g., "EST", "PST")
 */
export function getTimezoneAbbr(date: Date, timezone: string, locale = 'en-US'): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(date);

    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || '';
  } catch {
    return '';
  }
}

/**
 * Formats a single date/time
 */
export function formatDate(
  input: DateInput,
  timezone = DEFAULT_TIMEZONE,
  options: DateFormatOptions = {}
): string | undefined {
  const date = parseDate(input);
  if (!date) return undefined;

  const { format, removeZeroMinutes: stripZeroMins, locale = 'en-US' } = options;

  try {
    const defaultFormat: Intl.DateTimeFormatOptions = {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    };

    let formatted = new Intl.DateTimeFormat(locale, format || defaultFormat).format(date);

    if (stripZeroMins) {
      formatted = removeZeroMinutes(formatted);
    }

    return formatted;
  } catch {
    return undefined;
  }
}

/**
 * Formats time only
 */
export function formatTime(
  input: DateInput,
  timezone = DEFAULT_TIMEZONE,
  options: DateFormatOptions = {}
): string | undefined {
  const date = parseDate(input);
  if (!date) return undefined;

  const { removeZeroMinutes: stripZeroMins, locale = 'en-US' } = options;

  try {
    let formatted = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
      ...options.format,
    }).format(date);

    if (stripZeroMins) {
      formatted = removeZeroMinutes(formatted);
    }

    return formatted;
  } catch {
    return undefined;
  }
}

/**
 * Calculates the difference in calendar days between two dates
 */
function getDaysDifference(date: Date, reference: Date, timezone: string): number {
  // Get the date parts in the target timezone
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone });
  const refStr = reference.toLocaleDateString('en-CA', { timeZone: timezone });

  const dateOnly = new Date(dateStr);
  const refOnly = new Date(refStr);

  return Math.round((dateOnly.getTime() - refOnly.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Formats a date with relative display option
 * e.g., "tomorrow at 7 PM", "in 3 days", "today at 5 PM"
 */
export function formatRelativeDate(
  input: DateInput,
  timezone = DEFAULT_TIMEZONE,
  options: RelativeDateOptions = {}
): string | undefined {
  const date = parseDate(input);
  if (!date) return undefined;

  const { relativeDays = 7, referenceDate = new Date(), locale = 'en-US', removeZeroMinutes: stripZeroMins } = options;
  const daysDiff = getDaysDifference(date, referenceDate, timezone);

  // If outside the relative range, return standard format
  if (Math.abs(daysDiff) > relativeDays) {
    return formatDate(input, timezone, options);
  }

  const timeStr = formatTime(input, timezone, { removeZeroMinutes: stripZeroMins, locale });

  if (daysDiff === 0) {
    return `Today at ${timeStr}`;
  } else if (daysDiff === 1) {
    return `Tomorrow at ${timeStr}`;
  } else if (daysDiff === -1) {
    return `Yesterday at ${timeStr}`;
  } else if (daysDiff > 1) {
    return `In ${daysDiff} days`;
  } else {
    return `${Math.abs(daysDiff)} days ago`;
  }
}

/**
 * Checks if two dates are on the same calendar day in a given timezone
 */
function isSameDay(date1: Date, date2: Date, timezone: string): boolean {
  const d1Str = date1.toLocaleDateString('en-CA', { timeZone: timezone });
  const d2Str = date2.toLocaleDateString('en-CA', { timeZone: timezone });
  return d1Str === d2Str;
}

/**
 * Checks if end date is within 24 hours of start date
 */
function isWithin24Hours(start: Date, end: Date): boolean {
  const diffMs = end.getTime() - start.getTime();
  const hours24 = 24 * 60 * 60 * 1000;
  return diffMs <= hours24;
}

/**
 * Formats a date range
 * - Same day or within 24 hours: "Sat, August 24 at 7PM – 10PM EDT" or "Wed, Dec 31 at 8PM – 2AM EST"
 * - Multi-day (over 24 hours): "Aug 24 at 7PM – Aug 26 at 10PM EDT"
 */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  timezone = DEFAULT_TIMEZONE,
  options: DateFormatOptions = {}
): string | undefined {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) return undefined;

  const { removeZeroMinutes: stripZeroMins, locale = 'en-US' } = options;
  const within24h = isWithin24Hours(startDate, endDate);

  try {
    if (within24h) {
      // Same day or overnight (within 24h): "Sat, August 24 at 7PM – 10PM EDT"
      const dayPart = new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      }).format(startDate);

      let startTime = formatTime(startDate, timezone, { removeZeroMinutes: stripZeroMins, locale }) || '';
      let endTime = formatTime(endDate, timezone, { removeZeroMinutes: stripZeroMins, locale }) || '';
      const tzAbbr = getTimezoneAbbr(startDate, timezone, locale);

      return `${dayPart} at ${startTime} – ${endTime} ${tzAbbr}`.trim();
    } else {
      // Multi-day event (over 24 hours): "Aug 24 at 7PM – Aug 26 at 10PM EDT"
      const startPart = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
      }).format(startDate);

      const endPart = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
      }).format(endDate);

      let startTime = formatTime(startDate, timezone, { removeZeroMinutes: stripZeroMins, locale }) || '';
      let endTime = formatTime(endDate, timezone, { removeZeroMinutes: stripZeroMins, locale }) || '';
      const tzAbbr = getTimezoneAbbr(endDate, timezone, locale);

      return `${startPart} at ${startTime} – ${endPart} at ${endTime} ${tzAbbr}`.trim();
    }
  } catch {
    return undefined;
  }
}

/**
 * Formats a date range in short format
 * - Within 24 hours: "8/24, 7PM-10PM" or "12/31, 8PM-2AM"
 * - Multi-day: "8/24-8/26"
 */
export function formatDateRangeShort(
  start: DateInput,
  end: DateInput,
  timezone = DEFAULT_TIMEZONE,
  options: DateFormatOptions = {}
): string | undefined {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) return undefined;

  const { removeZeroMinutes: stripZeroMins = true, locale = 'en-US' } = options;
  const within24h = isWithin24Hours(startDate, endDate);

  try {
    if (within24h) {
      // Within 24 hours: "8/24, 7PM-10PM" or "12/31, 8PM-2AM"
      const datePart = new Intl.DateTimeFormat(locale, {
        month: 'numeric',
        day: 'numeric',
        timeZone: timezone,
      }).format(startDate);

      let startTime = formatTime(startDate, timezone, {
        removeZeroMinutes: stripZeroMins,
        locale,
        format: { hour: 'numeric', minute: '2-digit' }
      }) || '';
      let endTime = formatTime(endDate, timezone, {
        removeZeroMinutes: stripZeroMins,
        locale,
        format: { hour: 'numeric', minute: '2-digit' }
      }) || '';

      // Remove spaces around AM/PM for compact display
      startTime = startTime.replace(/\s+/g, '');
      endTime = endTime.replace(/\s+/g, '');

      return `${datePart}, ${startTime}-${endTime}`;
    } else {
      // Multi-day: "8/24-8/26"
      const startPart = new Intl.DateTimeFormat(locale, {
        month: 'numeric',
        day: 'numeric',
        timeZone: timezone,
      }).format(startDate);

      const endPart = new Intl.DateTimeFormat(locale, {
        month: 'numeric',
        day: 'numeric',
        timeZone: timezone,
      }).format(endDate);

      return `${startPart}-${endPart}`;
    }
  } catch {
    return undefined;
  }
}
