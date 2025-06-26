"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Lightbulb,
  Loader2,
  Volume2,
  Shuffle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WordData {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  etymology: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  alreadyKnew: boolean;
  learned: boolean;
  timestamp: number;
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-purple-100 text-purple-800' },
  { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
];

const CATEGORY_OPTIONS = [
  { value: 'everyday', label: 'Everyday Life' },
  { value: 'business', label: 'Business & Finance' },
  { value: 'medical', label: 'Medical & Health' },
  { value: 'technology', label: 'Technology' },
  { value: 'academic', label: 'Academic' },
  { value: 'science', label: 'Science' },
  { value: 'literature', label: 'Literature & Arts' }
];

// Generate a persistent session ID that survives page refreshes
const getOrCreateSessionId = () => {
  // Check if we're in the browser (not SSR)
  if (typeof window === 'undefined') {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  const storageKey = 'vocabulary-builder-session-id';
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

const VocabularyBuilder = () => {
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [encounteredWords, setEncounteredWords] = useState<WordData[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('intermediate');
  const [selectedCategory, setSelectedCategory] = useState<string>('everyday');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [sessionId] = useState(getOrCreateSessionId);

  const generateNewWord = useCallback(async () => {
    setIsGenerating(true);
    setShowDefinition(false);
    
    try {
      console.log(`Generating word for session: ${sessionId}`);
      
      const { data, error } = await supabase.functions.invoke('generate-vocabulary', {
        body: { 
          userLevel: selectedDifficulty,
          category: selectedCategory,
          sessionId: sessionId
        }
      });

      if (data && !error) {
        const generatedWord = data as WordData;
        setCurrentWord(generatedWord);
        setIsGenerating(false);
        return;
      }
    } catch (error) {
      console.error(`Error generating word:`, error);
      toast.error('Failed to generate new word. Please try again.');
      setIsGenerating(false);
    }
  }, [selectedDifficulty, selectedCategory, sessionId]);

  const handleAlreadyKnow = () => {
    if (!currentWord) return;
    
    const updatedWord = {
      ...currentWord,
      alreadyKnew: true,
      learned: false
    };
    
    setEncounteredWords(prev => [...prev, updatedWord]);
    
    toast.success('Great! You already know this word! ');
    generateNewWord();
  };

  const handleWantToLearn = () => {
    if (!currentWord) return;
    setShowDefinition(true);
  };

  const handleLearned = () => {
    if (!currentWord) return;
    
    const updatedWord = {
      ...currentWord,
      alreadyKnew: false,
      learned: true
    };
    
    setEncounteredWords(prev => [...prev, updatedWord]);
    
    toast.success('Awesome! You learned a new word! ');
    generateNewWord();
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Wrapper function for event handlers
  const handleGenerateNewWord = () => {
    generateNewWord();
  };

  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  const wordsAlreadyKnew = encounteredWords.filter(w => w.alreadyKnew).length;
  const wordsLearned = encounteredWords.filter(w => w.learned).length;
  const totalProgress = wordsAlreadyKnew + wordsLearned;
  const learningStreak = wordsLearned;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Smart Vocabulary Builder</h1>
        <p className="text-muted-foreground">
          Discover and learn new words at your own pace
        </p>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <Lightbulb className="h-3 w-3 mr-1" />
          AI-Powered Learning
        </Badge>
      </div>

      {/* Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge className={level.color} variant="secondary">
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalProgress}</div>
            <div className="text-sm text-muted-foreground">Words Encountered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">{wordsAlreadyKnew}</div>
            <div className="text-sm text-muted-foreground">Already Knew</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{wordsLearned}</div>
            <div className="text-sm text-muted-foreground">New Words Learned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{learningStreak}</div>
            <div className="text-sm text-muted-foreground">Learning Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Encouraging Progress Message */}
      {totalProgress > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Great progress! You&apos;ve encountered {totalProgress} words today.
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {wordsLearned > 0 && `You learned ${wordsLearned} new word${wordsLearned > 1 ? 's' : ''}! `}
                  {wordsAlreadyKnew > 0 && `You already knew ${wordsAlreadyKnew} word${wordsAlreadyKnew > 1 ? 's' : ''}! `}
                  Keep up the excellent work! 
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Learning Card */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Lightbulb className="h-5 w-5" />
            {isGenerating ? 'Finding a word for you...' : 'Do you know this word?'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isGenerating ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Finding the perfect word for you...</p>
            </div>
          ) : currentWord ? (
            <div className="space-y-6">
              {/* Word Display */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h2 className="text-4xl font-bold">{currentWord.word}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => playPronunciation(currentWord.word)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                {currentWord.pronunciation && (
                  <p className="text-lg text-muted-foreground">{currentWord.pronunciation}</p>
                )}
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="outline">
                    {DIFFICULTY_OPTIONS.find(d => d.value === currentWord.difficulty)?.label}
                  </Badge>
                  <Badge variant="outline">{currentWord.category}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              {!showDefinition ? (
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleAlreadyKnow}
                    size="lg"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Lightbulb className="h-4 w-4" />
                    I Know This!
                  </Button>
                  <Button 
                    onClick={handleWantToLearn}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Teach Me!
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Definition and Details */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Definition
                    </h3>
                    <p className="text-lg">{currentWord.definition}</p>
                  </div>

                  {currentWord.examples.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Examples</h3>
                      <ul className="space-y-2">
                        {currentWord.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(currentWord.synonyms.length > 0 || currentWord.antonyms.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentWord.synonyms.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Similar Words</h3>
                          <div className="flex flex-wrap gap-1">
                            {currentWord.synonyms.map((synonym, index) => (
                              <Badge key={index} variant="secondary">{synonym}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {currentWord.antonyms.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2">Opposite Words</h3>
                          <div className="flex flex-wrap gap-1">
                            {currentWord.antonyms.map((antonym, index) => (
                              <Badge key={index} variant="outline">{antonym}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Learn It Button */}
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={handleLearned}
                      size="lg"
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Lightbulb className="h-4 w-4" />
                      I Learned It! Next Word
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Button onClick={handleGenerateNewWord} size="lg">
                Start Learning
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={handleGenerateNewWord} 
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Shuffle className="h-4 w-4" />
          New Word
        </Button>
      </div>

      {/* Recently Encountered */}
      {encounteredWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Today&apos;s Vocabulary Journey ({encounteredWords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {encounteredWords.slice(-6).reverse().map((word) => (
                <div key={`${word.id}-${word.timestamp}`} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{word.word}</h3>
                    {word.alreadyKnew ? (
                      <Lightbulb className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {word.definition}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {word.difficulty}
                    </Badge>
                    <Badge 
                      variant={word.alreadyKnew ? "secondary" : "default"} 
                      className="text-xs"
                    >
                      {word.alreadyKnew ? "Already knew" : "Learned"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VocabularyBuilder;
