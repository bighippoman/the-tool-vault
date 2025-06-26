'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Copy, Check, ArrowUpDown, Trash2 } from 'lucide-react';

const UrlEncoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleEncode = () => {
    if (input.trim() === '') {
      setOutput('');
      return;
    }
    
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
      toast.error('Failed to encode URL');
    }
  };

  const handleDecode = () => {
    if (input.trim() === '') {
      setOutput('');
      return;
    }
    
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
      toast.error('Failed to decode URL');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleCopy = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success('Text copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="url-encoder-container space-y-4 sm:space-y-6">
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode" className="text-sm">URL Encode</TabsTrigger>
          <TabsTrigger value="decode" className="text-sm">URL Decode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encode" className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Convert text to URL-safe format by encoding special characters.
          </div>
        </TabsContent>
        
        <TabsContent value="decode" className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Convert URL-encoded text back to its original format.
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="font-medium text-sm sm:text-base">
              {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
            </h3>
            <div className="flex gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear} className="btn-mobile-friendly">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-1">Clear</span>
              </Button>
            </div>
          </div>
          <Textarea
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL-encoded text to decode...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] sm:min-h-[300px] resize-none text-sm sm:text-base font-mono"
          />
        </div>
        
        {/* Control Buttons */}
        <div className="md:hidden flex justify-center items-center">
          <div className="flex gap-2">
            <Button onClick={handleProcess} className="btn-mobile-friendly">
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            <Button variant="outline" onClick={handleSwap} className="btn-mobile-friendly">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline sm:ml-1">Swap</span>
            </Button>
          </div>
        </div>
        
        {/* Output Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="font-medium text-sm sm:text-base">
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
            </h3>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="btn-mobile-friendly"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline sm:ml-1">{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] sm:min-h-[300px] resize-none bg-secondary/30 text-sm sm:text-base font-mono"
          />
        </div>
        
        {/* Desktop Control Buttons */}
        <div className="hidden md:flex md:col-span-2 justify-center items-center gap-3">
          <Button onClick={handleProcess} className="btn-mobile-friendly">
            {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
          </Button>
          <Button variant="outline" onClick={handleSwap} className="btn-mobile-friendly">
            <ArrowUpDown className="h-4 w-4 sm:mr-2" />
            Swap Input/Output
          </Button>
        </div>
      </div>
      
      {/* Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">About URL Encoding</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground">
            URL encoding (percent-encoding) converts characters into a format that can be transmitted over the Internet. 
            Special characters are replaced with percent signs followed by their hexadecimal representation. 
            This is essential for including special characters in URLs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UrlEncoder;
