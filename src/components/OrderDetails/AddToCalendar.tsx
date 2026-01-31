'use client';

import { useState, useRef, useEffect } from 'react';

interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  location?: string;
  description?: string;
}

interface AddToCalendarProps {
  event: CalendarEvent;
}

function formatDateForGoogle(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function formatDateForICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    ...(event.location && { location: event.location }),
    ...(event.description && { details: event.description }),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateOutlookUrl(event: CalendarEvent): string {
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    ...(event.location && { location: event.location }),
    ...(event.description && { body: event.description }),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function generateYahooCalendarUrl(event: CalendarEvent): string {
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  const hours = Math.floor(duration / 60).toString().padStart(2, '0');
  const minutes = (duration % 60).toString().padStart(2, '0');

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatDateForGoogle(startDate),
    dur: `${hours}${minutes}`,
    ...(event.location && { in_loc: event.location }),
    ...(event.description && { desc: event.description }),
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

function generateICSContent(event: CalendarEvent): string {
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const now = new Date();

  const escapeICS = (text: string) => text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cohost//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForICS(startDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `DTSTAMP:${formatDateForICS(now)}`,
    `UID:${Date.now()}@cohost.vip`,
    `SUMMARY:${escapeICS(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeICS(event.location)}`] : []),
    ...(event.description ? [`DESCRIPTION:${escapeICS(event.description)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

function downloadICS(event: CalendarEvent) {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const CALENDAR_OPTIONS = [
  { id: 'google', label: 'Google Calendar', icon: GoogleIcon },
  { id: 'apple', label: 'Apple Calendar', icon: AppleIcon },
  { id: 'outlook', label: 'Outlook', icon: OutlookIcon },
  { id: 'yahoo', label: 'Yahoo Calendar', icon: YahooIcon },
] as const;

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15a2.5 2.5 0 01-2.5 2.5zM9.047 7.133v2.326H5.85v1.46h3.197v2.328h1.64v-2.328h3.197v-1.46h-3.197V7.133h-1.64zm8.063 6.75H6.89v1.64h10.22v-1.64z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
    </svg>
  );
}

function YahooIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 11.9l4-7.4c.2-.3.1-.7-.2-.9l-1.8-1c-.3-.2-.7-.1-.9.2l-2.9 5.4-2.9-5.4c-.2-.3-.6-.4-.9-.2l-1.8 1c-.3.2-.4.6-.2.9l4 7.4v5.6c0 .4.3.7.7.7h2.2c.4 0 .7-.3.7-.7v-5.6z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (calendarId: string) => {
    switch (calendarId) {
      case 'google':
        window.open(generateGoogleCalendarUrl(event), '_blank');
        break;
      case 'apple':
        downloadICS(event);
        break;
      case 'outlook':
        window.open(generateOutlookUrl(event), '_blank');
        break;
      case 'yahoo':
        window.open(generateYahooCalendarUrl(event), '_blank');
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-surface text-text hover:bg-surface-hover transition-colors"
      >
        <CalendarIcon />
        Add to Calendar
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface shadow-lg z-10">
          <div className="py-1">
            {CALENDAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
              >
                <option.icon />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
