"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Copy, 
  RefreshCw 
} from 'lucide-react';

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState('');
  const [humanDate, setHumanDate] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [timezone, setTimezone] = useState('UTC');
  const [format, setFormat] = useState('iso');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ];

  const formats = [
    { value: 'iso', label: 'ISO 8601', example: '2024-01-15T14:30:00Z' },
    { value: 'locale', label: 'Locale String', example: '1/15/2024, 2:30:00 PM' },
    { value: 'date-only', label: 'Date Only', example: '2024-01-15' },
    { value: 'time-only', label: 'Time Only', example: '14:30:00' },
    { value: 'custom', label: 'Custom Format', example: 'Mon, Jan 15, 2024' }
  ];

  const convertTimestampToDate = (ts: string) => {
    if (!ts) return '';
    
    try {
      let timestamp = parseInt(ts);
      
      // Handle both seconds and milliseconds
      if (timestamp.toString().length === 10) {
        timestamp *= 1000;
      }
      
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        return 'Invalid timestamp';
      }
      
      // Convert to specified timezone
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone === 'UTC' ? 'UTC' : timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      
      switch (format) {
        case 'iso':
          return timezone === 'UTC' ? date.toISOString() : date.toLocaleString('sv-SE', options);
        case 'locale':
          return date.toLocaleString('en-US', options);
        case 'date-only':
          return date.toLocaleDateString('en-CA', { ...options, hour: undefined, minute: undefined, second: undefined });
        case 'time-only':
          return date.toLocaleTimeString('en-GB', { ...options, year: undefined, month: undefined, day: undefined });
        case 'custom':
          return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: timezone === 'UTC' ? 'UTC' : timezone
          });
        default:
          return date.toLocaleString('en-US', options);
      }
    } catch {
      return 'Invalid timestamp';
    }
  };

  const convertDateToTimestamp = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return Math.floor(date.getTime() / 1000).toString();
    } catch {
      return 'Invalid date';
    }
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setCurrentTimestamp(now);
    setTimestamp(now.toString());
  };

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      console.error('Failed to copy to clipboard:');
    }
  };

  const insertSampleTimestamp = () => {
    const samples = [
      Math.floor(Date.now() / 1000), // Current timestamp
      1609459200, // 2021-01-01 00:00:00 UTC
      1672531200, // 2023-01-01 00:00:00 UTC
      1640995200, // 2022-01-01 00:00:00 UTC
      1577836800  // 2020-01-01 00:00:00 UTC
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setTimestamp(randomSample.toString());
  };

  const insertSampleDate = () => {
    const samples = [
      new Date().toISOString(),
      '2024-01-01T00:00:00Z',
      '2023-12-25T12:00:00Z',
      '2024-07-04T16:30:00Z',
      '2024-03-21T09:15:00Z'
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setHumanDate(randomSample);
  };

  const getTimezoneOffset = () => {
    if (timezone === 'UTC') return 'UTC+0';
    
    try {
      const now = new Date();
      const offset = now.toLocaleString('en', { timeZone: timezone, timeZoneName: 'short' }).split(' ').pop();
      return offset || timezone;
    } catch {
      return timezone;
    }
  };

  useEffect(() => {
    getCurrentTimestamp();
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timestamp Converter
          </CardTitle>
          <Separator />
        </CardHeader>
      </Card>

      {/* Current Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Unix Timestamp</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={currentTimestamp} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(currentTimestamp.toString(), 'Current timestamp')}
                >
                  {copiedField === 'Current timestamp' ? (
                    <Clock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Current Date & Time</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={new Date().toISOString()} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(new Date().toISOString(), 'Current date')}
                >
                  {copiedField === 'Current date' ? (
                    <Clock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timezone</CardTitle>
          </CardHeader>
          <CardContent>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <div className="mt-2 text-sm text-muted-foreground">
              Current offset: {getTimezoneOffset()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Date Format</CardTitle>
          </CardHeader>
          <CardContent>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              {formats.map(fmt => (
                <option key={fmt.value} value={fmt.value}>
                  {fmt.label}
                </option>
              ))}
            </select>
            <div className="mt-2 text-sm text-muted-foreground">
              Example: {formats.find(f => f.value === format)?.example}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Timestamp → Date</CardTitle>
              <Button variant="ghost" size="sm" onClick={insertSampleTimestamp}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sample
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unix Timestamp (seconds or milliseconds)</Label>
              <Input 
                type="number"
                placeholder="1609459200"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="font-mono"
              />
              <div className="text-xs text-muted-foreground">
                Enter timestamp in seconds (10 digits) or milliseconds (13 digits)
              </div>
            </div>
            
            <Separator className="mx-auto" />
            
            <div className="space-y-2">
              <Label>Converted Date</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={convertTimestampToDate(timestamp)}
                  readOnly
                  className="font-mono"
                  placeholder="Converted date will appear here"
                />
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(convertTimestampToDate(timestamp), 'Converted date')}
                  disabled={!convertTimestampToDate(timestamp) || convertTimestampToDate(timestamp).includes('Invalid')}
                >
                  {copiedField === 'Converted date' ? (
                    <Clock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date to Timestamp */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Date → Timestamp</CardTitle>
              <Button variant="ghost" size="sm" onClick={insertSampleDate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sample
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Input 
                type="datetime-local"
                value={humanDate}
                onChange={(e) => setHumanDate(e.target.value)}
                className="font-mono"
              />
              <div className="text-xs text-muted-foreground">
                Or paste any valid date string (ISO 8601, etc.)
              </div>
            </div>
            
            <Separator className="mx-auto" />
            
            <div className="space-y-2">
              <Label>Unix Timestamp</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={convertDateToTimestamp(humanDate)}
                  readOnly
                  className="font-mono"
                  placeholder="Unix timestamp will appear here"
                />
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(convertDateToTimestamp(humanDate), 'Converted timestamp')}
                  disabled={!convertDateToTimestamp(humanDate) || convertDateToTimestamp(humanDate).includes('Invalid')}
                >
                  {copiedField === 'Converted timestamp' ? (
                    <Clock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">Unix Timestamp</Badge>
              <div className="text-sm text-muted-foreground">
                Seconds since January 1, 1970 UTC. Standard for most systems and databases.
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">Milliseconds</Badge>
              <div className="text-sm text-muted-foreground">
                JavaScript uses milliseconds. Multiply Unix timestamp by 1000.
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">ISO 8601</Badge>
              <div className="text-sm text-muted-foreground">
                International standard date format. Used in JSON and web APIs.
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">Timezones</Badge>
              <div className="text-sm text-muted-foreground">
                Always consider timezone when converting. UTC is recommended for storage.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Professional Timestamp Converter Tool
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Convert between Unix timestamps and human-readable dates with full timezone support and multiple date formats. 
            Essential tool for developers, system administrators, and data analysts working with time-based data.
          </p>
          <p>
            <strong>Perfect for:</strong> Database queries, API development, log analysis, debugging time-related issues, 
            scheduling tasks, and converting timestamps between different systems and timezones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimestampConverter;
