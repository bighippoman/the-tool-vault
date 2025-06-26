'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  GitCompare, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';

interface DiffResult {
  type: 'equal' | 'added' | 'removed' | 'modified';
  text: string;
  lineNumber?: number;
}

const DiffChecker = () => {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const diffResults = useMemo(() => {
    if (!originalText && !modifiedText) return [];
    
    let original = originalText;
    let modified = modifiedText;
    
    // Apply ignore options
    if (ignoreCase) {
      original = original.toLowerCase();
      modified = modified.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      original = original.replace(/\s+/g, ' ').trim();
      modified = modified.replace(/\s+/g, ' ').trim();
    }
    
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    
    const results: DiffResult[] = [];
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const modifiedLine = modifiedLines[i] || '';
      
      if (originalLine === modifiedLine) {
        if (originalLine || modifiedLine) {
          results.push({
            type: 'equal',
            text: originalLine,
            lineNumber: i + 1
          });
        }
      } else {
        if (originalLine && !modifiedLine) {
          results.push({
            type: 'removed',
            text: originalLine,
            lineNumber: i + 1
          });
        } else if (!originalLine && modifiedLine) {
          results.push({
            type: 'added',
            text: modifiedLine,
            lineNumber: i + 1
          });
        } else {
          results.push({
            type: 'removed',
            text: originalLine,
            lineNumber: i + 1
          });
          results.push({
            type: 'added',
            text: modifiedLine,
            lineNumber: i + 1
          });
        }
      }
    }
    
    return results;
  }, [originalText, modifiedText, ignoreWhitespace, ignoreCase]);

  const stats = useMemo(() => {
    const added = diffResults.filter(r => r.type === 'added').length;
    const removed = diffResults.filter(r => r.type === 'removed').length;
    const modified = added + removed;
    const unchanged = diffResults.filter(r => r.type === 'equal').length;
    
    return { added, removed, modified, unchanged };
  }, [diffResults]);

  const copyDiff = () => {
    const diffText = diffResults.map(result => {
      switch (result.type) {
        case 'added':
          return `+ ${result.text}`;
        case 'removed':
          return `- ${result.text}`;
        case 'equal':
          return `  ${result.text}`;
        default:
          return result.text;
      }
    }).join('\n');
    
    navigator.clipboard.writeText(diffText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Diff results copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadDiff = () => {
    if (diffResults.length === 0) {
      toast.error('No differences to download');
      return;
    }

    const content = [
      'Text Diff Results',
      '='.repeat(20),
      '',
      `Changes: ${stats.modified} lines`,
      `Added: ${stats.added} lines`,
      `Removed: ${stats.removed} lines`,
      `Unchanged: ${stats.unchanged} lines`,
      '',
      'Diff:',
      ...diffResults.map(result => {
        switch (result.type) {
          case 'added':
            return `+ ${result.text}`;
          case 'removed':
            return `- ${result.text}`;
          case 'equal':
            return `  ${result.text}`;
          default:
            return result.text;
        }
      }),
      '',
      `Generated at: ${new Date().toLocaleString()}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-diff.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Diff results downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'original' | 'modified') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (target === 'original') {
        setOriginalText(content);
      } else {
        setModifiedText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  const clearAll = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const swapTexts = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  const loadSample = () => {
    setOriginalText(`The quick brown fox jumps over the lazy dog.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
This is the original text.
Some unchanged content.`);
    
    setModifiedText(`The quick brown fox leaps over the lazy dog.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
This is the modified text with changes.
Some unchanged content.
Added new line here.`);
  };

  const getDiffLineClass = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-l-4 border-green-500 text-green-900';
      case 'removed':
        return 'bg-red-50 border-l-4 border-red-500 text-red-900';
      case 'equal':
        return 'bg-gray-50 border-l-4 border-gray-300';
      default:
        return '';
    }
  };

  const getDiffPrefix = (type: string) => {
    switch (type) {
      case 'added':
        return '+ ';
      case 'removed':
        return '- ';
      case 'equal':
        return '  ';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Text Diff Checker
          </CardTitle>
          <CardDescription>
            Compare two texts and highlight differences line by line with advanced comparison options
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Original Text</CardTitle>
              <label>
                <Button variant="ghost" size="sm" asChild>
                  <div className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept=".txt,.md,.json,.html,.css,.js" 
                      onChange={(e) => handleFileUpload(e, 'original')} 
                      className="hidden" 
                    />
                  </div>
                </Button>
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Enter original text..."
              value={originalText} 
              onChange={(e) => setOriginalText(e.target.value)} 
              className="h-[200px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Modified Text</CardTitle>
              <label>
                <Button variant="ghost" size="sm" asChild>
                  <div className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept=".txt,.md,.json,.html,.css,.js" 
                      onChange={(e) => handleFileUpload(e, 'modified')} 
                      className="hidden" 
                    />
                  </div>
                </Button>
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Enter modified text..."
              value={modifiedText} 
              onChange={(e) => setModifiedText(e.target.value)} 
              className="h-[200px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparison Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="ignore-whitespace"
                checked={ignoreWhitespace}
                onCheckedChange={setIgnoreWhitespace}
              />
              <Label htmlFor="ignore-whitespace">Ignore whitespace</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ignore-case"
                checked={ignoreCase}
                onCheckedChange={setIgnoreCase}
              />
              <Label htmlFor="ignore-case">Ignore case</Label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadSample}>
                <FileText className="h-4 w-4 mr-2" />
                Sample
              </Button>
              <Button variant="outline" size="sm" onClick={swapTexts}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Swap
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {diffResults.length > 0 && (
        <>
          {/* Statistics */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Comparison Results</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyDiff}
                    className="flex items-center gap-1"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadDiff}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                  <div className="text-sm text-muted-foreground">Added</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                  <div className="text-sm text-muted-foreground">Removed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.modified}</div>
                  <div className="text-sm text-muted-foreground">Changed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
                  <div className="text-sm text-muted-foreground">Unchanged</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diff View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Differences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 font-mono text-sm max-h-[400px] overflow-y-auto">
                {diffResults.map((result, index) => (
                  <div
                    key={index}
                    className={`px-3 py-1 ${getDiffLineClass(result.type)}`}
                  >
                    <span className="text-xs text-gray-500 mr-2">
                      {result.lineNumber?.toString().padStart(3, ' ')}
                    </span>
                    <span>{getDiffPrefix(result.type)}</span>
                    <span>{result.text || ' '}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500"></div>
              <span className="text-sm">Added lines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500"></div>
              <span className="text-sm">Removed lines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-l-4 border-gray-300"></div>
              <span className="text-sm">Unchanged lines</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <GitCompare className="h-4 w-4" />
          About Text Comparison
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Professional text comparison tool for identifying differences between documents, code files, and content versions. Perfect for developers, writers, and content managers.
          </p>
          <p>
            <strong>Perfect for:</strong> Code reviews, document versioning, content editing, plagiarism detection, and quality assurance workflows.
          </p>
          <p>
            💡 <strong>Pro tip:</strong> Use &quot;ignore whitespace&quot; for code comparisons and &quot;ignore case&quot; for content reviews. Export results for documentation and review processes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiffChecker;
