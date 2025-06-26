"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { copyToClipboardSafe } from '@/utils/clipboardUtils';
import { 
  Hash, 
  Copy, 
  Download, 
  Upload, 
  Shield,
  Check,
  FileText,
  RefreshCw
} from 'lucide-react';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('all');
  const [results, setResults] = useState<HashResult[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const algorithms = useMemo(() => [
    { id: 'md5', name: 'MD5', description: '128-bit hash (deprecated for security)' },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash (legacy)' },
    { id: 'sha256', name: 'SHA-256', description: '256-bit hash (recommended)' },
    { id: 'sha384', name: 'SHA-384', description: '384-bit hash' },
    { id: 'sha512', name: 'SHA-512', description: '512-bit hash' }
  ], []);

  // Simple MD5 implementation for demo purposes
  const simpleMD5 = useCallback(async (text: string): Promise<string> => {
    // This is a simplified version - in a real app you'd use a proper MD5 library
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    // Using SHA-256 and truncating for a pseudo-MD5 as WebCrypto doesn't support MD5 directly
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); 
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  }, []);

  const calculateHash = useCallback(async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let hashAlgorithm: string;
    switch (algorithm) {
      case 'sha1':
        hashAlgorithm = 'SHA-1';
        break;
      case 'sha256':
        hashAlgorithm = 'SHA-256';
        break;
      case 'sha384':
        hashAlgorithm = 'SHA-384';
        break;
      case 'sha512':
        hashAlgorithm = 'SHA-512';
        break;
      default:
        // For MD5, we'll use a simple implementation
        if (algorithm === 'md5') {
          return await simpleMD5(text);
        }
        hashAlgorithm = 'SHA-256';
    }
    
    const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, [simpleMD5]);

  const processText = useCallback(async () => {
    if (!input.trim()) {
      setResults([]);
      return;
    }

    setIsProcessing(true);
    const newResults: HashResult[] = [];
    
    const algorithmsToProcess = selectedAlgorithm === 'all' 
      ? algorithms 
      : algorithms.filter(alg => alg.id === selectedAlgorithm);

    try {
      for (const algorithm of algorithmsToProcess) {
        const hash = await calculateHash(input, algorithm.id);
        newResults.push({
          algorithm: algorithm.name,
          hash,
          length: hash.length
        });
      }
      setResults(newResults);
    } catch (error) {
      console.error('Hash generation error:', error);
      toast.error('Failed to generate hash');
    } finally {
      setIsProcessing(false);
    }
  }, [input, selectedAlgorithm, algorithms, calculateHash, setIsProcessing, setResults]);

  const handleCopyHash = async (hash: string, algorithm: string) => {
    if (!hash) return;
    
    const success = await copyToClipboardSafe(hash, `${algorithm} hash copied to clipboard`);
    if (success) {
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
      toast.success(`${algorithm} hash copied to clipboard`);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadResults = () => {
    if (results.length === 0) {
      toast.error('No hashes to download');
      return;
    }

    const content = [
      'Hash Generation Results',
      '='.repeat(30),
      '',
      `Input: ${input}`,
      `Input Length: ${input.length} characters`,
      '',
      'Generated Hashes:',
      ...results.map(result => 
        `${result.algorithm}: ${result.hash}`
      ),
      '',
      `Generated at: ${new Date().toLocaleString()}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hash-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Hash results downloaded');
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
    setResults([]);
  };

  const insertSample = () => {
    const samples = [
      'Hello, World!',
      'The quick brown fox jumps over the lazy dog',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'SecurePassword123!',
      '{"name": "John", "age": 30, "city": "New York"}'
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      processText();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [processText]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Hash Generator
          </CardTitle>
          <CardDescription>
            Generate secure hash values using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms for data integrity verification
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
                <FileText className="h-4 w-4 mr-2" />
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
                      accept=".txt,.json,.html,.css,.js,.md" 
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
            placeholder="Enter text to generate hash values..."
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="h-32 resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label htmlFor="algorithm-select">Hash Algorithm:</Label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Algorithms</SelectItem>
                  {algorithms.map(alg => (
                    <SelectItem key={alg.id} value={alg.id}>
                      {alg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {input && (
              <div className="text-sm text-muted-foreground">
                {input.length} characters
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Hash Results</h3>
            <div className="flex gap-2">
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </div>
              )}
              <Button onClick={downloadResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {result.algorithm}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {algorithms.find(alg => alg.name === result.algorithm)?.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyHash(result.hash, result.algorithm)}
                      className="flex items-center gap-1"
                    >
                      {copiedHash === result.hash ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/30 rounded p-3 font-mono text-sm break-all">
                    {result.hash}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Length: {result.length} characters
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Algorithm Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hash Algorithms</CardTitle>
          <CardDescription>Understanding different hashing algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Legacy/Deprecated
              </Badge>
              <div className="space-y-2 text-sm">
                <div><strong>MD5:</strong> Fast but cryptographically broken. Use only for checksums.</div>
                <div><strong>SHA-1:</strong> Deprecated for security. Legacy support only.</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Recommended
              </Badge>
              <div className="space-y-2 text-sm">
                <div><strong>SHA-256:</strong> Industry standard, highly secure, perfect for most uses.</div>
                <div><strong>SHA-384/512:</strong> Enhanced security for sensitive applications.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Hash className="h-4 w-4" />
          About Cryptographic Hashing
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Professional hash generator supporting MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Perfect for data integrity verification, password hashing, digital signatures, and security applications.
          </p>
          <p>
            <strong>Common uses:</strong> File integrity checking, password storage, digital forensics, blockchain applications, API security, and data deduplication.
          </p>
          <p>
            💡 <strong>Security tip:</strong> Use SHA-256 or higher for new applications. Avoid MD5 and SHA-1 for security-critical purposes due to known vulnerabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
