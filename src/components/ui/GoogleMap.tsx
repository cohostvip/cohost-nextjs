'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  lat: number;
  lng: number;
  venueName: string;
  address?: string;
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

export function GoogleMap({
  lat,
  lng,
  venueName,
  address,
  zoom = 15,
  className,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      delete window.initMap;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google?.maps) return;

    const position = { lat, lng };

    const map = new window.google.maps.Map(mapRef.current, {
      center: position,
      zoom,
      styles: [
        // Dark mode map style
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b9a76' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }],
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    const marker = new window.google.maps.Marker({
      position,
      map,
      title: venueName,
    });

    const infoContent = `
      <div style="color: #1a1a1a; padding: 8px; max-width: 200px;">
        <strong style="font-size: 14px;">${venueName}</strong>
        ${address ? `<p style="margin: 4px 0 0; font-size: 12px; color: #666;">${address}</p>` : ''}
      </div>
    `;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoContent,
    });

    // Open info window by default
    infoWindow.open(map, marker);

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }, [mapLoaded, lat, lng, venueName, address, zoom]);

  // Don't render anything if no API key or there's an error
  if (!hasApiKey || error) {
    return null;
  }

  return (
    <div className={`overflow-hidden rounded-lg ${className || ''}`}>
      <div
        ref={mapRef}
        className="h-[300px] w-full bg-surface"
        style={{ minHeight: '300px' }}
      />
      {address && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-accent hover:underline"
        >
          Open in Google Maps
        </a>
      )}
    </div>
  );
}
