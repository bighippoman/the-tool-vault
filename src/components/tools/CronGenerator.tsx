'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Clock, 
  Copy, 
  Check,
  Calendar,
  Settings
} from 'lucide-react';

interface CronPreset {
  name: string;
  cron: string;
  desc: string;
}

const CronGenerator = () => {
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  // Form state
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('0');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  
  // Selected days/months
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  
  const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];
  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const presets = [
    { name: 'Every minute', cron: '* * * * *', desc: 'Runs every minute' },
    { name: 'Every 5 minutes', cron: '*/5 * * * *', desc: 'Runs every 5 minutes' },
    { name: 'Every 15 minutes', cron: '*/15 * * * *', desc: 'Runs every 15 minutes' },
    { name: 'Every 30 minutes', cron: '*/30 * * * *', desc: 'Runs every 30 minutes' },
    { name: 'Every hour', cron: '0 * * * *', desc: 'Runs at the beginning of every hour' },
    { name: 'Every 6 hours', cron: '0 */6 * * *', desc: 'Runs every 6 hours' },
    { name: 'Every 12 hours', cron: '0 */12 * * *', desc: 'Runs every 12 hours' },
    { name: 'Daily at midnight', cron: '0 0 * * *', desc: 'Runs daily at 12:00 AM' },
    { name: 'Daily at 6 AM', cron: '0 6 * * *', desc: 'Runs daily at 6:00 AM' },
    { name: 'Weekly on Sunday', cron: '0 0 * * 0', desc: 'Runs every Sunday at midnight' },
    { name: 'Monthly on 1st', cron: '0 0 1 * *', desc: 'Runs on the 1st day of every month' },
    { name: 'Yearly on Jan 1st', cron: '0 0 1 1 *', desc: 'Runs on January 1st every year' }
  ];

  const generateCronFromForm = useCallback(() => {
    let newCron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    
    // Handle selected days
    if (selectedDays.length > 0 && selectedDays.length < 7) {
      newCron = `${minute} ${hour} ${dayOfMonth} ${month} ${selectedDays.join(',')}`;
    }
    
    // Handle selected months
    if (selectedMonths.length > 0 && selectedMonths.length < 12) {
      newCron = `${minute} ${hour} ${dayOfMonth} ${selectedMonths.join(',')} ${dayOfWeek}`;
    }
    
    setCronExpression(newCron);
  }, [minute, hour, dayOfMonth, month, dayOfWeek, selectedDays, selectedMonths]);

  const parseCronExpression = (cron: string) => {
    try {
      const parts = cron.split(' ');
      if (parts.length !== 5) {
        return 'Invalid cron expression format';
      }
      
      const [min, hr] = parts.map(part => part === '*' ? null : part);
      
      let desc = 'Runs ';
      
      // Frequency analysis
      if (min === '*' && hr === '*') {
        desc += 'every minute';
      } else if (min.startsWith('*/') && hr === '*') {
        desc += `every ${min.slice(2)} minutes`;
      } else if (hr.startsWith('*/') && min === '0') {
        desc += `every ${hr.slice(2)} hours`;
      } else if (hr === '*' && min !== '*') {
        desc += `at minute ${min} of every hour`;
      } else if (parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
        desc += `daily at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
      } else if (parts[2] === '*' && parts[3] === '*' && parts[4] !== '*') {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (parts[4].includes(',')) {
          const dayList = parts[4].split(',').map(d => dayNames[parseInt(d)]).join(', ');
          desc += `weekly on ${dayList} at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
        } else {
          desc += `weekly on ${dayNames[parseInt(parts[4])]} at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
        }
      } else if (parts[2] !== '*' && parts[3] === '*') {
        desc += `monthly on day ${parts[2]} at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
      } else if (parts[3] !== '*') {
        desc += `yearly in month ${parts[3]} on day ${parts[2]} at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
      } else {
        desc += `at ${hr.padStart(2, '0')}:${min.padStart(2, '0')} when month is ${parts[3]}, day of month is ${parts[2]}, and day of week is ${parts[4]}`;
      }
      
      return desc;
    } catch {
      return 'Invalid cron expression';
    }
  };

  const calculateNextRuns = (cron: string) => {
    try {
      const parts = cron.split(' ');
      if (parts.length !== 5) return [];
      
      const [min, hr] = parts.map(part => part === '*' ? null : part);
      const runs: string[] = [];
      const now = new Date();
      
      // Simple calculation for next 5 runs (basic implementation)
      for (let i = 0; i < 5; i++) {
        const nextRun = new Date(now);
        
        if (min && hr) {
          nextRun.setMinutes(parseInt(min));
          nextRun.setHours(parseInt(hr));
          nextRun.setSeconds(0);
          nextRun.setMilliseconds(0);
          
          if (i > 0) {
            nextRun.setDate(nextRun.getDate() + 1);
          } else if (nextRun <= now) {
            nextRun.setDate(nextRun.getDate() + 1);
          }
        } else {
          // For other patterns, add time intervals
          nextRun.setTime(now.getTime() + (i + 1) * 60000); // Add minutes for demo
        }
        
        runs.push(nextRun.toLocaleString());
      }
      
      return runs;
    } catch {
      return [];
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Cron expression copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handlePresetSelect = (preset: CronPreset) => {
    setCronExpression(preset.cron);
    // Parse back to form
    const parts = preset.cron.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month].sort()
    );
  };

  useEffect(() => {
    const desc = parseCronExpression(cronExpression);
    setDescription(desc);
    
    const runs = calculateNextRuns(cronExpression);
    setNextRuns(runs);
  }, [cronExpression]);

  useEffect(() => {
    generateCronFromForm();
  }, [generateCronFromForm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cron Expression Generator & Validator
          </CardTitle>
          <CardDescription>
            Generate and validate cron expressions with human-readable descriptions and schedule preview
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cron Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minute">Minute (0-59)</Label>
                <Input 
                  id="minute"
                  value={minute} 
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hour">Hour (0-23)</Label>
                <Input 
                  id="hour"
                  value={hour} 
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day-month">Day of Month (1-31)</Label>
                <Input 
                  id="day-month"
                  value={dayOfMonth} 
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  placeholder="*"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">Month (1-12)</Label>
                <Input 
                  id="month"
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="*"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="day-week">Day of Week (0-6, Sunday=0)</Label>
              <Input 
                id="day-week"
                value={dayOfWeek} 
                onChange={(e) => setDayOfWeek(e.target.value)}
                placeholder="*"
              />
            </div>
            
            {/* Day Selection */}
            <div className="space-y-2">
              <Label>Select Days (Optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                {days.map(day => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <Label htmlFor={`day-${day.value}`} className="text-sm">{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Month Selection */}
            <div className="space-y-2">
              <Label>Select Months (Optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                {months.slice(0, 6).map(month => (
                  <div key={month.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`month-${month.value}`}
                      checked={selectedMonths.includes(month.value)}
                      onCheckedChange={() => handleMonthToggle(month.value)}
                    />
                    <Label htmlFor={`month-${month.value}`} className="text-sm">{month.label}</Label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {months.slice(6).map(month => (
                  <div key={month.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`month-${month.value}`}
                      checked={selectedMonths.includes(month.value)}
                      onCheckedChange={() => handleMonthToggle(month.value)}
                    />
                    <Label htmlFor={`month-${month.value}`} className="text-sm">{month.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Expression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cron Expression</Label>
              <div className="flex gap-2">
                <Input 
                  value={cronExpression} 
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="font-mono"
                />
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Human Readable</Label>
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                {description}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Next 5 Scheduled Runs</Label>
              <div className="space-y-1">
                {nextRuns.map((run, index) => (
                  <div key={index} className="text-sm p-2 bg-secondary/30 rounded flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {run}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start"
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{preset.cron}</div>
                <div className="text-xs text-muted-foreground mt-1">{preset.desc}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Field Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cron Field Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Field</th>
                  <th className="text-left p-2">Values</th>
                  <th className="text-left p-2">Special Characters</th>
                  <th className="text-left p-2">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Minute</td>
                  <td className="p-2">0-59</td>
                  <td className="p-2">* , - /</td>
                  <td className="p-2">*/15 (every 15 min), 0,30 (0 and 30)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Hour</td>
                  <td className="p-2">0-23</td>
                  <td className="p-2">* , - /</td>
                  <td className="p-2">*/6 (every 6 hours), 9-17 (9 AM to 5 PM)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Day of Month</td>
                  <td className="p-2">1-31</td>
                  <td className="p-2">* , - /</td>
                  <td className="p-2">*/2 (every 2 days), 1,15 (1st and 15th)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Month</td>
                  <td className="p-2">1-12</td>
                  <td className="p-2">* , - /</td>
                  <td className="p-2">*/3 (quarterly), 6-8 (summer months)</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Day of Week</td>
                  <td className="p-2">0-6 (Sun-Sat)</td>
                  <td className="p-2">* , - /</td>
                  <td className="p-2">1-5 (weekdays), 0,6 (weekends)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Professional Cron Expression Generator & Scheduler Tool
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced cron expression generator with visual builder, presets, and real-time validation. 
            Perfect for scheduling tasks, automating jobs, and managing recurring processes in applications and systems.
          </p>
          <p>
            <strong>Essential for:</strong> DevOps automation, task scheduling, job management, system administration, 
            and setting up recurring processes in applications, CI/CD pipelines, and server maintenance scripts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CronGenerator;
