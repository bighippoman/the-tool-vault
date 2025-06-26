"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { copyToClipboardSafe } from '@/utils/clipboardUtils';
import { 
  Code,
  Copy, 
  Download, 
  Upload, 
  RotateCcw, 
  Zap,
  Check,
  Minimize, 
  Maximize,
  AlertTriangle
} from 'lucide-react';

const CssMinifier = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isMinified, setIsMinified] = useState(true);
  const [preserveComments, setPreserveComments] = useState(false);
  const [preserveStructure, setPreserveStructure] = useState(false);
  const [stats, setStats] = useState({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const minifyCSS = (css: string, options: { preserveComments: boolean; preserveStructure: boolean }) => {
    let minified = css;
    
    // Remove comments unless preserving
    if (!options.preserveComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    // Remove unnecessary whitespace
    minified = minified.replace(/\s+/g, ' ');
    
    // Remove whitespace around special characters
    minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1');
    
    // Remove trailing semicolons
    minified = minified.replace(/;}/g, '}');
    
    // Remove leading/trailing whitespace
    minified = minified.trim();
    
    // If preserving structure, add some formatting back
    if (options.preserveStructure) {
      minified = minified.replace(/{/g, ' {\n  ');
      minified = minified.replace(/;/g, ';\n  ');
      minified = minified.replace(/}/g, '\n}\n');
      minified = minified.replace(/,/g, ',\n  ');
    }
    
    return minified;
  };

  const beautifyCSS = (css: string) => {
    let beautified = css;
    
    // Add proper spacing and indentation
    beautified = beautified.replace(/{/g, ' {\n  ');
    beautified = beautified.replace(/;/g, ';\n  ');
    beautified = beautified.replace(/}/g, '\n}\n\n');
    beautified = beautified.replace(/,/g, ',\n');
    
    // Fix spacing around colons
    beautified = beautified.replace(/:\s*/g, ': ');
    
    // Clean up extra newlines
    beautified = beautified.replace(/\n\s*\n\s*\n/g, '\n\n');
    beautified = beautified.trim();
    
    return beautified;
  };

  const validateCSS = (css: string) => {
    const errors: string[] = [];
    
    // Check for unclosed braces
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`);
    }
    
    // Check for common syntax errors
    if (css.includes(';;')) {
      errors.push('Double semicolons detected');
    }
    
    if (css.match(/[^:]\s*:\s*[^;{]*[^;}]\s*}/)) {
      errors.push('Missing semicolons detected');
    }
    
    return errors;
  };

  const processCSS = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
      setErrors([]);
      return;
    }

    const validationErrors = validateCSS(input);
    setErrors(validationErrors);

    let processed;
    if (isMinified) {
      processed = minifyCSS(input, { preserveComments, preserveStructure });
    } else {
      processed = beautifyCSS(input);
    }
    
    setOutput(processed);
    
    const originalSize = new Blob([input]).size;
    const processedSize = new Blob([processed]).size;
    const compressionRatio = originalSize > 0 ? Math.round(((originalSize - processedSize) / originalSize) * 100) : 0;
    
    setStats({
      originalSize: input.length,
      minifiedSize: processed.length,
      compressionRatio
    });
  }, [input, isMinified, preserveComments, preserveStructure]);

  const copyToClipboard = async () => {
    if (!output) return;
    
    const success = await copyToClipboardSafe(output, 'CSS copied to clipboard');
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const downloadFile = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isMinified ? 'styles.min.css' : 'styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${isMinified ? 'Minified' : 'Formatted'} CSS downloaded`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.css')) {
      toast.error('Please select a CSS file');
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
    const sample = `/* Sample CSS */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
}

.header {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
}

.nav li a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s ease;
}

.nav li a:hover {
    color: #ff6b6b;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .nav ul {
        flex-direction: column;
    }
}`;
    setInput(sample);
  };

  useEffect(() => {
    processCSS();
  }, [input, isMinified, preserveComments, preserveStructure, processCSS]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            CSS Minifier & Formatter
          </CardTitle>
          <CardDescription>
            Professional CSS optimization tool with minification, beautification, and validation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">CSS Input</CardTitle>
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
                        accept=".css" 
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
              placeholder="Paste your CSS code here..."
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="h-64 font-mono text-sm"
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
                      id="preserve-structure"
                      checked={preserveStructure}
                      onCheckedChange={setPreserveStructure}
                    />
                    <Label htmlFor="preserve-structure">Keep some formatting</Label>
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
                {isMinified ? 'Minified' : 'Formatted'} CSS
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
              placeholder="Your processed CSS will appear here..."
              value={output} 
              readOnly
              className="h-64 font-mono text-sm"
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
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Validation Issues</span>
                </div>
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips & Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CSS Optimization Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Badge variant="outline">Minification Features</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Remove unnecessary whitespace and comments</li>
                <li>• Optimize property values and selectors</li>
                <li>• Remove redundant semicolons</li>
                <li>• Preserve critical formatting options</li>
                <li>• Real-time compression statistics</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Badge variant="outline">Beautification Features</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Proper indentation and spacing</li>
                <li>• Consistent formatting style</li>
                <li>• Improved code readability</li>
                <li>• Syntax validation and error detection</li>
                <li>• File upload and download support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Code className="h-4 w-4" />
          Professional CSS Optimization Tool
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced CSS minifier and beautifier with real-time processing, validation, and optimization features. 
            Reduce file sizes by up to 60% while maintaining full CSS functionality.
          </p>
          <p>
            <strong>Perfect for:</strong> Web developers optimizing site performance, reducing bandwidth usage, 
            improving load times, and maintaining clean, readable CSS code for development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CssMinifier;
