'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Code2, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw, 
  Zap,
  Check,
  AlertTriangle,
  Minimize,
  Maximize,
  File
} from 'lucide-react';

const JsMinifier = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isMinified, setIsMinified] = useState(true);
  const [preserveComments, setPreserveComments] = useState(false);
  const [preserveNewlines, setPreserveNewlines] = useState(false);
  const [stats, setStats] = useState({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const minifyJS = useCallback((js: string, options: { preserveComments: boolean; preserveNewlines: boolean }) => {
    let minified = js;
    
    // Remove single-line comments unless preserving
    if (!options.preserveComments) {
      minified = minified.replace(/\/\/.*$/gm, '');
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    // Remove unnecessary whitespace
    if (!options.preserveNewlines) {
      minified = minified.replace(/\s+/g, ' ');
    } else {
      minified = minified.replace(/[ \t]+/g, ' ');
    }
    
    // Remove whitespace around operators and punctuation
    minified = minified.replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1');
    
    // Remove trailing semicolons before }
    minified = minified.replace(/;}/g, '}');
    
    // Clean up extra spaces
    minified = minified.replace(/\s+/g, ' ').trim();
    
    return minified;
  }, []);

  const beautifyJS = useCallback((js: string) => {
    let beautified = js;
    let indentLevel = 0;
    const indentSize = 2;
    
    // Add proper spacing around operators
    beautified = beautified.replace(/([=+\-*/<>!&|])/g, ' $1 ');
    
    // Fix spacing around braces and parentheses
    beautified = beautified.replace(/\s*{\s*/g, ' {\n');
    beautified = beautified.replace(/\s*}\s*/g, '\n}\n');
    beautified = beautified.replace(/\s*;\s*/g, ';\n');
    beautified = beautified.replace(/\s*,\s*/g, ', ');
    
    // Add proper indentation
    const lines = beautified.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
      const indented = ' '.repeat(indentLevel * indentSize) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      
      return indented;
    });
    
    return formattedLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
  }, []);

  const validateJS = useCallback((js: string) => {
    const errors: string[] = [];
    
    try {
      // Basic syntax validation
      new Function(js);
    } catch (error) {
      errors.push(`Syntax error: ${(error as Error).message}`);
    }
    
    // Check for common issues
    const openBraces = (js.match(/{/g) || []).length;
    const closeBraces = (js.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`);
    }
    
    const openParens = (js.match(/\(/g) || []).length;
    const closeParens = (js.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Mismatched parentheses: ${openParens} opening, ${closeParens} closing`);
    }
    
    return errors;
  }, []);

  const processJS = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
      setErrors([]);
      return;
    }

    const validationErrors = validateJS(input);
    setErrors(validationErrors);

    let processed;
    if (isMinified) {
      processed = minifyJS(input, { preserveComments, preserveNewlines });
    } else {
      processed = beautifyJS(input);
    }
    
    setOutput(processed);
    
    const originalSize = new Blob([input]).size;
    const processedSize = new Blob([processed]).size;
    const compressionRatio = originalSize > 0 ? Math.round(((originalSize - processedSize) / originalSize) * 100) : 0;
    
    setStats({
      originalSize,
      minifiedSize: processedSize,
      compressionRatio
    });
  }, [input, isMinified, preserveComments, preserveNewlines, minifyJS, beautifyJS, validateJS, setOutput, setStats, setErrors]);

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('JavaScript copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadFile = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isMinified ? 'script.min.js' : 'script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${isMinified ? 'Minified' : 'Formatted'} JavaScript downloaded`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.js')) {
      toast.error('Please select a JavaScript file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  const insertSample = () => {
    const sample = `// Sample JavaScript Code
function calculateTotal(items) {
    let total = 0;
    
    for (let i = 0; i < items.length; i++) {
        if (items[i].price && items[i].quantity) {
            total += items[i].price * items[i].quantity;
        }
    }
    
    return total;
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.discount = 0;
    }
    
    addItem(item) {
        if (!item.id || !item.name || !item.price) {
            throw new Error('Invalid item format');
        }
        
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.items.push({ ...item, quantity: item.quantity || 1 });
        }
    }
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }
    
    getTotal() {
        const subtotal = calculateTotal(this.items);
        return subtotal - (subtotal * this.discount / 100);
    }
}

// Usage example
const cart = new ShoppingCart();
cart.addItem({ id: 1, name: 'Laptop', price: 999.99 });
cart.addItem({ id: 2, name: 'Mouse', price: 29.99, quantity: 2 });
console.log('Total:', cart.getTotal());`;
    setInput(sample);
  };

  useEffect(() => {
    processJS();
  }, [processJS]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            JavaScript Minifier & Beautifier
          </CardTitle>
          <CardDescription>
            Professional JavaScript optimization with minification, formatting, and syntax validation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <File className="h-4 w-4" />
                JavaScript Input
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={insertSample}>
                  <Zap className="h-4 w-4 mr-2" />
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput('')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <label>
                  <Button variant="ghost" size="sm" asChild>
                    <div className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept=".js" 
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
              placeholder="Paste your JavaScript code here..."
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="h-80 font-mono text-sm"
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="minify-mode"
                    checked={isMinified}
                    onCheckedChange={setIsMinified}
                  />
                  <Label htmlFor="minify-mode">
                    {isMinified ? 'Minify' : 'Beautify'}
                  </Label>
                </div>
                {isMinified ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </div>
              
              {isMinified && (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-comments"
                      checked={preserveComments}
                      onCheckedChange={setPreserveComments}
                    />
                    <Label htmlFor="preserve-comments">Preserve comments</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-newlines"
                      checked={preserveNewlines}
                      onCheckedChange={setPreserveNewlines}
                    />
                    <Label htmlFor="preserve-newlines">Keep line breaks</Label>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {isMinified ? 'Minified' : 'Formatted'} JavaScript
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                  {isCopied ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Your processed JavaScript will appear here..."
              value={output} 
              readOnly
              className="h-80 font-mono text-sm"
            />
            
            {/* Stats */}
            {output && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-medium">{stats.originalSize}</div>
                  <div className="text-xs text-muted-foreground">Original bytes</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{stats.minifiedSize}</div>
                  <div className="text-xs text-muted-foreground">Processed bytes</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-green-600">
                    {isMinified && stats.compressionRatio > 0 ? '-' : ''}{Math.abs(stats.compressionRatio)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isMinified ? 'Saved' : 'Size change'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Errors */}
            {errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Syntax Issues</span>
                </div>
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips & Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minification Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Performance Features</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Reduces file size by 30-70%</li>
                <li>• Faster page load times</li>
                <li>• Lower bandwidth usage</li>
                <li>• Improved SEO scores</li>
                <li>• Better user experience</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Development Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Code Quality</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Syntax validation and error detection</li>
                <li>• Consistent code formatting</li>
                <li>• Customizable minification options</li>
                <li>• Source code preservation options</li>
                <li>• Professional development workflow</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Professional JavaScript Optimization Tool
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced JavaScript minifier and beautifier with syntax validation, error detection, and customizable optimization settings. 
            Reduce JavaScript file sizes significantly while maintaining code functionality and readability options for development.
          </p>
          <p>
            <strong>Essential for:</strong> Web performance optimization, production deployments, bandwidth reduction, 
            faster page loads, and maintaining clean, readable code during development cycles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JsMinifier;
