
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Code, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Check
} from 'lucide-react';

interface EntityMap {
  [key: string]: string;
}

// Common HTML entities
const htmlEntities: EntityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
  ' ': '&nbsp;',
  '¡': '&iexcl;',
  '¢': '&cent;',
  '£': '&pound;',
  '¤': '&curren;',
  '¥': '&yen;',
  '¦': '&brvbar;',
  '§': '&sect;',
  '¨': '&uml;',
  '©': '&copy;',
  'ª': '&ordf;',
  '«': '&laquo;',
  '¬': '&not;',
  '®': '&reg;',
  '¯': '&macr;',
  '°': '&deg;',
  '±': '&plusmn;',
  '²': '&sup2;',
  '³': '&sup3;',
  '´': '&acute;',
  'µ': '&micro;',
  '¶': '&para;',
  '·': '&middot;',
  '¸': '&cedil;',
  '¹': '&sup1;',
  'º': '&ordm;',
  '»': '&raquo;',
  '¼': '&frac14;',
  '½': '&frac12;',
  '¾': '&frac34;',
  '¿': '&iquest;',
  'À': '&Agrave;',
  'Á': '&Aacute;',
  'Â': '&Acirc;',
  'Ã': '&Atilde;',
  'Ä': '&Auml;',
  'Å': '&Aring;',
  'Æ': '&AElig;',
  'Ç': '&Ccedil;',
  'È': '&Egrave;',
  'É': '&Eacute;',
  'Ê': '&Ecirc;',
  'Ë': '&Euml;',
  'Ì': '&Igrave;',
  'Í': '&Iacute;',
  'Î': '&Icirc;',
  'Ï': '&Iuml;',
  'Ð': '&ETH;',
  'Ñ': '&Ntilde;',
  'Ò': '&Ograve;',
  'Ó': '&Oacute;',
  'Ô': '&Ocirc;',
  'Õ': '&Otilde;',
  'Ö': '&Ouml;',
  '×': '&times;',
  'Ø': '&Oslash;',
  'Ù': '&Ugrave;',
  'Ú': '&Uacute;',
  'Û': '&Ucirc;',
  'Ü': '&Uuml;',
  'Ý': '&Yacute;',
  'Þ': '&THORN;',
  'ß': '&szlig;',
  'à': '&agrave;',
  'á': '&aacute;',
  'â': '&acirc;',
  'ã': '&atilde;',
  'ä': '&auml;',
  'å': '&aring;',
  'æ': '&aelig;',
  'ç': '&ccedil;',
  'è': '&egrave;',
  'é': '&eacute;',
  'ê': '&ecirc;',
  'ë': '&euml;',
  'ì': '&igrave;',
  'í': '&iacute;',
  'î': '&icirc;',
  'ï': '&iuml;',
  'ð': '&eth;',
  'ñ': '&ntilde;',
  'ò': '&ograve;',
  'ó': '&oacute;',
  'ô': '&ocirc;',
  'õ': '&otilde;',
  'ö': '&ouml;',
  '÷': '&divide;',
  'ø': '&oslash;',
  'ù': '&ugrave;',
  'ú': '&uacute;',
  'û': '&ucirc;',
  'ü': '&uuml;',
  'ý': '&yacute;',
  'þ': '&thorn;',
  'ÿ': '&yuml;'
};

const HtmlEntity = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encoding, setEncoding] = useState<'named' | 'numeric' | 'hex'>('named');
  const [encodeSpaces, setEncodeSpaces] = useState(false);
  const [encodeLineBreaks, setEncodeLineBreaks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({ chars: 0, entities: 0, saved: 0 });
  const [isCopied, setIsCopied] = useState(false);

  const encodeHtmlEntities = useCallback((text: string): string => {
    let encoded = text;
    
    if (encoding === 'named') {
      // Use named entities where available
      encoded = encoded.replace(/[&<>"'/`=]/g, (char) => htmlEntities[char] || char);
      
      // Extended characters
      encoded = encoded.replace(/[\u00A0-\u00FF]/g, (char) => {
        return htmlEntities[char] || `&#${char.charCodeAt(0)};`;
      });
      
      // Unicode characters
      encoded = encoded.replace(/[\u0100-\uFFFF]/g, (char) => {
        return `&#${char.charCodeAt(0)};`;
      });
    } else if (encoding === 'numeric') {
      // Use numeric entities for all non-ASCII
      encoded = encoded.replace(/[&<>"'/`=\u00A0-\uFFFF]/g, (char) => {
        return `&#${char.charCodeAt(0)};`;
      });
    } else if (encoding === 'hex') {
      // Use hexadecimal entities
      encoded = encoded.replace(/[&<>"'/`=\u00A0-\uFFFF]/g, (char) => {
        return `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`;
      });
    }
    
    if (encodeSpaces) {
      encoded = encoded.replace(/ /g, '&nbsp;');
    }
    
    if (encodeLineBreaks) {
      encoded = encoded.replace(/\n/g, '<br>');
    }
    
    return encoded;
  }, [encoding, encodeSpaces, encodeLineBreaks]);

  const decodeHtmlEntities = useCallback((text: string): string => {
    let decoded = text;
    
    // Decode named entities
    const namedEntityRegex = /&([a-zA-Z][a-zA-Z0-9]*);/g;
    decoded = decoded.replace(namedEntityRegex, (match, entityName) => {
      // Find the character for this entity
      for (const [char, entity] of Object.entries(htmlEntities)) {
        if (entity === match) {
          return char;
        }
      }
      
      // Common named entities not in our map
      const commonEntities: EntityMap = {
        'nbsp': ' ',
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'quot': '"',
        'apos': "'",
        'copy': '©',
        'reg': '®',
        'trade': '™',
        'euro': '€',
        'pound': '£',
        'yen': '¥'
      };
      
      return commonEntities[entityName] || match;
    });
    
    // Decode numeric entities (decimal)
    decoded = decoded.replace(/&#(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 10));
    });
    
    // Decode hexadecimal entities
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    // Decode line breaks
    decoded = decoded.replace(/<br\s*\/?>/gi, '\n');
    
    return decoded;
  }, []);

  const processText = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setStats({ chars: 0, entities: 0, saved: 0 });
      return;
    }

    let result: string;
    if (mode === 'encode') {
      result = encodeHtmlEntities(input);
    } else {
      result = decodeHtmlEntities(input);
    }
    
    setOutput(result);
    
    // Calculate statistics
    const entityCount = (result.match(/&[#a-zA-Z0-9]+;/g) || []).length;
    const charDiff = result.length - input.length;
    
    setStats({
      chars: result.length,
      entities: entityCount,
      saved: mode === 'decode' ? -charDiff : charDiff
    });
  }, [input, mode, encodeHtmlEntities, decodeHtmlEntities, setOutput, setStats]);

  const handleCopy = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Output copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'encode' ? 'encoded' : 'decoded'}-html.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded successfully');
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

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    toast.success('Input and output swapped');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStats({ chars: input.length, entities: 0, saved: 0 });
  };

  const quickInsertEntity = (entity: string) => {
    setInput(prev => prev + entity);
  };

  useEffect(() => {
    processText();
  }, [processText]);

  const commonEntities = [
    { entity: '&amp;', char: '&', desc: 'Ampersand' },
    { entity: '&lt;', char: '<', desc: 'Less than' },
    { entity: '&gt;', char: '>', desc: 'Greater than' },
    { entity: '&quot;', char: '"', desc: 'Quotation mark' },
    { entity: '&#x27;', char: "'", desc: 'Apostrophe' },
    { entity: '&nbsp;', char: ' ', desc: 'Non-breaking space' },
    { entity: '&copy;', char: '©', desc: 'Copyright' },
    { entity: '&reg;', char: '®', desc: 'Registered' },
    { entity: '&trade;', char: '™', desc: 'Trademark' },
    { entity: '&euro;', char: '€', desc: 'Euro' },
    { entity: '&pound;', char: '£', desc: 'Pound' },
    { entity: '&yen;', char: '¥', desc: 'Yen' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            HTML Entity Encoder/Decoder
          </CardTitle>
          <CardDescription>
            Convert special characters to HTML entities and vice versa with advanced options
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(value: 'encode' | 'decode') => setMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encode">Encode to Entities</SelectItem>
                  <SelectItem value="decode">Decode from Entities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {mode === 'encode' && (
              <div className="space-y-2">
                <Label>Entity Format</Label>
                <Select value={encoding} onValueChange={(value: 'named' | 'numeric' | 'hex') => setEncoding(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="named">Named (&amp;)</SelectItem>
                    <SelectItem value="numeric">Numeric (&#38;)</SelectItem>
                    <SelectItem value="hex">Hexadecimal (&#x26;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {mode === 'encode' && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="encode-spaces"
                    checked={encodeSpaces}
                    onCheckedChange={setEncodeSpaces}
                  />
                  <Label htmlFor="encode-spaces">Encode Spaces</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="encode-breaks"
                    checked={encodeLineBreaks}
                    onCheckedChange={setEncodeLineBreaks}
                  />
                  <Label htmlFor="encode-breaks">Encode Line Breaks</Label>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {mode === 'encode' ? 'Plain Text Input' : 'HTML Entities Input'}
              </CardTitle>
              <div className="flex gap-2">
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
                        accept=".txt,.html,.htm" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </div>
                  </Button>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder={mode === 'encode' ? 'Enter text with special characters...' : 'Enter HTML with entities...'}
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="font-mono h-[300px] resize-none"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {mode === 'encode' ? 'HTML Entities Output' : 'Plain Text Output'}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!output}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Hide' : 'Preview'}
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={swapInputOutput}
                  disabled={!output}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  Swap
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center gap-1"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showPreview && mode === 'decode' ? (
              <div 
                className="border rounded p-4 h-[300px] overflow-auto bg-white"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <Textarea 
                value={output} 
                readOnly 
                className="font-mono h-[300px] resize-none bg-secondary/30"
                placeholder="Processed text will appear here..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.chars}</div>
                <div className="text-sm text-muted-foreground">Total Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.entities}</div>
                <div className="text-sm text-muted-foreground">HTML Entities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{input.length}</div>
                <div className="text-sm text-muted-foreground">Input Length</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${stats.saved > 0 ? 'text-orange-600' : stats.saved < 0 ? 'text-green-600' : ''}`}>
                  {stats.saved > 0 ? '+' : ''}{stats.saved}
                </div>
                <div className="text-sm text-muted-foreground">Size Change</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Insert */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common HTML Entities</CardTitle>
          <CardDescription>Click to insert into input</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {commonEntities.map((item) => (
              <Button
                key={item.entity}
                variant="outline"
                size="sm"
                onClick={() => quickInsertEntity(mode === 'encode' ? item.char : item.entity)}
                className="justify-start h-auto p-2"
              >
                <div className="text-left">
                  <div className="font-mono text-xs">{item.entity}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Code className="h-4 w-4" />
          About HTML Entity Encoding
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            HTML entity encoding converts special characters to their HTML entity equivalents, ensuring proper display and preventing XSS attacks. Essential for web development and content management.
          </p>
          <p>
            <strong>Use Cases:</strong> Displaying special characters in HTML, preventing code injection, preparing content for XML/HTML documents, and ensuring cross-browser compatibility.
          </p>
          <p>
            💡 <strong>Tip:</strong> Named entities (&amp;) are more readable, numeric entities (&#38;) are more universal, and hex entities (&#x26;) are compact for Unicode characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HtmlEntity;
