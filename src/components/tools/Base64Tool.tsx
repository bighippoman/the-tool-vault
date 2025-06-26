'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Copy, Check, Upload, FileDown, ArrowDownUp } from 'lucide-react';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isCopied, setIsCopied] = useState(false);

  const processText = useCallback(() => {
    if (input === '') {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setOutput(`Error: Failed to decode base64`);
    }
  }, [input, mode]);

  useEffect(() => {
    processText();
  }, [input, mode, processText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mode === 'encode') {
      // For encoding, read file as binary
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        setInput(binary);
      };
      reader.readAsArrayBuffer(file);
    } else {
      // For decoding, read as text
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
    
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    if (!output) return;
    
    // Check if we're in a browser environment
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      try {
        // Fallback copy method
        const textArea = document.createElement('textarea');
        textArea.value = output;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast.success(`${mode === 'encode' ? 'Encoded' : 'Decoded'} text copied to clipboard`);
        } else {
          toast.error('Failed to copy to clipboard');
        }
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    } else {
      // Modern clipboard API
      navigator.clipboard.writeText(output)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast.success(`${mode === 'encode' ? 'Encoded' : 'Decoded'} text copied to clipboard`);
        })
        .catch(() => {
          toast.error('Failed to copy to clipboard');
        });
    }
  };

  const handleSwap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="base64-tool-container space-y-4 sm:space-y-6">
      <Tabs defaultValue="encode" value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode" className="text-sm">Encode Base64</TabsTrigger>
          <TabsTrigger value="decode" className="text-sm">Decode Base64</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encode" className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Convert text or binary data to Base64 encoding for safe transmission and storage.
          </div>
        </TabsContent>
        
        <TabsContent value="decode" className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Convert Base64 encoded data back to its original text or binary format.
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="font-medium text-sm sm:text-base">
              {mode === 'encode' ? 'Original Text/Data' : 'Base64 Encoded Data'}
            </h3>
            <div className="flex gap-1 sm:gap-2">
              <label>
                <Button variant="ghost" size="sm" asChild className="btn-mobile-friendly">
                  <div>
                    <Upload className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Upload</span>
                    <input 
                      type="file" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>
                </Button>
              </label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="btn-mobile-friendly">
                Clear
              </Button>
            </div>
          </div>
          <Textarea 
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 data to decode...'}
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="min-h-[250px] sm:min-h-[300px] resize-none text-sm sm:text-base font-mono"
          />
        </div>
        
        {/* Output Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h3 className="font-medium text-sm sm:text-base">
              {mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Result'}
            </h3>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="ghost" 
                size="sm"
                onClick={handleCopy}
                className="btn-mobile-friendly"
                disabled={!output}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline sm:ml-1">{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                onClick={handleDownload}
                className="btn-mobile-friendly"
                disabled={!output}
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-1">Download</span>
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                onClick={handleSwap}
                className="btn-mobile-friendly"
                disabled={!output}
              >
                <ArrowDownUp className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-1">Swap</span>
              </Button>
            </div>
          </div>
          <Textarea 
            value={output} 
            readOnly 
            className="min-h-[250px] sm:min-h-[300px] resize-none bg-secondary/30 text-sm sm:text-base font-mono"
          />
        </div>
      </div>
      
      {/* Information Section */}
      <div className="bg-secondary/30 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium mb-2 text-sm sm:text-base">About Base64 Encoding</h3>
        <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data as ASCII strings.
            It&apos;s commonly used for encoding data in email systems, URLs, and web applications.
          </p>
          <p>
            <strong>Use cases:</strong> Email attachments, data URIs, API tokens, configuration files, and storing binary data in text-based formats like JSON or XML.
          </p>
          <p>
            Perfect for data URIs, API authentication, and secure data transmission. Base64 doesn&apos;t provide encryption but ensures data integrity during transfer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;
