"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, FileText, Lightbulb, CheckCircle, Loader2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OptimizationResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  technicalNotes: string[];
  metrics: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    readingTime: number;
  };
  optimizationType: string;
}

const ContentOptimizer = () => {
  const [content, setContent] = useState('');
  const [optimizationType, setOptimizationType] = useState('general');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyTimeoutId, setCopyTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const optimizationTypes = [
    { value: 'general', label: 'General Optimization', icon: FileText },
    { value: 'seo', label: 'SEO Optimization', icon: TrendingUp },
    { value: 'readability', label: 'Readability Focus', icon: Lightbulb },
    { value: 'engagement', label: 'Engagement Focus', icon: Target },
  ];

  useEffect(() => {
    return () => {
      if (copyTimeoutId) {
        clearTimeout(copyTimeoutId);
      }
    };
  }, [copyTimeoutId]);

  useEffect(() => {
    // Clear copy state when result changes
    if (copyTimeoutId) {
      clearTimeout(copyTimeoutId);
      setCopyTimeoutId(null);
    }
    setCopied(false);
  }, [result, copyTimeoutId]);

  const handleOptimize = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to optimize');
      return;
    }

    // Clear previous result before new optimization
    setResult(null);
    setIsLoading(true);

    try {
      console.log('Starting content optimization...');
      
      const response = await supabase.functions.invoke('content-optimizer', {
        body: { 
          content, 
          optimizationType: optimizationType 
        }
      });

      console.log('Supabase response:', response);

      if (response.error) {
        throw new Error(response.error.message || 'Failed to optimize content');
      }

      const data = response.data;
      console.log('Response data:', data);

      // Validate response structure (backend should handle this, but double-check)
      if (!data || 
          typeof data.overallScore !== 'number' || 
          !Array.isArray(data.strengths) || 
          !Array.isArray(data.improvements) || 
          !Array.isArray(data.recommendations) || 
          !Array.isArray(data.technicalNotes)) {
        throw new Error('Invalid response format from server');
      }

      setResult(data);
      toast.success('Content optimized successfully!');

    } catch (error: unknown) {
      console.error('Optimization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize content';
      toast.error(errorMessage);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported');
      }
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Clear any existing timeout
      if (copyTimeoutId) {
        clearTimeout(copyTimeoutId);
      }
      
      // Set new timeout
      const timeoutId = setTimeout(() => {
        setCopied(false);
        setCopyTimeoutId(null);
      }, 2000);
      
      setCopyTimeoutId(timeoutId);
      toast.success('Analysis copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      // Fallback method for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          
          // Clear any existing timeout
          if (copyTimeoutId) {
            clearTimeout(copyTimeoutId);
          }
          
          // Set new timeout
          const timeoutId = setTimeout(() => {
            setCopied(false);
            setCopyTimeoutId(null);
          }, 2000);
          
          setCopyTimeoutId(timeoutId);
          toast.success('Analysis copied to clipboard!');
        } else {
          throw new Error('Fallback copy method failed');
        }
      } catch (fallbackError) {
        console.error('Fallback copy method also failed:', fallbackError);
        toast.error('Failed to copy to clipboard. Please select and copy manually.');
      }
    }
  };

  const clearAll = () => {
    setContent('');
    setResult(null);
    setOptimizationType('general');
  };

  const renderAnalysisSection = (title: string, content: string[]) => {
    if (!content.length) return null;
    
    return (
      <div key={title} className="space-y-4">
        <h3 className="text-xl font-bold text-foreground border-b border-border pb-2">
          {title}
        </h3>
        <div className="space-y-3">
          {content.map((line, index) => (
            <div key={index} className="text-muted-foreground leading-relaxed p-3 bg-background border border-border rounded-lg">
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const selectedType = optimizationTypes.find(type => type.value === optimizationType);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Content Optimizer</h2>
        <p className="text-muted-foreground">
          Analyze and optimize your content with AI-powered insights for SEO, readability, and engagement
        </p>
        <p className="text-sm text-muted-foreground">
          Use &ldquo;quotes&rdquo; for exact phrases and keywords for better optimization.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Input
            </CardTitle>
            <CardDescription>
              Enter your content below to get optimization recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="optimization-type">Optimization Focus</Label>
              <Select value={optimizationType} onValueChange={setOptimizationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization type" />
                </SelectTrigger>
                <SelectContent>
                  {optimizationTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content to Optimize</Label>
              <Textarea
                id="content"
                placeholder="Paste your content here... (articles, blog posts, marketing copy, etc.)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{content.length} characters</span>
                <span>{content.trim().split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleOptimize} 
                disabled={isLoading || !content.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    {selectedType?.icon && <selectedType.icon className="h-4 w-4 mr-2" />}
                    Optimize Content
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Optimization Results
            </CardTitle>
            <CardDescription>
              AI-powered analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <Tabs defaultValue="analysis" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {result.optimizationType} Analysis
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.strengths.join('\n') + '\n' + result.improvements.join('\n') + '\n' + result.recommendations.join('\n') + '\n' + result.technicalNotes.join('\n'))}
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>

                    {/* Overall Score Display */}
                    <div className={`p-6 rounded-xl text-center border-2 ${result.overallScore >= 80 ? 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800' : result.overallScore >= 60 ? 'bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800' : 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800'}`}>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Overall Score</div>
                      <div className={`text-4xl font-bold ${result.overallScore >= 80 ? 'text-green-600' : result.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{result.overallScore}/100</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.overallScore >= 80 ? 'Excellent' : result.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>

                    {/* Formatted Analysis */}
                    <div className="space-y-6 max-h-[600px] overflow-y-auto">
                      {renderAnalysisSection('Strengths', result.strengths)}
                      {renderAnalysisSection('Improvements', result.improvements)}
                      {renderAnalysisSection('Recommendations', result.recommendations)}
                      {renderAnalysisSection('Technical Notes', result.technicalNotes)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Word Count</div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {result.metrics.wordCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">Characters</div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {result.metrics.characterCount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Paragraphs</div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {result.metrics.paragraphCount}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-amber-700 dark:text-amber-300">Sentences</div>
                        <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                          {result.metrics.sentenceCount}
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-red-700 dark:text-red-300">Avg Words/Sentence</div>
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                          {result.metrics.avgWordsPerSentence}
                        </div>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-950 p-3 rounded-md">
                        <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Reading Time</div>
                        <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                          {result.metrics.readingTime} min
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter content and click &quot;Optimize Content&quot; to see AI-powered analysis and recommendations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentOptimizer;
