"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, BookOpen, Target, Plus, Trash2, User, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useSavedWork } from '@/hooks/useSavedWork';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import type { Json } from '@/integrations/supabase/types';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  completed: boolean;
}

interface StudyPlannerData {
  sessions: StudySession[];
}

const STORAGE_KEY = 'study-planner-sessions';

const StudyPlanner = () => {
  const { user } = useAuth();
  const { savedWorks, saveWork, updateWork, loading } = useSavedWork('study-planner');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [newSession, setNewSession] = useState<{
    subject: string;
    topic: string;
    duration: number;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
  }>({
    subject: '',
    topic: '',
    duration: 60,
    priority: 'medium',
    deadline: ''
  });

  // Load sessions on component mount
  useEffect(() => {
    if (user && !loading) {
      // Load from database for logged-in users
      if (savedWorks.length > 0) {
        const latestWork = savedWorks[0];
        if (latestWork.content && typeof latestWork.content === 'object' && 
            'sessions' in latestWork.content && 
            Array.isArray((latestWork.content as unknown as StudyPlannerData).sessions)) {
          setSessions((latestWork.content as unknown as StudyPlannerData).sessions);
        }
      }
    } else if (!user) {
      // Load from localStorage for non-logged-in users
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSessions = JSON.parse(stored);
          if (Array.isArray(parsedSessions)) {
            setSessions(parsedSessions);
          }
        }
      } catch (error) {
        console.error('Error loading sessions from localStorage:', error);
      }
    }
  }, [user, savedWorks, loading]);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length === 0) return; // Don't save empty initial state

    if (user) {
      // Save to database for logged-in users
      const saveData = async () => {
        try {
          if (savedWorks.length > 0) {
            await updateWork(savedWorks[0].id, 'Study Planner Sessions', { sessions } as unknown as Json);
          } else {
            await saveWork('Study Planner Sessions', { sessions } as unknown as Json);
          }
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      };
      saveData();
    } else {
      // Save to localStorage for non-logged-in users
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [sessions, user, savedWorks, saveWork, updateWork]);

  const addSession = () => {
    if (!newSession.subject.trim() || !newSession.topic.trim()) {
      toast.error('Please fill in subject and topic');
      return;
    }

    const session: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newSession.subject,
      topic: newSession.topic,
      duration: newSession.duration,
      priority: newSession.priority,
      deadline: newSession.deadline || undefined,
      completed: false
    };

    setSessions(prev => [...prev, session]);
    setNewSession({
      subject: '',
      topic: '',
      duration: 60,
      priority: 'medium',
      deadline: ''
    });
    toast.success('Study session added!');
  };

  const toggleComplete = (id: string) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    toast.success('Session deleted');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Smart Study Planner</h2>
        <p className="text-muted-foreground">
          Organize your study sessions, set priorities, and track your progress
        </p>
      </div>

      {/* Save Status Message */}
      {!user && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your study sessions are saved locally on this device. 
                  <Link href="/auth" className="font-medium underline ml-1">
                    Sign up for free
                  </Link> to save your progress across all devices and never lose your planner!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your study sessions are automatically saved to your account and synced across all devices!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Study Planner
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Progress Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Study Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    value={newSession.subject}
                    onChange={(e) => setNewSession(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Calculus Integration"
                    value={newSession.topic}
                    onChange={(e) => setNewSession(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="300"
                    value={newSession.duration}
                    onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newSession.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewSession(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newSession.deadline}
                    onChange={(e) => setNewSession(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={addSession} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Study Session
              </Button>
            </CardContent>
          </Card>

          {sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Study Sessions ({sessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className={`border rounded-lg p-4 space-y-3 ${session.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={session.completed}
                            onChange={() => toggleComplete(session.id)}
                            className="w-4 h-4"
                          />
                          <div>
                            <h3 className={`font-medium ${session.completed ? 'line-through' : ''}`}>
                              {session.subject}: {session.topic}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {session.duration} minutes
                              {session.deadline && (
                                <>
                                  <CalendarDays className="h-3 w-3 ml-2" />
                                  Due: {new Date(session.deadline).toLocaleDateString()}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(session.priority)}>
                            {session.priority}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {sessions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Study Sessions Yet</h3>
                <p className="text-muted-foreground">
                  Add your first study session to get started with organized learning.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Study Progress Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">Total Sessions</h4>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{sessions.length}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300">Completed</h4>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {sessions.filter(s => s.completed).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-700 dark:text-orange-300">Total Hours</h4>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60 * 10) / 10}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Progress Rate</h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(sessions.filter(s => s.completed).length / sessions.length) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100)}% completed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Data Yet</h3>
                  <p className="text-muted-foreground">
                    Add some study sessions to see your progress analytics.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyPlanner;
