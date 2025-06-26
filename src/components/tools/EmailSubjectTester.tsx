"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mail, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmailSubjectTester = () => {
  const [subject, setSubject] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const { toast } = useToast();

  const analyzeSubject = () => {
    if (!subject.trim()) {
      toast({ title: "Subject Required", variant: "destructive" });
      return;
    }

    const length = subject.length;
    const wordCount = subject.split(' ').length;
    // Using a workaround for emoji detection that doesn't rely on the 'u' flag
    const hasEmojis = /(?:[\uD83C-\uDBFF]|[\uDC00-\uDFFF]|[\u2600-\u27BF])+/.test(subject);
    const hasNumbers = /\d/.test(subject);
    const hasUrgency = /(urgent|limited|now|today|hurry|last chance|deadline)/i.test(subject);
    const hasPersonalization = /(you|your)/i.test(subject);
    const isQuestion = subject.includes('?');
    
    let score = 50;
    const issues = [];
    const suggestions = [];

    // Length analysis
    if (length < 30) {
      suggestions.push('Consider a longer subject line (30-50 characters optimal)');
      score -= 10;
    } else if (length > 60) {
      issues.push('Subject line too long - may get cut off in mobile');
      score -= 15;
    } else {
      score += 15;
    }

    // Word count
    if (wordCount < 3) {
      suggestions.push('Add more descriptive words');
      score -= 5;
    } else if (wordCount > 10) {
      suggestions.push('Consider making it more concise');
      score -= 5;
    } else {
      score += 10;
    }

    // Personalization
    if (hasPersonalization) {
      score += 10;
    } else {
      suggestions.push('Add personalization like "you" or "your"');
    }

    // Urgency
    if (hasUrgency) {
      score += 8;
    } else {
      suggestions.push('Consider adding urgency words');
    }

    // Numbers
    if (hasNumbers) {
      score += 5;
    } else {
      suggestions.push('Numbers can increase open rates');
    }

    // Emojis
    if (hasEmojis) {
      score += 5;
    }

    const predictedOpenRate = Math.max(15, Math.min(45, score));

    setAnalysis({
      score: Math.max(0, Math.min(100, score)),
      length,
      wordCount,
      hasEmojis,
      hasNumbers,
      hasUrgency,
      hasPersonalization,
      isQuestion,
      predictedOpenRate,
      issues,
      suggestions
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Subject Line Tester</h1>
        <p className="text-muted-foreground">Test and optimize email subject lines for maximum open rates with A/B insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Subject Line Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter your email subject line..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1"
            />
            <Button onClick={analyzeSubject}>Test Subject</Button>
          </div>

          {subject && (
            <div className="text-sm text-muted-foreground">
              Length: {subject.length} characters • Words: {subject.split(' ').length}
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{analysis.score}/100</div>
                <Progress value={analysis.score} className="h-3" />
                <div className="text-sm text-muted-foreground mt-2">
                  Predicted Open Rate: <span className="font-medium">{analysis.predictedOpenRate}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold">{analysis.length}</div>
                  <div className="text-xs text-muted-foreground">Characters</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold">{analysis.wordCount}</div>
                  <div className="text-xs text-muted-foreground">Words</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Line Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Personalization</span>
                {analysis.hasPersonalization ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span>Urgency Words</span>
                {analysis.hasUrgency ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span>Numbers</span>
                {analysis.hasNumbers ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span>Emojis</span>
                {analysis.hasEmojis ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span>Question Format</span>
                {analysis.isQuestion ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                }
              </div>
            </CardContent>
          </Card>

          {(analysis.issues.length > 0 || analysis.suggestions.length > 0) && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">Issues to Fix</h4>
                      <ul className="space-y-2">
                        {analysis.issues.map((issue, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-blue-600">Suggestions</h4>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailSubjectTester;
