'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Trash2, FileText, Clock, Eye } from 'lucide-react';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        readingTime,
      });
    };

    calculateStats();
  }, [text]);

  const handleClear = () => {
    setText('');
    toast.success('Text cleared');
  };

  const handleCopy = () => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Text copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <div className="word-counter-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack vertically, Desktop: Side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Text Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Text Input</CardTitle>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!text}
                    className="btn-mobile-friendly"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline sm:ml-1">Copy</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={!text}
                    className="btn-mobile-friendly"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline sm:ml-1">Clear</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] sm:min-h-[400px] resize-none text-sm sm:text-base"
              />
            </CardContent>
          </Card>
        </div>

        {/* Statistics Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-secondary/30 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                    {stats.words.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Words</div>
                </div>
                
                <div className="text-center p-2 sm:p-3 bg-secondary/30 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                    {stats.characters.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Characters</div>
                </div>
                
                <div className="text-center p-2 sm:p-3 bg-secondary/30 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                    {stats.charactersNoSpaces.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">No Spaces</div>
                </div>
                
                <div className="text-center p-2 sm:p-3 bg-secondary/30 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                    {stats.sentences.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Sentences</div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Paragraphs:</span>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {stats.paragraphs}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Reading Time:
                  </span>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {stats.readingTime} min
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reading Level Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                Reading Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <p>• Average reading speed: 200 words/min</p>
                <p>• Text complexity varies by audience</p>
                <p>• Consider your target readers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">About Word Counter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground">
            This tool helps you analyze your text by counting words, characters, sentences, and paragraphs. 
            It also estimates reading time based on average reading speed. Perfect for writers, students, and content creators.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordCounter;
