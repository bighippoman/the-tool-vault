"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, QrCode, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const QrGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState('200');
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [qrUrl, setQrUrl] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const generateQR = useCallback(() => {
    if (!text.trim()) {
      setQrUrl('');
      return;
    }

    // Using QR Server API for QR code generation
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      data: text,
      size: `${size}x${size}`,
      ecc: errorCorrection,
      color: `${foregroundColor}-${backgroundColor}`,
      format: 'png'
    });
    
    const url = baseUrl + '?' + params.toString();
    setQrUrl(url);
  }, [text, size, errorCorrection, foregroundColor, backgroundColor]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const handleDownload = () => {
    if (!qrUrl) return;
    
    if (typeof document === 'undefined') {
      toast.error('Download functionality not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  const handleShare = async () => {
    if (!qrUrl) return;
    
    try {
      if (typeof navigator === 'undefined') {
        toast.error('Sharing functionality not available');
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code',
          url: qrUrl
        });
      } else if (navigator.clipboard) {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(qrUrl);
        toast.success('QR code URL copied to clipboard');
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = qrUrl;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success('QR code URL copied to clipboard');
          } else {
            toast.error('Failed to copy QR code URL');
          }
        } catch {
          toast.error('Failed to copy QR code URL');
        }
        
        document.body.removeChild(textArea);
      }
    } catch {
      console.error('Error sharing:');
      toast.error('Failed to share QR code');
    }
  };

  const handleCopy = async () => {
    if (!qrUrl) return;
    
    try {
      await navigator.clipboard.writeText(qrUrl);
      toast.success('QR code URL copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const presetTexts = [
    { label: 'Website URL', value: 'https://example.com' },
    { label: 'WiFi Network', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
    { label: 'Email', value: 'mailto:someone@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'sms:+1234567890' },
  ];

  return (
    <div className="qr-generator-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack all sections, Desktop: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">QR Code Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr-text" className="text-sm">Enter text or URL</Label>
                <Textarea
                  id="qr-text"
                  placeholder="Enter text, URL, or any content for your QR code..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px] resize-none text-sm sm:text-base"
                />
              </div>
              
              {/* Quick Presets */}
              <div className="space-y-2">
                <Label className="text-sm">Quick Presets</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetTexts.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setText(preset.value)}
                      className="text-xs justify-start"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm">Size (pixels)</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150">150x150</SelectItem>
                      <SelectItem value="200">200x200</SelectItem>
                      <SelectItem value="300">300x300</SelectItem>
                      <SelectItem value="400">400x400</SelectItem>
                      <SelectItem value="500">500x500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="foregroundColor" className="text-sm">Foreground Color</Label>
                  <input 
                    type="color" 
                    id="foregroundColor" 
                    value={foregroundColor} 
                    onChange={(e) => setForegroundColor(e.target.value)} 
                    className="w-full h-10 p-2 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor" className="text-sm">Background Color</Label>
                  <input 
                    type="color" 
                    id="backgroundColor" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)} 
                    className="w-full h-10 p-2 text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="errorCorrection" className="text-sm">Error Correction</Label>
                  <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low</SelectItem>
                      <SelectItem value="M">Medium</SelectItem>
                      <SelectItem value="Q">Quartile</SelectItem>
                      <SelectItem value="H">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* QR Code Display */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Generated QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code Display */}
              <div className="flex justify-center">
                {qrUrl ? (
                  <div className="bg-white p-4 rounded-lg border">
                    <Image 
                      src={qrUrl} 
                      alt="Generated QR Code" 
                      width={parseInt(size)}
                      height={parseInt(size)}
                      className="max-w-full h-auto"
                      style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-secondary/30 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Enter content above to generate QR code
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              {qrUrl && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button onClick={handleDownload} className="btn-mobile-friendly">
                    <Download className="h-4 w-4 sm:mr-2" />
                    Download PNG
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="btn-mobile-friendly">
                    <Share2 className="h-4 w-4 sm:mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleCopy} className="btn-mobile-friendly">
                    <QrCode className="h-4 w-4 sm:mr-2" />
                    Copy URL
                  </Button>
                  <Button variant="outline" onClick={generateQR} className="btn-mobile-friendly">
                    <QrCode className="h-4 w-4 sm:mr-2" />
                    Regenerate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">About QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate QR codes for URLs, text, contact information, and more. Customize colors and size to match your needs.
              </p>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• QR codes can store up to 4,296 alphanumeric characters</li>
                <li>• Higher error correction allows damaged codes to still work</li>
                <li>• Larger sizes are better for printing and long-distance scanning</li>
                <li>• WiFi format: WIFI:T:WPA;S:NetworkName;P:Password;;</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
