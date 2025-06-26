'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Type, 
  Copy,
  Download, 
  Upload,
  Zap,
  Check
} from 'lucide-react';

interface CaseOption {
  id: string;
  name: string;
  description: string;
  example: string;
  transform: (text: string) => string;
  icon?: React.ReactNode;
}

const CaseConverter = () => {
  const [input, setInput] = useState('');
  const [preserveSpacing, setPreserveSpacing] = useState(true);
  const [results, setResults] = useState<Record<string, string>>({});
  const [copiedCase, setCopiedCase] = useState<string | null>(null);
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 0 });

  const caseOptions: CaseOption[] = useMemo(() => [
    {
      id: 'upper',
      name: 'UPPER CASE',
      description: 'Convert all letters to uppercase',
      example: 'HELLO WORLD',
      transform: (text: string) => text.toUpperCase()
    },
    {
      id: 'lower',
      name: 'lower case',
      description: 'Convert all letters to lowercase',
      example: 'hello world',
      transform: (text: string) => text.toLowerCase()
    },
    {
      id: 'title',
      name: 'Title Case',
      description: 'Capitalize the first letter of each word',
      example: 'Hello World',
      transform: (text: string) => {
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      }
    },
    {
      id: 'sentence',
      name: 'Sentence case',
      description: 'Capitalize the first letter of each sentence',
      example: 'Hello world. This is a sentence.',
      transform: (text: string) => {
        return text.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, (match) => 
          match.toUpperCase()
        );
      }
    },
    {
      id: 'camel',
      name: 'camelCase',
      description: 'Remove spaces and capitalize each word except the first',
      example: 'helloWorld',
      transform: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
      }
    },
    {
      id: 'pascal',
      name: 'PascalCase',
      description: 'Remove spaces and capitalize each word',
      example: 'HelloWorld',
      transform: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
      }
    },
    {
      id: 'snake',
      name: 'snake_case',
      description: 'Replace spaces with underscores and use lowercase',
      example: 'hello_world',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_');
      }
    },
    {
      id: 'kebab',
      name: 'kebab-case',
      description: 'Replace spaces with hyphens and use lowercase',
      example: 'hello-world',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
      }
    },
    {
      id: 'constant',
      name: 'CONSTANT_CASE',
      description: 'Replace spaces with underscores and use uppercase',
      example: 'HELLO_WORLD',
      transform: (text: string) => {
        return text
          .toUpperCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_');
      }
    },
    {
      id: 'dot',
      name: 'dot.case',
      description: 'Replace spaces with dots and use lowercase',
      example: 'hello.world',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '.');
      }
    },
    {
      id: 'path',
      name: 'path/case',
      description: 'Replace spaces with forward slashes and use lowercase',
      example: 'hello/world',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '/');
      }
    },
    {
      id: 'alternating',
      name: 'AlTeRnAtInG cAsE',
      description: 'Alternate between uppercase and lowercase letters',
      example: 'HeLlO wOrLd',
      transform: (text: string) => {
        return text
          .split('')
          .map((char, index) => 
            char.match(/[a-zA-Z]/) 
              ? index % 2 === 0 
                ? char.toUpperCase() 
                : char.toLowerCase()
              : char
          )
          .join('');
      }
    },
    {
      id: 'inverse',
      name: 'iNVERSE cASE',
      description: 'Swap the case of each letter',
      example: 'hELLO wORLD',
      transform: (text: string) => {
        return text
          .split('')
          .map(char => 
            char === char.toUpperCase() 
              ? char.toLowerCase() 
              : char.toUpperCase()
          )
          .join('');
      }
    },
    {
      id: 'random',
      name: 'RaNdOm CaSe',
      description: 'Randomly capitalize letters',
      example: 'HeLlO WoRlD',
      transform: (text: string) => {
        return text
          .split('')
          .map(char => 
            char.match(/[a-zA-Z]/) 
              ? Math.random() > 0.5 
                ? char.toUpperCase() 
                : char.toLowerCase()
              : char
          )
          .join('');
      }
    }
  ], []);

  const processText = useCallback(() => {
    if (!input.trim()) {
      setResults({});
      setStats({ words: 0, chars: 0, lines: 0 });
      return;
    }

    const newResults: Record<string, string> = {};
    
    caseOptions.forEach(option => {
      const transformed = option.transform(input);
      
      // Preserve original spacing if enabled
      if (preserveSpacing && !['camel', 'pascal', 'snake', 'kebab', 'constant', 'dot', 'path'].includes(option.id)) {
        // Keep original whitespace structure for non-joining cases
        // transformed = transformed; // This line was redundant
      }
      
      newResults[option.id] = transformed;
    });
    
    setResults(newResults);
    
    // Calculate statistics
    const words = input.trim().split(/\s+/).length;
    const chars = input.length;
    const lines = input.split('\n').length;
    
    setStats({ words, chars, lines });
  }, [input, preserveSpacing, caseOptions, setResults, setStats]);

  const copyResult = (caseId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCase(caseId);
      setTimeout(() => setCopiedCase(null), 2000);
      toast.success(`${caseOptions.find(c => c.id === caseId)?.name} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadAll = () => {
    if (!input) {
      toast.error('Please enter some text first');
      return;
    }

    const content = [
      'Case Conversion Results',
      '='.repeat(25),
      '',
      `Original Text: ${input}`,
      '',
      ...caseOptions.map(option => 
        `${option.name}: ${results[option.id] || 'N/A'}`
      ),
      '',
      `Statistics:`,
      `- Characters: ${stats.chars}`,
      `- Words: ${stats.words}`,
      `- Lines: ${stats.lines}`,
      '',
      `Generated at: ${new Date().toLocaleString()}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case-conversions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('All conversions downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  const clearAll = () => {
    setInput('');
    setResults({});
    setStats({ words: 0, chars: 0, lines: 0 });
  };

  const insertSample = () => {
    const samples = [
      'Hello World! This is a sample text.',
      'The Quick Brown Fox Jumps Over The Lazy Dog',
      'JavaScript is awesome for web development',
      'Converting text cases made easy with this tool',
      'API endpoints should follow REST conventions'
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample);
  };

  useEffect(() => {
    processText();
  }, [processText]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Case Converter
          </CardTitle>
          <CardDescription>
            Transform text between different letter cases and naming conventions with 14+ conversion options
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Input Text</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={insertSample}>
                <Zap className="h-4 w-4 mr-2" />
                Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear
              </Button>
              <label>
                <Button variant="ghost" size="sm" asChild>
                  <div className="flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept=".txt" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Enter your text here to convert between different cases..."
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="h-32 resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-spacing"
                checked={preserveSpacing}
                onCheckedChange={setPreserveSpacing}
              />
              <Label htmlFor="preserve-spacing">Preserve original spacing</Label>
            </div>
            
            {input && (
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{stats.chars} chars</span>
                <span>{stats.words} words</span>
                <span>{stats.lines} lines</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Conversion Results</h3>
            <Button onClick={downloadAll} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {caseOptions.map((option) => (
              <Card key={option.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{option.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyResult(option.id, results[option.id])}
                      className="flex items-center gap-1"
                    >
                      {copiedCase === option.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/30 rounded p-3 font-mono text-sm break-all">
                    {results[option.id]}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Example: <span className="font-mono">{option.example}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Use Cases</CardTitle>
          <CardDescription>When to use different case conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">Programming</Badge>
              <div className="text-sm space-y-1">
                <div><strong>camelCase:</strong> JavaScript variables</div>
                <div><strong>PascalCase:</strong> Class names</div>
                <div><strong>snake_case:</strong> Python functions</div>
                <div><strong>kebab-case:</strong> CSS classes</div>
                <div><strong>CONSTANT_CASE:</strong> Configuration values</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">Content</Badge>
              <div className="text-sm space-y-1">
                <div><strong>Title Case:</strong> Headlines</div>
                <div><strong>Sentence case:</strong> Regular text</div>
                <div><strong>UPPER CASE:</strong> Emphasis</div>
                <div><strong>lower case:</strong> Tags, URLs</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline">Creative</Badge>
              <div className="text-sm space-y-1">
                <div><strong>AlTeRnAtInG:</strong> Mocking text</div>
                <div><strong>iNVERSE:</strong> Artistic effect</div>
                <div><strong>RaNdOm:</strong> Playful text</div>
                <div><strong>dot.case:</strong> File extensions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Type className="h-4 w-4" />
          About Text Case Conversion
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Professional text case converter supporting 14+ different case formats including programming conventions (camelCase, snake_case, kebab-case, PascalCase), content formatting (Title Case, Sentence case), and creative options (AlTeRnAtInG, iNVERSE).
          </p>
          <p>
            <strong>Perfect for:</strong> Developers formatting variable names, content creators preparing headlines, data processing, API documentation, and anyone needing consistent text formatting.
          </p>
          <p>
            💡 <strong>Tip:</strong> Use camelCase for JavaScript, snake_case for Python, kebab-case for URLs and CSS, and PascalCase for class names. Enable &quot;preserve spacing&quot; for natural text formatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
