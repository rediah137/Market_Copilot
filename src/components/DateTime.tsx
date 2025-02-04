import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Globe } from 'lucide-react';

const timeZones = [
  { value: 'Asia/Kolkata', label: 'IST (India)' },
  { value: 'America/New_York', label: 'EST (New York)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'Asia/Singapore', label: 'SGT (Singapore)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
];

export const DateTime = () => {
  const [date, setDate] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState('Asia/Kolkata');
  const [showZones, setShowZones] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatInTimeZone = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="font-medium">
          {date.toLocaleDateString('en-US', {
            timeZone: selectedZone,
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className="relative flex items-center space-x-2 group">
        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="font-medium tabular-nums">
          {formatInTimeZone(date, selectedZone)}
        </span>
        <button
          onClick={() => setShowZones(!showZones)}
          className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Select timezone"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {timeZones.find(z => z.value === selectedZone)?.label.split(' ')[0]}
          </span>
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {showZones && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 top-full">
            {timeZones.map((zone) => (
              <button
                key={zone.value}
                onClick={() => {
                  setSelectedZone(zone.value);
                  setShowZones(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedZone === zone.value ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};