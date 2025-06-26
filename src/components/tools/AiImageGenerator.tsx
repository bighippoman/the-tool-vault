'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { 
  Image as ImageIcon,
  Download, 
  Wand2, 
  Palette, 
  Sparkles, 
  Settings, 
  Loader2,
  Trash2,
  Lock, 
  User, 
  Crown, 
  Star 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ImageSettings {
  style: string;
  dimensions: string;
  quality: string;
  mood: string;
  colorScheme: string;
  composition: string;
  lighting: string;
  enhancePrompt: boolean;
  negativePrompt: string;
}

interface GeneratedImage {
  id?: string;
  url: string;
  prompt: string;
  enhancedPrompt?: string;
  timestamp: number;
  settings?: ImageSettings;
}

const AiImageGenerator = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Image generation settings
  const [settings, setSettings] = useState<ImageSettings>({
    style: 'photorealistic',
    dimensions: '1024x1024',
    quality: 'standard',
    mood: 'neutral',
    colorScheme: 'natural',
    composition: 'balanced',
    lighting: 'natural',
    enhancePrompt: true,
    negativePrompt: ''
  });

  // Helper functions are defined before useEffect hooks that might use them.
  const loadImageHistory = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedImages: GeneratedImage[] = data.map(img => ({
        id: img.id,
        url: img.image_url,
        prompt: img.prompt,
        enhancedPrompt: img.enhanced_prompt,
        timestamp: new Date(img.created_at).getTime(),
        settings: img.settings ? img.settings as unknown as ImageSettings : undefined
      }));

      setGeneratedImages(formattedImages);
    } catch (error) {
      console.error('Error loading image history:', error);
      toast.error('Failed to load your image history');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  const saveImageToSupabase = async (image: GeneratedImage) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .insert({
          user_id: user.id,
          prompt: image.prompt,
          enhanced_prompt: image.enhancedPrompt,
          image_url: image.url,
          settings: image.settings as unknown as Json // Cast to Json for Supabase
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving image to Supabase:', error);
      toast.error('Failed to save image to your history');
    }
  };

  const deleteImageFromSupabase = async (imageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Remove from local state
      setGeneratedImages(prev => prev.filter(img => img.id !== imageId));
      
      // Clear selected image if it was deleted
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  // Load user's image history when they're authenticated
  useEffect(() => {
    if (user) {
      loadImageHistory();
    } else {
      setGeneratedImages([]);
      setSelectedImage(null);
    }
  }, [user, loadImageHistory]);

  const examplePrompts = [
    "A serene mountain landscape at sunset with a crystal-clear lake reflecting the sky",
    "A futuristic cityscape with flying cars and neon lights in cyberpunk style",
    "A cozy coffee shop interior with warm lighting and books on wooden shelves",
    "A magical forest with glowing mushrooms and fairy lights, fantasy art style",
    "An astronaut floating in space with Earth visible in the background, photorealistic",
    "A vintage bicycle with flowers in the basket on a cobblestone street in Paris"
  ];

  const artStyles = [
    { value: 'photorealistic', label: 'Photorealistic' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'oil-painting', label: 'Oil Painting' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'anime', label: 'Anime/Manga' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'sketch', label: 'Pencil Sketch' },
    { value: 'vintage', label: 'Vintage Photo' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'fantasy', label: 'Fantasy Art' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'abstract', label: 'Abstract' }
  ];

  const dimensions = [
    { value: '1024x1024', label: '1:1 Square (1024×1024)' },
    { value: '1024x1792', label: '9:16 Portrait (1024×1792)' },
    { value: '1792x1024', label: '16:9 Landscape (1792×1024)' },
    { value: '1365x1024', label: '4:3 Classic (1365×1024)' },
    { value: '1024x1365', label: '3:4 Portrait (1024×1365)' },
    { value: '1536x1024', label: '3:2 Photo (1536×1024)' },
    { value: '1024x1536', label: '2:3 Portrait (1024×1536)' }
  ];

  const moods = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'epic', label: 'Epic' },
    { value: 'whimsical', label: 'Whimsical' }
  ];

  const colorSchemes = [
    { value: 'natural', label: 'Natural Colors' },
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'muted', label: 'Muted Tones' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'warm', label: 'Warm Tones' },
    { value: 'cool', label: 'Cool Tones' },
    { value: 'pastel', label: 'Pastel Colors' },
    { value: 'neon', label: 'Neon Colors' }
  ];

  const compositions = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'rule-of-thirds', label: 'Rule of Thirds' },
    { value: 'centered', label: 'Centered' },
    { value: 'dynamic', label: 'Dynamic Angle' },
    { value: 'close-up', label: 'Close-up' },
    { value: 'wide-shot', label: 'Wide Shot' },
    { value: 'aerial', label: 'Aerial View' },
    { value: 'low-angle', label: 'Low Angle' }
  ];

  const lightingOptions = [
    { value: 'natural', label: 'Natural Light' },
    { value: 'golden-hour', label: 'Golden Hour' },
    { value: 'blue-hour', label: 'Blue Hour' },
    { value: 'studio', label: 'Studio Lighting' },
    { value: 'dramatic', label: 'Dramatic Lighting' },
    { value: 'soft', label: 'Soft Lighting' },
    { value: 'backlit', label: 'Backlit' },
    { value: 'neon', label: 'Neon Lighting' }
  ];

  const buildEnhancedPrompt = () => {
    if (!settings.enhancePrompt) return prompt;

    let enhancedPrompt = prompt;

    // Add style
    if (settings.style !== 'photorealistic') {
      enhancedPrompt += `, ${settings.style} style`;
    }

    // Add mood
    if (settings.mood !== 'neutral') {
      enhancedPrompt += `, ${settings.mood} mood`;
    }

    // Add color scheme
    if (settings.colorScheme !== 'natural') {
      enhancedPrompt += `, ${settings.colorScheme} color palette`;
    }

    // Add composition
    if (settings.composition !== 'balanced') {
      enhancedPrompt += `, ${settings.composition} composition`;
    }

    // Add lighting
    if (settings.lighting !== 'natural') {
      enhancedPrompt += `, ${settings.lighting}`;
    }

    // Add quality enhancers
    if (settings.quality === 'high') {
      enhancedPrompt += ', highly detailed, sharp focus, professional quality';
    }

    return enhancedPrompt;
  };

  const generateImage = async () => {
    if (!user) {
      toast.error('Please sign in to generate images');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate an image');
      return;
    }

    setIsGenerating(true);

    try {
      const finalPrompt = buildEnhancedPrompt();
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: finalPrompt,
          size: settings.dimensions,
          quality: settings.quality,
          negative_prompt: settings.negativePrompt || undefined
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate image');
      }
      
      const newImage: GeneratedImage = {
        url: data.imageUrl,
        prompt: prompt,
        enhancedPrompt: finalPrompt,
        timestamp: Date.now(),
        settings: { ...settings }
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
      
      // Save to Supabase
      await saveImageToSupabase(newImage);
      // Reload history to get the saved image with ID
      await loadImageHistory();
      
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `ai-generated-image-${image.timestamp}.png`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started! Check your downloads folder.');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image. You can right-click the image and save it manually.');
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show exclusive signup gate for non-authenticated users
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-amber-500" />
            <Button asChild size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity text-white font-bold text-lg py-3">
              <Link href="/auth/signup?redirect=/tool/ai-image-generator">
                <User className="mr-2 h-5 w-5" /> Sign Up for Free
              </Link>
            </Button>
            <p className="text-xl text-muted-foreground mb-6">
              Create stunning, professional-quality images with the power of AI
            </p>
          </div>
        </div>

        {/* Exclusive Feature Showcase */}
        <Card className="border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-purple-500">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-amber-500" />
                  Exclusive Premium Feature
                  <Star className="h-6 w-6 text-amber-500" />
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Join thousands of creators who use our advanced AI image generator to bring their ideas to life
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border">
                  <Sparkles className="h-8 w-8 text-purple-500 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">Advanced AI Technology</h4>
                  <p className="text-sm text-muted-foreground">
                    Powered by state-of-the-art AI models for photorealistic and artistic image generation
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border">
                  <Palette className="h-8 w-8 text-pink-500 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">Professional Customization</h4>
                  <p className="text-sm text-muted-foreground">
                    Control every aspect - style, mood, lighting, composition, and more
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border">
                  <ImageIcon className="h-8 w-8 text-blue-500 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">Personal Gallery</h4>
                  <p className="text-sm text-muted-foreground">
                    Save all your creations to your personal gallery, accessible from any device
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg border">
                  <Download className="h-8 w-8 text-green-500 mb-3 mx-auto" />
                  <h4 className="font-semibold mb-2">High-Quality Downloads</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your images in high resolution for professional use
                  </p>
                </div>
              </div>

              {/* Premium Benefits */}
              <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-lg mb-3 flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  What You Get with Your Free Account
                </h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Unlimited image generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>12+ artistic styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Multiple aspect ratios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Advanced prompt enhancement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Personal image gallery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>High-quality downloads</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold">AI Image Generator</h2>
        </div>
        <p className="text-muted-foreground">
          Create stunning images from text descriptions with advanced customization options
        </p>
      </div>

      {/* Welcome message for authenticated users */}
      <Alert className="border-green-200 dark:border-green-800">
        <User className="h-4 w-4" />
        <Link href="/auth/login?redirect=/tool/ai-image-generator" className="font-medium text-purple-600 hover:text-purple-500">
          ✨ Welcome back! You have unlimited image generation and your images are automatically saved to your gallery.
        </Link>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation Panel */}
        <div className="space-y-6">
          {/* Basic Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Image Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Describe your image</Label>
                <Textarea
                  id="prompt"
                  placeholder="A majestic eagle soaring over snow-capped mountains..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] mt-1"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label className="text-sm font-medium">Quick Examples</Label>
                {examplePrompts.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-left text-xs p-2 rounded border border-border hover:bg-accent transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Style & Aesthetics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Style & Aesthetics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Art Style</Label>
                  <Select value={settings.style} onValueChange={(value) => setSettings(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {artStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mood</Label>
                  <Select value={settings.mood} onValueChange={(value) => setSettings(prev => ({ ...prev, mood: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value}>
                          {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Color Scheme</Label>
                  <Select value={settings.colorScheme} onValueChange={(value) => setSettings(prev => ({ ...prev, colorScheme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map((scheme) => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          {scheme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Lighting</Label>
                  <Select value={settings.lighting} onValueChange={(value) => setSettings(prev => ({ ...prev, lighting: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lightingOptions.map((lighting) => (
                        <SelectItem key={lighting.value} value={lighting.value}>
                          {lighting.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Technical Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Dimensions</Label>
                  <Select value={settings.dimensions} onValueChange={(value) => setSettings(prev => ({ ...prev, dimensions: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dimensions.map((dim) => (
                        <SelectItem key={dim.value} value={dim.value}>
                          {dim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Composition</Label>
                  <Select value={settings.composition} onValueChange={(value) => setSettings(prev => ({ ...prev, composition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compositions.map((comp) => (
                        <SelectItem key={comp.value} value={comp.value}>
                          {comp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Quality</Label>
                <RadioGroup 
                  value={settings.quality} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value }))}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High Quality</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enhance-prompt">Auto-enhance prompt</Label>
                  <p className="text-xs text-muted-foreground">Automatically add style details to your prompt</p>
                </div>
                <Switch
                  id="enhance-prompt"
                  checked={settings.enhancePrompt}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enhancePrompt: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                <Input
                  id="negative-prompt"
                  placeholder="What to avoid in the image (e.g., blurry, low quality, text)"
                  value={settings.negativePrompt}
                  onChange={(e) => setSettings(prev => ({ ...prev, negativePrompt: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={generateImage} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(selectedImage)}
                      title="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {selectedImage.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImageFromSupabase(selectedImage.id!)}
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Prompt:</strong> {selectedImage.prompt}
                  </p>
                  {selectedImage.enhancedPrompt && selectedImage.enhancedPrompt !== selectedImage.prompt && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Enhanced:</strong> {selectedImage.enhancedPrompt}
                    </p>
                  )}
                  {selectedImage.settings && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Style:</strong> {selectedImage.settings.style}</p>
                      <p><strong>Dimensions:</strong> {selectedImage.settings.dimensions}</p>
                      <p><strong>Mood:</strong> {selectedImage.settings.mood}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Your generated image will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image History */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <div
                  key={image.id || index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.timestamp === image.timestamp
                      ? 'border-primary'
                      : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  {image.id && (
                    <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImageFromSupabase(image.id!);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AiImageGenerator;
