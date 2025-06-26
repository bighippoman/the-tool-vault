'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';

const FaviconGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['16x16', '32x32', '180x180', '192x192']);
  const [format, setFormat] = useState('png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const faviconSizes = [
    { size: '16x16', desc: 'Browser tab (classic)', type: 'web' },
    { size: '32x32', desc: 'Browser tab (retina)', type: 'web' },
    { size: '48x48', desc: 'Windows site tile', type: 'web' },
    { size: '57x57', desc: 'iPhone (non-retina)', type: 'mobile' },
    { size: '60x60', desc: 'iPhone (retina)', type: 'mobile' },
    { size: '72x72', desc: 'iPad (non-retina)', type: 'mobile' },
    { size: '76x76', desc: 'iPad (retina)', type: 'mobile' },
    { size: '114x114', desc: 'iPhone 4+ (retina)', type: 'mobile' },
    { size: '120x120', desc: 'iPhone 6+ (retina)', type: 'mobile' },
    { size: '144x144', desc: 'Windows tile', type: 'web' },
    { size: '152x152', desc: 'iPad Pro', type: 'mobile' },
    { size: '180x180', desc: 'Apple touch icon', type: 'mobile' },
    { size: '192x192', desc: 'Android icon', type: 'mobile' },
    { size: '512x512', desc: 'PWA icon', type: 'web' }
  ];

  const formats = [
    { value: 'png', label: 'PNG', desc: 'Modern web format' },
    { value: 'ico', label: 'ICO', desc: 'Legacy browser format' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success('Image uploaded successfully');
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const resizeImage = (originalImage: HTMLImageElement, targetSize: number): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = targetSize;
    canvas.height = targetSize;

    // Draw with high quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(originalImage, 0, 0, targetSize, targetSize);

    return canvas;
  };

  const createIcoFromCanvas = async (canvas: HTMLCanvasElement): Promise<Blob> => {
    // For ICO format, we'll convert the canvas to PNG data and wrap it in ICO format
    return new Promise((resolve) => {
      if (format === 'ico') {
        // Create a simple ICO file structure
        canvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
            try {
              const pngData = await pngBlob.arrayBuffer();
              const ico = createIcoFile(new Uint8Array(pngData), canvas.width);
              resolve(new Blob([ico], { type: 'image/x-icon' }));
            } catch (error) {
              console.warn('ICO creation failed, falling back to PNG:', error);
              resolve(pngBlob);
            }
          } else {
            canvas.toBlob((fallbackBlob) => resolve(fallbackBlob!), 'image/png');
          }
        }, 'image/png');
      } else {
        canvas.toBlob((blob) => resolve(blob!), `image/${format}`);
      }
    });
  };

  const createIcoFile = (pngData: Uint8Array, size: number): Uint8Array => {
    const icoHeader = new Uint8Array(6);
    const iconDir = new Uint8Array(16);
    
    // ICO header
    icoHeader[0] = 0; // Reserved
    icoHeader[1] = 0;
    icoHeader[2] = 1; // ICO type
    icoHeader[3] = 0;
    icoHeader[4] = 1; // Number of images
    icoHeader[5] = 0;
    
    // Icon directory entry
    iconDir[0] = size === 256 ? 0 : size; // Width (0 means 256)
    iconDir[1] = size === 256 ? 0 : size; // Height (0 means 256)
    iconDir[2] = 0; // Color palette
    iconDir[3] = 0; // Reserved
    iconDir[4] = 1; // Color planes
    iconDir[5] = 0;
    iconDir[6] = 32; // Bits per pixel
    iconDir[7] = 0;
    
    // Image size (4 bytes, little endian)
    const imageSize = pngData.length;
    iconDir[8] = imageSize & 0xFF;
    iconDir[9] = (imageSize >> 8) & 0xFF;
    iconDir[10] = (imageSize >> 16) & 0xFF;
    iconDir[11] = (imageSize >> 24) & 0xFF;
    
    // Image offset (4 bytes, little endian)
    const offset = 22; // 6 (header) + 16 (directory)
    iconDir[12] = offset & 0xFF;
    iconDir[13] = (offset >> 8) & 0xFF;
    iconDir[14] = (offset >> 16) & 0xFF;
    iconDir[15] = (offset >> 24) & 0xFF;
    
    // Combine all parts
    const result = new Uint8Array(icoHeader.length + iconDir.length + pngData.length);
    result.set(icoHeader, 0);
    result.set(iconDir, icoHeader.length);
    result.set(pngData, icoHeader.length + iconDir.length);
    
    return result;
  };

  const generateFavicons = async () => {
    if (!selectedImage || !previewUrl) {
      toast.error('Please upload an image first');
      return;
    }

    if (selectedSizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    try {
      const img = new Image();
      img.onload = async () => {
        const zip = await import('jszip').then(module => new module.default());
        
        for (const sizeStr of selectedSizes) {
          const size = parseInt(sizeStr.split('x')[0]);
          const canvas = resizeImage(img, size);
          
          if (canvas) {
            const blob = await createIcoFromCanvas(canvas);
            const arrayBuffer = await blob.arrayBuffer();
            
            const extension = format === 'ico' ? 'ico' : format;
            zip.file(`favicon-${sizeStr}.${extension}`, arrayBuffer);
          }
        }

        // Generate HTML snippet
        const htmlSnippet = generateHtmlSnippet();
        zip.file('html-snippet.txt', htmlSnippet);

        // Generate and download zip
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favicons.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(`Favicons generated and downloaded in ${format.toUpperCase()} format`);
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Favicon generation error:', error);
      toast.error('Failed to generate favicons');
    }
  };

  const generateHtmlSnippet = () => {
    let html = '<!-- Add these lines to your HTML <head> section -->\n';
    
    selectedSizes.forEach(size => {
      if (size === '16x16' || size === '32x32') {
        html += `<link rel="icon" type="image/${format}" sizes="${size}" href="/favicon-${size}.${format}">\n`;
      } else if (size === '180x180') {
        html += `<link rel="apple-touch-icon" sizes="${size}" href="/favicon-${size}.${format}">\n`;
      } else if (size === '192x192' || size === '512x512') {
        html += `<link rel="icon" type="image/${format}" sizes="${size}" href="/favicon-${size}.${format}">\n`;
      } else {
        html += `<link rel="apple-touch-icon" sizes="${size}" href="/favicon-${size}.${format}">\n`;
      }
    });

    if (format === 'ico') {
      html += '\n<!-- Traditional favicon -->\n';
      html += '<link rel="shortcut icon" href="/favicon.ico">\n';
    }

    html += '\n<!-- For modern browsers -->\n';
    html += '<link rel="manifest" href="/site.webmanifest">\n';
    html += '<meta name="theme-color" content="#ffffff">\n';
    
    return html;
  };

  const selectAllSizes = () => {
    setSelectedSizes(faviconSizes.map(item => item.size));
  };

  const clearSelection = () => {
    setSelectedSizes([]);
  };

  const selectPreset = (preset: string) => {
    switch (preset) {
      case 'minimal':
        setSelectedSizes(['16x16', '32x32', '180x180']);
        break;
      case 'standard':
        setSelectedSizes(['16x16', '32x32', '180x180', '192x192']);
        break;
      case 'complete':
        setSelectedSizes(faviconSizes.map(item => item.size));
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Favicon Generator & Optimizer
          </CardTitle>
          <CardDescription>
            Advanced favicon generator creating optimized icons for all devices and platforms. 
            Generates multiple sizes in PNG and ICO formats with ready-to-use HTML code for perfect website integration.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload & Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Image Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 mx-auto rounded-lg object-cover border"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedImage?.name} ({Math.round((selectedImage?.size || 0) / 1024)} KB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Upload your image</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, or SVG • Recommended: 512x512px or larger
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {previewUrl ? 'Change Image' : 'Select Image'}
              </Button>
              {previewUrl && (
                <Button variant="outline" onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl('');
                }}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map(fmt => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    <div>
                      <div className="font-medium">{fmt.label}</div>
                      <div className="text-xs text-muted-foreground">{fmt.desc}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Size Selection */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Favicon Sizes</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAllSizes}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => selectPreset('minimal')}
            >
              Minimal
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => selectPreset('standard')}
            >
              Standard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => selectPreset('complete')}
            >
              Complete
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {faviconSizes.map(item => (
              <div 
                key={item.size}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSizes.includes(item.size) 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
                onClick={() => handleSizeToggle(item.size)}
              >
                <div className="flex items-center gap-3">
                  {item.type === 'mobile' ? (
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{item.size}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border-2 ${
                  selectedSizes.includes(item.size)
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/25'
                }`} />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button 
              onClick={generateFavicons} 
              disabled={!previewUrl || selectedSizes.length === 0}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Favicons ({selectedSizes.length} sizes)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Web Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Browser Support</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• All modern browsers</li>
                <li>• Legacy browser support</li>
                <li>• Retina display optimization</li>
                <li>• PWA manifest generation</li>
                <li>• SEO-friendly implementation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Device Coverage</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• iPhone & iPad icons</li>
                <li>• Android app icons</li>
                <li>• Windows tiles</li>
                <li>• Apple touch icons</li>
                <li>• High-DPI displays</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Quality Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Professional Output</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• High-quality scaling</li>
                <li>• Multiple format support</li>
                <li>• Optimized file sizes</li>
                <li>• Ready-to-use HTML code</li>
                <li>• Batch processing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Professional Favicon Generator & Multi-Format Icon Creator
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced favicon generator creating optimized icons for all devices and platforms. 
            Generates multiple sizes in PNG and ICO formats with ready-to-use HTML code for perfect website integration.
          </p>
          <p>
            <strong>Perfect for:</strong> Website development, brand identity, mobile app icons, 
            PWA development, and ensuring consistent brand presence across all devices and platforms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaviconGenerator;
