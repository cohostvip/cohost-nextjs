import { formatDateRange, formatDateRangeShort } from '@/lib/dateFormatter';

export interface EventDateDisplayProps {
  /** Event start date/time (ISO string or Date) */
  start: string | Date;
  /** Event end date/time (ISO string or Date) */
  end: string | Date;
  /** Timezone for display (default: America/New_York) */
  tz?: string;
  /** Display variant: 'full' shows complete date range, 'short' shows abbreviated */
  variant?: 'full' | 'short';
  /** Additional CSS classes */
  className?: string;
}

/**
 * EventDateDisplay Component
 *
 * Displays event date range with proper formatting.
 *
 * Full variant: "Sat, Aug 24 at 7 PM – 10 PM EDT"
 * Short variant: "8/24, 7PM-10PM"
 */
export function EventDateDisplay({
  start,
  end,
  tz = 'America/New_York',
  variant = 'full',
  className,
}: EventDateDisplayProps) {
  const formattedDate =
    variant === 'full'
      ? formatDateRange(start, end, tz, { removeZeroMinutes: true })
      : formatDateRangeShort(start, end, tz, { removeZeroMinutes: true });

  if (!formattedDate) {
    return null;
  }

  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
}
