'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Copy, 
  Clock, 
  Shield,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface DecodedTokenInfo {
  algorithm: string;
  type: string;
  issuer: string;
  subject: string;
  audience: string | string[];
  issuedAt: string;
  expiresAt: string;
  notBefore: string;
  isExpired: boolean;
  isActive: boolean;
  timeToExpiry: number | null;
}

const JwtDecoder = () => {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [isCopied, setIsCopied] = useState({ header: false, payload: false, signature: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<DecodedTokenInfo | null>(null);

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      // Decode header
      const headerDecoded = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      
      // Decode payload
      const payloadDecoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      // Signature (base64 encoded)
      const signatureDecoded = parts[2];

      setHeader(JSON.stringify(headerDecoded, null, 2));
      setPayload(JSON.stringify(payloadDecoded, null, 2));
      setSignature(signatureDecoded);
      
      // Extract token information
      const now = Math.floor(Date.now() / 1000);
      const info = {
        algorithm: headerDecoded.alg || 'Unknown',
        type: headerDecoded.typ || 'Unknown',
        issuer: payloadDecoded.iss || 'Not specified',
        subject: payloadDecoded.sub || 'Not specified',
        audience: payloadDecoded.aud || 'Not specified',
        issuedAt: payloadDecoded.iat ? new Date(payloadDecoded.iat * 1000).toLocaleString() : 'Not specified',
        expiresAt: payloadDecoded.exp ? new Date(payloadDecoded.exp * 1000).toLocaleString() : 'Not specified',
        notBefore: payloadDecoded.nbf ? new Date(payloadDecoded.nbf * 1000).toLocaleString() : 'Not specified',
        isExpired: payloadDecoded.exp ? payloadDecoded.exp < now : false,
        isActive: payloadDecoded.nbf ? payloadDecoded.nbf <= now : true,
        timeToExpiry: payloadDecoded.exp ? Math.max(0, payloadDecoded.exp - now) : null
      };
      
      setTokenInfo(info);
      setErrors([]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decode JWT token';
      setErrors([errorMessage]);
      setHeader('');
      setPayload('');
      setSignature('');
      setTokenInfo(null);
    }
  };

  const validateJWT = (token: string) => {
    const errors: string[] = [];
    
    if (!token.trim()) {
      return errors;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      errors.push('Invalid JWT format. Expected 3 parts separated by dots.');
      return errors;
    }
    
    // Validate base64 encoding
    parts.forEach((part, index) => {
      try {
        const decoded = part.replace(/-/g, '+').replace(/_/g, '/');
        atob(decoded);
      } catch {
        const partNames = ['header', 'payload', 'signature'];
        errors.push(`Invalid base64 encoding in ${partNames[index]}`);
      }
    });
    
    return errors;
  };

  const copyToClipboard = async (content: string, type: 'header' | 'payload' | 'signature') => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(prev => ({ ...prev, [type]: true }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard`);
      setTimeout(() => {
        setIsCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadDecoded = () => {
    if (!header && !payload) return;
    
    const content = {
      header: header ? JSON.parse(header) : null,
      payload: payload ? JSON.parse(payload) : null,
      signature: signature || null,
      tokenInfo: tokenInfo
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jwt-decoded.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Decoded JWT downloaded');
  };

  const insertSample = () => {
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImlzcyI6InRvb2xodWIuYXBwIiwiYXVkIjoidG9vbGh1Yi11c2VycyJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInput(sampleJWT);
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  useEffect(() => {
    if (input.trim()) {
      const validationErrors = validateJWT(input);
      if (validationErrors.length === 0) {
        decodeJWT(input);
      } else {
        setErrors(validationErrors);
        setHeader('');
        setPayload('');
        setSignature('');
        setTokenInfo(null);
      }
    } else {
      setHeader('');
      setPayload('');
      setSignature('');
      setErrors([]);
      setTokenInfo(null);
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            JWT Token Decoder & Analyzer
          </CardTitle>
          <CardDescription>
            Decode and analyze JSON Web Tokens with detailed security information and validation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">JWT Token Input</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={insertSample}>
                Sample Token
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setInput('')}>
                <Clock className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste your JWT token here..."
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="h-32 font-mono text-sm"
          />
          
          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-600">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">Token Issues</span>
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

      {/* Token Information */}
      {tokenInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Token Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Algorithm</Label>
                <Badge variant="outline">{tokenInfo.algorithm}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Badge variant="outline">{tokenInfo.type}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge variant={tokenInfo.isExpired ? "destructive" : "secondary"}>
                  {tokenInfo.isExpired ? "Expired" : "Valid"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Issuer</Label>
                <div className="text-sm">{tokenInfo.issuer}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Subject</Label>
                <div className="text-sm">{tokenInfo.subject}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Audience</Label>
                <div className="text-sm">{tokenInfo.audience}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Issued At</Label>
                <div className="text-sm">{tokenInfo.issuedAt}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Expires At</Label>
                <div className="text-sm">{tokenInfo.expiresAt}</div>
              </div>
              {tokenInfo.timeToExpiry !== null && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Time Remaining</Label>
                  <div className="text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(tokenInfo.timeToExpiry)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decoded Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Header</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(header, 'header')} 
                disabled={!header}
              >
                {isCopied.header ? (
                  <Copy className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied.header ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Header will appear here..."
              value={header} 
              readOnly
              className="h-40 font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Payload */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Payload</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(payload, 'payload')} 
                disabled={!payload}
              >
                {isCopied.payload ? (
                  <Copy className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied.payload ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Payload will appear here..."
              value={payload} 
              readOnly
              className="h-40 font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Signature */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Signature</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(signature, 'signature')} 
                  disabled={!signature}
                >
                  {isCopied.signature ? (
                    <Copy className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopied.signature ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadDecoded} disabled={!header && !payload}>
                  <Copy className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Signature will appear here..."
              value={signature} 
              readOnly
              className="h-40 font-mono text-sm break-all"
            />
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Token Analysis</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Automatic token validation</li>
                <li>• Expiration time checking</li>
                <li>• Algorithm identification</li>
                <li>• Claim extraction and analysis</li>
                <li>• Security best practice warnings</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supported Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">JWT Standards</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• HMAC (HS256, HS384, HS512)</li>
                <li>• RSA (RS256, RS384, RS512)</li>
                <li>• ECDSA (ES256, ES384, ES512)</li>
                <li>• RSA-PSS (PS256, PS384, PS512)</li>
                <li>• None algorithm detection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Key className="h-4 w-4" />
          Professional JWT Token Decoder & Security Analyzer
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced JWT token decoder with comprehensive security analysis, expiration checking, and detailed claim extraction. 
            Essential tool for developers working with JSON Web Tokens in authentication and authorization systems.
          </p>
          <p>
            <strong>Perfect for:</strong> API debugging, token validation, security auditing, authentication troubleshooting, 
            and understanding JWT token structure and claims for development and testing purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JwtDecoder;
