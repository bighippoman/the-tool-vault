"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Copy, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
}

const BrandColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const { toast } = useToast();

  const colorPsychology = {
    red: { emotion: 'Passion, Energy, Urgency', industries: 'Food, Entertainment, Sports' },
    blue: { emotion: 'Trust, Stability, Professional', industries: 'Technology, Finance, Healthcare' },
    green: { emotion: 'Growth, Health, Nature', industries: 'Environment, Finance, Wellness' },
    purple: { emotion: 'Luxury, Creativity, Premium', industries: 'Beauty, Art, Technology' },
    orange: { emotion: 'Enthusiasm, Creativity, Fun', industries: 'Entertainment, Food, Retail' },
    yellow: { emotion: 'Optimism, Happiness, Attention', industries: 'Children, Food, Travel' }
  };

  const generatePalette = () => {
    const colors: ColorPalette = {
      primary: baseColor,
      primaryLight: lightenColor(baseColor, 20),
      primaryDark: darkenColor(baseColor, 20),
      secondary: getComplementaryColor(baseColor),
      accent: getTriadicColor(baseColor),
      neutral: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };

    setPalette(colors);
  };

  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const darkenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  };

  const getComplementaryColor = (color: string): string => {
    const r = 255 - parseInt(color.substr(1, 2), 16);
    const g = 255 - parseInt(color.substr(3, 2), 16);
    const b = 255 - parseInt(color.substr(5, 2), 16);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const getTriadicColor = (color: string): string => {
    // Simplified triadic color calculation
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    
    // Rotate by 120 degrees in color wheel
    const temp = r;
    r = g;
    g = b;
    b = temp;
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const copyColor = (color: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(color)
        .then(() => toast({ title: "Copied!", description: `Color ${color} copied to clipboard` }))
        .catch(() => { 
          toast({ title: "Error", description: "Failed to copy color", variant: "destructive" });
        });
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = color;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({ title: "Copied!", description: `Color ${color} copied to clipboard` });
      } catch { 
        toast({ title: "Error", description: "Failed to copy color", variant: "destructive" });
      }
      document.body.removeChild(textArea);
    }
  };

  const exportPalette = () => {
    if (!palette) return;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      toast({ title: "Error", description: "Export is only available in browser environment", variant: "destructive" });
      return;
    }
    
    const css = Object.entries(palette)
      .map(([name, color]) => `  --color-${name}: ${color};`)
      .join('\n');
    
    const cssContent = `:root {\n${css}\n}`;
    
    try {
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'brand-colors.css';
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Exported!", description: "CSS file downloaded successfully" });
    } catch { 
      toast({ title: "Error", description: "Failed to export CSS file", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Brand Color Palette Generator</h1>
        <p className="text-muted-foreground">Generate professional brand color palettes with accessibility and psychology insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Base Brand Color</label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-12 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <Button onClick={generatePalette} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Palette
            </Button>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Color Ideas</h4>
              <div className="grid grid-cols-3 gap-2">
                {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                  <button
                    key={color}
                    className="w-full h-8 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => setBaseColor(color)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {palette ? (
            <Tabs defaultValue="palette" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="palette">Color Palette</TabsTrigger>
                <TabsTrigger value="psychology">Psychology</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="palette" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated Palette</h3>
                  <Button onClick={exportPalette} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSS
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(palette).map(([name, color]) => (
                    <Card key={name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => copyColor(color)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-16 h-16 rounded-lg border"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex-1">
                            <div className="font-medium capitalize">{name}</div>
                            <div className="text-sm text-muted-foreground">{color}</div>
                            <Button variant="ghost" size="sm" className="p-0 h-auto mt-1">
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="psychology" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Psychology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(colorPsychology).map(([colorName, info]) => (
                        <div key={colorName} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div 
                              className="w-6 h-6 rounded-full border"
                              style={{ 
                                backgroundColor: colorName === 'red' ? '#EF4444' :
                                               colorName === 'blue' ? '#3B82F6' :
                                               colorName === 'green' ? '#10B981' :
                                               colorName === 'purple' ? '#8B5CF6' :
                                               colorName === 'orange' ? '#F97316' :
                                               '#EAB308'
                              }}
                            />
                            <h4 className="font-medium capitalize">{colorName}</h4>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div><strong>Emotions:</strong> {info.emotion}</div>
                            <div><strong>Best for:</strong> {info.industries}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">CSS Variables</h4>
                      <pre className="text-xs overflow-auto">
                        <code>
{`:root {
${Object.entries(palette).map(([name, color]) => `  --color-${name}: ${color};`).join('\n')}
}`}
                        </code>
                      </pre>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Tailwind Config</h4>
                      <pre className="text-xs overflow-auto">
                        <code>
{`colors: {
${Object.entries(palette).map(([name, color]) => `  '${name}': '${color}',`).join('\n')}
}`}
                        </code>
                      </pre>
                    </div>

                    <Button onClick={exportPalette} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSS File
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">No Palette Generated</h3>
                <p className="text-muted-foreground">Choose a base color and generate your brand palette!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandColorPaletteGenerator;
