import { AddToCalendar } from './AddToCalendar';

interface ResolvedContext {
  title: string;
  start: string;
  end?: string;
  location?: {
    name?: string;
    address?: {
      formattedAddress?: string;
      address_1?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      country?: string;
    } | null;
    timezone?: string;
  };
  logo?: {
    url?: string;
  };
}

interface EventInfoCardProps {
  context: ResolvedContext;
  hideImage?: boolean;
}

function formatEventDateTime(start: string, end?: string, timezone?: string): string {
  const startDate = new Date(start);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });

  const formattedDate = dateFormatter.format(startDate);
  const formattedStartTime = timeFormatter.format(startDate);

  if (end) {
    const endDate = new Date(end);
    const formattedEndTime = timeFormatter.format(endDate);
    return `${formattedDate} at ${formattedStartTime} - ${formattedEndTime}`;
  }

  return `${formattedDate} at ${formattedStartTime}`;
}

function formatAddress(
  address:
    | {
        formattedAddress?: string;
        address_1?: string;
        city?: string;
        region?: string;
        postal_code?: string;
        country?: string;
      }
    | null
    | undefined
): string | null {
  if (!address) return null;

  if (address.formattedAddress) {
    return address.formattedAddress;
  }

  const parts = [address.address_1, address.city, address.region, address.postal_code].filter(
    Boolean
  );

  return parts.length > 0 ? parts.join(', ') : null;
}

export function EventInfoCard({ context, hideImage }: EventInfoCardProps) {
  const formattedAddress = formatAddress(context.location?.address);
  const locationString = [context.location?.name, formattedAddress].filter(Boolean).join(', ');

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex gap-4">
        {!hideImage && context.logo?.url && (
          <div className="flex-shrink-0">
            <img
              src={context.logo.url}
              alt={context.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text truncate">{context.title}</h3>

          <p className="text-sm text-text-muted mt-1">
            {formatEventDateTime(context.start, context.end, context.location?.timezone)}
          </p>

          {context.location?.name && (
            <p className="text-sm text-text-muted mt-1">{context.location.name}</p>
          )}

          {formattedAddress && (
            <p className="text-sm text-text-subtle mt-0.5">{formattedAddress}</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <AddToCalendar
          event={{
            title: context.title,
            start: context.start,
            end: context.end,
            location: locationString || undefined,
          }}
        />
      </div>
    </div>
  );
}
