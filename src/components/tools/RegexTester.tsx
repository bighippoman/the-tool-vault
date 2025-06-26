"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Search, Copy, RefreshCw, Code, AlertCircle, CheckCircle, Info, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface CommonPattern {
  name: string;
  pattern: string;
}

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({ global: true, ignoreCase: false, multiline: false });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [replacementText, setReplacementText] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [isCopied, setCopiedType] = useState<string | null>(null);

  const commonPatterns: CommonPattern[] = [
    { name: 'Email', pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$' },
    { name: 'Phone', pattern: '^\\+?[1-9]\\d{1,14}$' },
    { name: 'URL', pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$' },
    { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    { name: 'Time (HH:MM)', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' },
    { name: 'Credit Card', pattern: '^\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}$' },
    { name: 'Hex Color', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
    { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' }
  ];

  const testPatterns = useCallback(() => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError('');
      setReplacedText('');
      return;
    }

    try {
      const flagsString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');
      
      const regex = new RegExp(pattern, flagsString);
      setIsValid(true);
      setError('');
      
      const foundMatches: RegexMatch[] = [];
      let match;
      
      if (flags.global) { // Check if global flag is set
        const globalRegex = new RegExp(pattern, flagsString); // Re-create regex for global matching to reset lastIndex
        while ((match = globalRegex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (!flags.global) break; // Prevent infinite loop if global flag is not set
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(foundMatches);
      
      // Test replacement if replacement text is provided
      if (replacementText) {
        try {
          // For global replacement with regex object, need to ensure global flag is on the regex
          const replaceRegex = new RegExp(pattern, flags.global ? flagsString : flagsString.replace('g', ''));
          const replaced = testString.replace(replaceRegex, replacementText);
          setReplacedText(replaced);
        } catch (replaceError) {
          console.error('Replacement error:', replaceError);
          setReplacedText('');
        }
      } else {
        setReplacedText('');
      }
    } catch (regexError) {
      setIsValid(false);
      setError((regexError as Error).message);
      setMatches([]);
      setReplacedText('');
    }
  }, [pattern, testString, flags, replacementText]);

  useEffect(() => {
    testPatterns();
  }, [testPatterns]);

  const loadPattern = (patternObj: typeof commonPatterns[0]) => {
    setPattern(patternObj.pattern);
    toast.success(`Loaded ${patternObj.name} pattern`);
  };

  const copyResult = (type: 'pattern' | 'matches' | 'replaced') => {
    let textToCopy = '';
    
    switch (type) {
      case 'pattern':
        textToCopy = `/${pattern}/${Object.entries(flags).filter(([, enabled]) => enabled).map(([flag]) => flag).join('')}`;
        break;
      case 'matches':
        textToCopy = matches.map((match, index) => 
          `Match ${index + 1}: "${match.match}" at position ${match.index}${match.groups.length > 0 ? `\nGroups: ${match.groups.join(', ')}` : ''}`
        ).join('\n\n');
        break;
      case 'replaced':
        textToCopy = replacedText;
        break;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
      toast.success('Copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadResults = () => {
    const flagsString = Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');

    const content = [
      'Regex Test Results',
      '='.repeat(20),
      '',
      `Pattern: /${pattern}/${flagsString}`,
      `Valid: ${isValid}`,
      error ? `Error: ${error}` : '',
      '',
      `Test Text Length: ${testString.length} characters`,
      `Total Matches: ${matches.length}`,
      '',
      'Matches:',
      ...matches.map((match, index) => 
        `${index + 1}. "${match.match}" at position ${match.index}${match.groups.length > 0 ? ` (Groups: ${match.groups.join(', ')})` : ''}`
      ),
      '',
      replacedText ? 'Replacement Result:' : '',
      replacedText ? replacedText : '',
      '',
      `Generated at: ${new Date().toLocaleString()}`
    ].filter(line => line !== '').join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-test-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Results downloaded');
  };

  const loadSample = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    setTestString(`Contact us at:
support@example.com
sales@company.org
info@website.net
invalid.email
admin@localhost`);
    setReplacementText('[EMAIL]');
  };

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) return text;
    
    let highlightedText = text;
    const sortedMatches = [...matches].sort((a, b) => b.index - a.index);
    
    sortedMatches.forEach((match) => {
      const before = highlightedText.substring(0, match.index);
      const matchText = highlightedText.substring(match.index, match.index + match.match.length);
      const after = highlightedText.substring(match.index + match.match.length);
      
      highlightedText = `${before}<mark class="bg-yellow-200 px-1 rounded">${matchText}</mark>${after}`;
    });
    
    return highlightedText;
  };

  const handlePatternChange = (newPattern: string) => {
    setPattern(newPattern);
  };

  const handleTestStringChange = (newTestString: string) => {
    setTestString(newTestString);
  };

  const handleFlagsChange = (flag: string) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag as keyof typeof prev] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Regular Expression Tester
          </CardTitle>
          <CardDescription>
            Test and debug regular expressions with live matching, replacement, and detailed explanations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regular Expression Pattern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">/</span>
            <Input
              placeholder="Enter your regex pattern..."
              value={pattern}
              onChange={(e) => handlePatternChange(e.target.value)}
              className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
            />
            <span className="text-sm font-mono">/</span>
            <div className="flex gap-2">
              {Object.entries(flags).map(([flag, enabled]) => (
                <div key={flag} className="flex items-center space-x-1">
                  <Switch
                    id={`flag-${flag}`}
                    checked={enabled}
                    onCheckedChange={() => handleFlagsChange(flag)}
                  />
                  <Label htmlFor={`flag-${flag}`} className="text-sm font-mono">{flag}</Label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyResult('pattern')}
              disabled={!pattern}
            >
              {isCopied === 'pattern' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Common Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Patterns</CardTitle>
          <CardDescription>Click to load a pre-built pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonPatterns.map((patternObj, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => loadPattern(patternObj)}
              >
                <div className="font-medium text-sm">{patternObj.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{patternObj.pattern}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Text</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter text to test your regex against..."
            value={testString}
            onChange={(e) => handleTestStringChange(e.target.value)}
            className="h-32 resize-none font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Replacement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Replacement (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter replacement text (use $1, $2 for groups)..."
            value={replacementText}
            onChange={(e) => setReplacementText(e.target.value)}
            className="font-mono"
          />
        </CardContent>
      </Card>

      {/* Results */}
      {pattern && testString && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Results</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadResults}>
                <Code className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{matches.length}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isValid ? 'Valid' : 'Invalid'}
                </div>
                <div className="text-sm text-muted-foreground">Pattern</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{testString.length}</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.entries(flags).filter(([, enabled]) => enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">Flags</div>
              </div>
            </div>

            {/* Highlighted Text */}
            {matches.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Text with Matches Highlighted:</Label>
                <div 
                  className="mt-2 p-3 bg-secondary/30 rounded border font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightMatches(testString, matches) }}
                />
              </div>
            )}

            {/* Match Details */}
            {matches.length > 0 && (
              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Match Details:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyResult('matches')}
                  >
                    {isCopied === 'matches' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {matches.map((match, index) => (
                    <div key={index} className="p-2 bg-secondary/30 rounded text-sm">
                      <div className="font-mono font-medium">Match {index + 1}: &quot;{match.match}&quot;</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        Position: {match.index} - {match.index + match.match.length - 1}
                        {match.groups.length > 0 && (
                          <span className="ml-3">Groups: {match.groups.map((group, i) => `$${i + 1}: "${group}"`).join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Replacement Result */}
            {replacedText && (
              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Replacement Result:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyResult('replaced')}
                  >
                    {isCopied === 'replaced' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={replacedText}
                  readOnly
                  className="mt-2 font-mono text-sm bg-secondary/30"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Flag Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Regex Flags Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div><strong>g (global):</strong> Find all matches, not just the first</div>
              <div><strong>i (ignore case):</strong> Case-insensitive matching</div>
            </div>
            <div className="space-y-2">
              <div><strong>m (multiline):</strong> ^ and $ match line breaks</div>
              <div><strong>s (dotall):</strong> . matches newline characters</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          About Regular Expressions
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Regular expressions (regex) are powerful patterns used for matching character combinations in strings. They&apos;re essential for data validation, text processing, and search operations.
          </p>
          <p>
            <strong>Common metacharacters:</strong> . (any character), * (zero or more), + (one or more), ? (optional), ^ (start), $ (end), [] (character class), () (group)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
