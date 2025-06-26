"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, RefreshCw, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LoremGenerator = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateWords = (num: number) => {
    const words = [];
    for (let i = 0; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words
    const words = generateWords(wordCount);
    return words.charAt(0).toUpperCase() + words.slice(1) + '.';
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generateLorem = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences': {
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      }
      case 'paragraphs': {
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
      }
      default:
        result = generateParagraph();
    }
    
    setOutput(result);
  };

  const handleCopy = () => {
    if (!output) return;
    
    try {
      navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Lorem ipsum copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="lorem-generator-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="words">Words</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="count" className="text-sm">
                  Count ({type === 'words' ? 'max 100' : type === 'sentences' ? 'max 20' : 'max 10'})
                </Label>
                <Input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const max = type === 'words' ? 100 : type === 'sentences' ? 20 : 10;
                    setCount(Math.min(Math.max(1, value || 1), max));
                  }}
                  min="1"
                  max={type === 'words' ? '100' : type === 'sentences' ? '20' : '10'}
                  className="text-sm sm:text-base"
                />
              </div>
              
              <Button onClick={generateLorem} className="w-full btn-mobile-friendly">
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                Generate Lorem Ipsum
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Output Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Generated Text</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  className="btn-mobile-friendly"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="hidden sm:inline sm:ml-1">{isCopied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Generated lorem ipsum will appear here..."
                className="min-h-[300px] sm:min-h-[400px] resize-none bg-secondary/30 text-sm sm:text-base"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">About Lorem Ipsum</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum is placeholder text commonly used in the printing and typesetting industry. It&apos;s perfect for mockups, designs, and testing layouts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoremGenerator;
