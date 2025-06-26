'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Upload, 
  Download, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Settings,
  FileImage,
  Zap,
  RotateCcw
} from 'lucide-react';

interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressionRatio: number;
  preview: string;
  name: string;
  format: string;
}

const ImageCompressor = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState('webp');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(async (file: File): Promise<CompressedImage | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          if (maintainAspectRatio) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          } else {
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressionRatio = ((file.size - blob.size) / file.size) * 100;
            const preview = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`, quality[0] / 100); // Use quality here
            
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              originalFile: file,
              originalSize: file.size,
              compressedBlob: blob,
              compressedSize: blob.size,
              compressionRatio,
              preview,
              name: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
              format: format
            });
          } else {
            resolve(null);
          }
        }, `image/${format === 'jpg' ? 'jpeg' : format}`, quality[0] / 100); // And here
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = URL.createObjectURL(file);
    });
  }, [maxWidth, maxHeight, maintainAspectRatio, quality, format]);

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    
    try {
      const newImages: CompressedImage[] = [];
      
      for (const file of files) {
        const compressed = await compressImage(file);
        if (compressed) {
          newImages.push(compressed);
        }
      }
      
      setImages(prev => [...prev, ...newImages]);
      toast.success(`Successfully compressed ${newImages.length} image(s)`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Error processing images');
    } finally {
      setIsProcessing(false);
    }
  }, [compressImage]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      processFiles(imageFiles);
    } else {
      toast.error('Please drop image files only');
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const downloadImage = useCallback((image: CompressedImage) => {
    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.name.split('.')[0]}.${image.format || format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Image downloaded successfully');
  }, [format]);

  const downloadAll = useCallback(() => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100); // Stagger downloads
    });
  }, [images, downloadImage]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast.success('Image removed');
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
    toast.success('All images cleared');
  }, []);

  const recompressAll = useCallback(async () => {
    if (images.length === 0) {
      toast.info('No images to recompress.');
      return;
    }
    const originalFiles = images.map(img => img.originalFile);
    setImages([]); // Clear current images before recompressing
    await processFiles(originalFiles);
    toast.success('All images recompressed with new settings.');
  }, [images, processFiles]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressedSize = images.reduce((acc, img) => acc + img.compressedSize, 0);
  const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="font-medium">Compression Settings</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webp">WebP (Best compression)</SelectItem>
                <SelectItem value="jpeg">JPEG (Universal)</SelectItem>
                <SelectItem value="png">PNG (Lossless)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Quality: {quality[0]}%</Label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Max Width (px)</Label>
            <Input
              type="number"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              min={100}
              max={4000}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Max Height (px)</Label>
            <Input
              type="number"
              value={maxHeight}
              onChange={(e) => setMaxHeight(Number(e.target.value))}
              min={100}
              max={4000}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={setMaintainAspectRatio}
            />
            <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="preview"
              checked={showPreview}
              onCheckedChange={setShowPreview}
            />
            <Label htmlFor="preview">Show previews</Label>
          </div>
          
          {images.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={recompressAll}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Recompress All
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="font-medium mb-2">Drop images here or click to upload</h3>
            <p className="text-sm text-muted-foreground">
              Supports JPEG, PNG, WebP, and more. Multiple files allowed.
            </p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
            <Upload className="h-4 w-4 mr-2" />
            Choose Images
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {images.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-medium text-lg">{images.length}</div>
              <div className="text-sm text-muted-foreground">Images</div>
            </div>
            <div>
              <div className="font-medium text-lg">{formatBytes(totalOriginalSize)}</div>
              <div className="text-sm text-muted-foreground">Original Size</div>
            </div>
            <div>
              <div className="font-medium text-lg">{formatBytes(totalCompressedSize)}</div>
              <div className="text-sm text-muted-foreground">Compressed Size</div>
            </div>
            <div>
              <div className="font-medium text-lg text-green-600">{totalSavings.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Size Reduction</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadAll} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download All ({images.length})
          </Button>
          <Button variant="outline" onClick={clearAll} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg p-4 space-y-3">
              {showPreview && (
                <div className="relative">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 p-1 h-auto"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  <span className="text-sm font-medium truncate">{image.name}</span>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Original:</span>
                    <span>{formatBytes(image.originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compressed:</span>
                    <span>{formatBytes(image.compressedSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savings:</span>
                    <span className="text-green-600">{image.compressionRatio.toFixed(1)}%</span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => downloadImage(image)}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isProcessing && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 animate-pulse" />
            <span>Processing images...</span>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          About Image Compression
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>WebP:</strong> Best compression with excellent quality. Supported by modern browsers.
          </p>
          <p>
            <strong>JPEG:</strong> Universal format with good compression. Best for photos.
          </p>
          <p>
            <strong>PNG:</strong> Lossless compression. Best for graphics with transparency.
          </p>
          <p className="pt-2">
            💡 <strong>Tip:</strong> For web use, try WebP format at 80% quality for the best balance of file size and image quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
