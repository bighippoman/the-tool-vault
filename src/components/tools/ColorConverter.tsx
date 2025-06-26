'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, RefreshCw } from 'lucide-react';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

const ColorConverter = () => {
  const [inputColor, setInputColor] = useState('#3b82f6');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3b82f6',
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 }
  });

  useEffect(() => {
    convertColor(inputColor);
  }, [inputColor]);

  const convertColor = (color: string) => {
    try {
      // Convert hex to RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // RGB to HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      const diff = max - min;
      
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
        
        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / diff + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / diff + 4;
            break;
        }
        h /= 6;
      }

      // RGB to HSV
      const v = max;
      const sHsv = max === 0 ? 0 : diff / max;

      // RGB to CMYK
      const k = 1 - max;
      const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
      const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
      const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

      setColorValues({
        hex: color.toUpperCase(),
        rgb: { r, g, b },
        hsl: { 
          h: Math.round(h * 360), 
          s: Math.round(s * 100), 
          l: Math.round(l * 100) 
        },
        hsv: { 
          h: Math.round(h * 360), 
          s: Math.round(sHsv * 100), 
          v: Math.round(v * 100) 
        },
        cmyk: { 
          c: Math.round(c * 100), 
          m: Math.round(m * 100), 
          y: Math.round(y * 100), 
          k: Math.round(k * 100) 
        }
      });
    } catch (error) {
      console.error('Color conversion error:', error);
    }
  };

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${format} value copied to clipboard`))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setInputColor(randomHex);
  };

  const colorFormats = [
    {
      name: 'HEX',
      value: colorValues.hex,
      description: 'Hexadecimal color code'
    },
    {
      name: 'RGB',
      value: `rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`,
      description: 'Red, Green, Blue values (0-255)'
    },
    {
      name: 'HSL',
      value: `hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`,
      description: 'Hue, Saturation, Lightness'
    },
    {
      name: 'HSV',
      value: `hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`,
      description: 'Hue, Saturation, Value'
    },
    {
      name: 'CMYK',
      value: `cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`,
      description: 'Cyan, Magenta, Yellow, Key (Black)'
    }
  ];

  return (
    <div className="color-converter-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack all sections, Desktop: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Color Input */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Color Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-picker" className="text-sm">Color Picker</Label>
                <div className="flex gap-2">
                  <input
                    id="color-picker"
                    type="color"
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value)}
                    className="w-16 h-10 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              
              <Button onClick={generateRandomColor} variant="outline" className="w-full btn-mobile-friendly">
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                Random Color
              </Button>
              
              {/* Color Preview */}
              <div className="space-y-2">
                <Label className="text-sm">Preview</Label>
                <div 
                  className="w-full h-24 rounded-lg border border-input"
                  style={{ backgroundColor: inputColor }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Color Values */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Color Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {colorFormats.map((format) => (
                  <div key={format.name} className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium text-sm">{format.name}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(format.value, format.name)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-sm bg-background p-2 rounded border">
                      {format.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Color Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Color Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Brightness</p>
                  <p className="text-2xl font-bold">
                    {Math.round((colorValues.rgb.r * 0.299 + colorValues.rgb.g * 0.587 + colorValues.rgb.b * 0.114) / 255 * 100)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Saturation</p>
                  <p className="text-2xl font-bold">{colorValues.hsl.s}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lightness</p>
                  <p className="text-2xl font-bold">{colorValues.hsl.l}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Usage Examples */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">CSS</p>
              <code className="text-xs bg-secondary/50 p-1 rounded">color: {colorValues.hex};</code>
            </div>
            <div>
              <p className="font-medium mb-1">RGB</p>
              <code className="text-xs bg-secondary/50 p-1 rounded">rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})</code>
            </div>
            <div>
              <p className="font-medium mb-1">HSL</p>
              <code className="text-xs bg-secondary/50 p-1 rounded">hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)</code>
            </div>
            <div>
              <p className="font-medium mb-1">Print (CMYK)</p>
              <code className="text-xs bg-secondary/50 p-1 rounded">{colorValues.cmyk.c}% {colorValues.cmyk.m}% {colorValues.cmyk.y}% {colorValues.cmyk.k}%</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorConverter;
