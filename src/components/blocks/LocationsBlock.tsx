import type { ContentBlock } from '@cohostvip/cohost-node';

interface LocationsBlockProps {
  block: ContentBlock;
}

export function LocationsBlock({ block }: LocationsBlockProps) {
  const data = block.data as {
    locations?: Array<{
      name: string;
      address?: string;
      logo?: { url: string };
      description?: string;
      order: number;
    }>;
    layout?: 'list' | 'grid' | 'map';
  };

  if (!data.locations || data.locations.length === 0) {
    return null;
  }

  const sortedLocations = [...data.locations].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {block.title && <h2 className="text-xl font-bold text-text">{block.title}</h2>}
      <div className="space-y-4">
        {sortedLocations.map((location, index) => (
          <div
            key={index}
            className="flex gap-4 items-start p-4 bg-surface rounded-lg border border-surface-elevated"
          >
            {location.logo?.url && (
              <img
                src={location.logo.url}
                alt={location.name}
                className="h-16 w-16 object-cover rounded shrink-0"
              />
            )}
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-base text-text">{location.name}</h3>
              {location.address && (
                <p className="text-sm text-text-muted">{location.address}</p>
              )}
              {location.description && (
                <p className="text-sm text-text-muted">{location.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
