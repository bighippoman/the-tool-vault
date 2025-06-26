'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Palette, 
  Copy, 
  Download, 
  Check,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

interface ColorStop {
  color: string;
  position: number;
}

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  direction: string;
  stops: ColorStop[];
  repeating: boolean;
}

const GradientGenerator = () => {
  const [gradient, setGradient] = useState<GradientConfig>({
    type: 'linear',
    direction: '45deg',
    stops: [
      { color: '#ff6b6b', position: 0 },
      { color: '#4ecdc4', position: 100 }
    ],
    repeating: false
  });
  
  const [cssOutput, setCssOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [previewSize, setPreviewSize] = useState('large');

  const directionOptions = {
    linear: [
      { value: '0deg', label: 'Top (0°)' },
      { value: '45deg', label: 'Top Right (45°)' },
      { value: '90deg', label: 'Right (90°)' },
      { value: '135deg', label: 'Bottom Right (135°)' },
      { value: '180deg', label: 'Bottom (180°)' },
      { value: '225deg', label: 'Bottom Left (225°)' },
      { value: '270deg', label: 'Left (270°)' },
      { value: '315deg', label: 'Top Left (315°)' },
      { value: 'to right', label: 'To Right' },
      { value: 'to left', label: 'To Left' },
      { value: 'to bottom', label: 'To Bottom' },
      { value: 'to top', label: 'To Top' }
    ],
    radial: [
      { value: 'circle', label: 'Circle' },
      { value: 'ellipse', label: 'Ellipse' },
      { value: 'circle at center', label: 'Circle at Center' },
      { value: 'circle at top left', label: 'Circle at Top Left' },
      { value: 'circle at top right', label: 'Circle at Top Right' },
      { value: 'circle at bottom left', label: 'Circle at Bottom Left' },
      { value: 'circle at bottom right', label: 'Circle at Bottom Right' }
    ],
    conic: [
      { value: 'from 0deg', label: 'From 0°' },
      { value: 'from 45deg', label: 'From 45°' },
      { value: 'from 90deg', label: 'From 90°' },
      { value: 'from 180deg', label: 'From 180°' },
      { value: 'from 270deg', label: 'From 270°' }
    ]
  };

  const generateCSS = useCallback(() => {
    const { type, direction, stops, repeating } = gradient;
    const gradientType = repeating ? `repeating-${type}-gradient` : `${type}-gradient`;
    
    const colorStops = stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    const css = `background: ${gradientType}(${direction}, ${colorStops});`;
    setCssOutput(css);
    return css;
  }, [gradient, setCssOutput]);

  const generateGradientStyle = () => {
    const { type, direction, stops, repeating } = gradient;
    const gradientType = repeating ? `repeating-${type}-gradient` : `${type}-gradient`;
    
    const colorStops = stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    return `${gradientType}(${direction}, ${colorStops})`;
  };

  const addColorStop = () => {
    const newPosition = gradient.stops.length > 0 
      ? Math.round((gradient.stops[gradient.stops.length - 1].position + 100) / 2)
      : 50;
    
    setGradient(prev => ({
      ...prev,
      stops: [...prev.stops, { color: '#8b5cf6', position: newPosition }]
    }));
  };

  const removeColorStop = (index: number) => {
    if (gradient.stops.length <= 2) {
      toast.error('Gradient must have at least 2 color stops');
      return;
    }
    
    setGradient(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setGradient(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      )
    }));
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(cssOutput).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('CSS copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const downloadCSS = () => {
    const fullCSS = `.gradient {
  ${cssOutput}
  width: 100%;
  height: 100%;
}

/* Alternative formats */
.gradient-webkit {
  background: -webkit-${generateGradientStyle()};
  background: -moz-${generateGradientStyle()};
  background: ${generateGradientStyle()};
}`;

    const blob = new Blob([fullCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('CSS file downloaded');
  };

  const randomGradient = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#48dbfb', '#0abde3', '#006ba6', '#f39801', '#8e44ad'
    ];
    
    const numStops = Math.floor(Math.random() * 3) + 2; // 2-4 stops
    const stops: ColorStop[] = [];
    
    for (let i = 0; i < numStops; i++) {
      stops.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        position: (100 / (numStops - 1)) * i
      });
    }
    
    const types: Array<'linear' | 'radial' | 'conic'> = ['linear', 'radial', 'conic'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setGradient({
      type,
      direction: directionOptions[type][Math.floor(Math.random() * directionOptions[type].length)].value,
      stops,
      repeating: Math.random() > 0.8
    });
  };

  const presetGradients = [
    {
      name: 'Sunset',
      config: {
        type: 'linear' as const,
        direction: '45deg',
        stops: [
          { color: '#ff7e5f', position: 0 },
          { color: '#feb47b', position: 100 }
        ],
        repeating: false
      }
    },
    {
      name: 'Ocean',
      config: {
        type: 'linear' as const,
        direction: '135deg',
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ],
        repeating: false
      }
    },
    {
      name: 'Rainbow',
      config: {
        type: 'linear' as const,
        direction: '90deg',
        stops: [
          { color: '#ff0000', position: 0 },
          { color: '#ff8c00', position: 16.66 },
          { color: '#ffd700', position: 33.33 },
          { color: '#90ee90', position: 50 },
          { color: '#87ceeb', position: 66.66 },
          { color: '#9370db', position: 83.33 },
          { color: '#ff1493', position: 100 }
        ],
        repeating: false
      }
    }
  ];

  useEffect(() => {
    generateCSS();
  }, [generateCSS]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            CSS Gradient Generator
          </CardTitle>
          <CardDescription>
            Create beautiful CSS gradients with live preview and instant code generation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <div className="flex gap-2">
              <Select value={previewSize} onValueChange={setPreviewSize}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={randomGradient}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`
            rounded-lg border shadow-inner
            ${previewSize === 'small' ? 'h-32' : previewSize === 'medium' ? 'h-48' : 'h-64'}
          `} style={{ background: generateGradientStyle() }}>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gradient Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type and Direction */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <Select 
                  value={gradient.type} 
                  onValueChange={(value: 'linear' | 'radial' | 'conic') => 
                    setGradient(prev => ({ 
                      ...prev, 
                      type: value,
                      direction: directionOptions[value][0].value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select 
                  value={gradient.direction} 
                  onValueChange={(value) => setGradient(prev => ({ ...prev, direction: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {directionOptions[gradient.type].map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Stops */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Color Stops</Label>
                <Button size="sm" onClick={addColorStop}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stop
                </Button>
              </div>
              
              <div className="space-y-3">
                {gradient.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                        className="w-12 h-8 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={stop.color}
                        onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                        className="flex-1 font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[stop.position]}
                        onValueChange={([value]) => updateColorStop(index, 'position', value)}
                        max={100}
                        step={1}
                        className="w-20"
                      />
                      <span className="text-sm font-mono w-12">{stop.position}%</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeColorStop(index)}
                      disabled={gradient.stops.length <= 2}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <Label>Preset Gradients</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetGradients.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setGradient(preset.config)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSS Output */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Generated CSS</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyCSS}>
                  {isCopied ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadCSS}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <code className="text-sm font-mono">{cssOutput}</code>
            </div>
            
            {/* Browser Compatibility */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Browser Compatibility</Label>
              <div className="text-sm bg-secondary/30 rounded p-3">
                <div className="space-y-1">
                  <div>• Modern browsers: Full support</div>
                  <div>• Safari: Requires -webkit- prefix for older versions</div>
                  <div>• IE11: Limited gradient support</div>
                </div>
              </div>
            </div>
            
            {/* Usage Tips */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Usage Tips</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Use as background property in CSS</div>
                <div>• Combine with fallback colors for older browsers</div>
                <div>• Consider performance with complex gradients</div>
                <div>• Test on different screen sizes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gradient Types Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linear Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Most Common</Badge>
              <div className="text-sm text-muted-foreground">
                Colors transition in a straight line. Perfect for backgrounds, buttons, and headers.
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Radial Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Circular</Badge>
              <div className="text-sm text-muted-foreground">
                Colors radiate from a center point. Great for spotlight effects and circular designs.
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conic Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">Modern</Badge>
              <div className="text-sm text-muted-foreground">
                Colors rotate around a center point. Perfect for pie charts and creative effects.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Professional CSS Gradient Generator
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Create stunning CSS gradients with this professional gradient generator. Support for linear, radial, and conic gradients 
            with live preview, multiple color stops, and instant CSS code generation.
          </p>
          <p>
            <strong>Perfect for:</strong> Web designers creating modern backgrounds, UI developers building gradient components, 
            and anyone needing beautiful color transitions for websites and applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
