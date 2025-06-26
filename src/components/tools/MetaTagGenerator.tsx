"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Copy, Download, Search, Share, AlertCircle, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  robots: string;
  viewport: string;
  charset: string;
  language: string;
}

const MetaTagGenerator = () => {
  const [metaData, setMetaData] = useState<MetaData>({
    title: 'Your Amazing Website Title',
    description: 'Discover amazing content and services on our website. We provide high-quality solutions for your business needs.',
    keywords: 'website, business, solutions, services',
    author: 'Your Name',
    canonical: 'https://example.com',
    ogTitle: '',
    ogDescription: '',
    ogImage: 'https://example.com/og-image.jpg',
    ogUrl: 'https://example.com',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: 'https://example.com/twitter-image.jpg',
    twitterSite: '@yoursite',
    twitterCreator: '@yourcreator',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    language: 'en'
  });

  const [autoSync, setAutoSync] = useState(true);
  const [activePreview, setActivePreview] = useState<'google' | 'facebook' | 'twitter'>('google');

  const ogTypes = [
    'website', 'article', 'book', 'profile', 'music.song', 'music.album', 
    'music.playlist', 'music.radio_station', 'video.movie', 'video.episode', 
    'video.tv_show', 'video.other'
  ];

  const twitterCardTypes = [
    'summary', 'summary_large_image', 'app', 'player'
  ];

  const robotsOptions = [
    'index, follow',
    'index, nofollow',
    'noindex, follow',
    'noindex, nofollow',
    'all',
    'none'
  ];

  // Auto-sync Open Graph and Twitter data with basic meta data
  const updateMetaField = (field: keyof MetaData, value: string) => {
    setMetaData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (autoSync) {
        if (field === 'title') {
          updated.ogTitle = updated.ogTitle || value;
          updated.twitterTitle = updated.twitterTitle || value;
        }
        if (field === 'description') {
          updated.ogDescription = updated.ogDescription || value;
          updated.twitterDescription = updated.twitterDescription || value;
        }
      }
      
      return updated;
    });
  };

  const generateMetaTags = () => {
    const tags = [];

    // Basic Meta Tags
    tags.push(`<meta charset="${metaData.charset}">`);
    tags.push(`<meta name="viewport" content="${metaData.viewport}">`);
    tags.push(`<meta name="language" content="${metaData.language}">`);
    tags.push(`<title>${metaData.title}</title>`);
    tags.push(`<meta name="description" content="${metaData.description}">`);
    
    if (metaData.keywords) {
      tags.push(`<meta name="keywords" content="${metaData.keywords}">`);
    }
    
    if (metaData.author) {
      tags.push(`<meta name="author" content="${metaData.author}">`);
    }
    
    if (metaData.canonical) {
      tags.push(`<link rel="canonical" href="${metaData.canonical}">`);
    }
    
    tags.push(`<meta name="robots" content="${metaData.robots}">`);

    // Open Graph Tags
    tags.push('');
    tags.push('<!-- Open Graph Meta Tags -->');
    tags.push(`<meta property="og:title" content="${metaData.ogTitle || metaData.title}">`);
    tags.push(`<meta property="og:description" content="${metaData.ogDescription || metaData.description}">`);
    tags.push(`<meta property="og:type" content="${metaData.ogType}">`);
    tags.push(`<meta property="og:url" content="${metaData.ogUrl}">`);
    
    if (metaData.ogImage) {
      tags.push(`<meta property="og:image" content="${metaData.ogImage}">`);
      tags.push(`<meta property="og:image:alt" content="${metaData.ogTitle || metaData.title}">`);
    }

    // Twitter Card Tags
    tags.push('');
    tags.push('<!-- Twitter Card Meta Tags -->');
    tags.push(`<meta name="twitter:card" content="${metaData.twitterCard}">`);
    tags.push(`<meta name="twitter:title" content="${metaData.twitterTitle || metaData.title}">`);
    tags.push(`<meta name="twitter:description" content="${metaData.twitterDescription || metaData.description}">`);
    
    if (metaData.twitterImage) {
      tags.push(`<meta name="twitter:image" content="${metaData.twitterImage}">`);
    }
    
    if (metaData.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${metaData.twitterSite}">`);
    }
    
    if (metaData.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${metaData.twitterCreator}">`);
    }

    return tags.join('\n');
  };

  const analyzeMetaTags = () => {
    const issues = [];
    const suggestions = [];

    // Title analysis
    if (!metaData.title) {
      issues.push('Title is required');
    } else if (metaData.title.length < 30) {
      suggestions.push('Consider a longer title (30-60 characters)');
    } else if (metaData.title.length > 60) {
      issues.push('Title is too long (should be under 60 characters)');
    }

    // Description analysis
    if (!metaData.description) {
      issues.push('Meta description is required');
    } else if (metaData.description.length < 120) {
      suggestions.push('Consider a longer description (120-160 characters)');
    } else if (metaData.description.length > 160) {
      issues.push('Description is too long (should be under 160 characters)');
    }

    // Image analysis
    if (!metaData.ogImage) {
      suggestions.push('Add an Open Graph image for better social sharing');
    }

    if (!metaData.twitterImage) {
      suggestions.push('Add a Twitter image for better social sharing');
    }

    // Canonical URL
    if (!metaData.canonical) {
      suggestions.push('Add a canonical URL to prevent duplicate content issues');
    }

    return { issues, suggestions };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMetaTags());
    toast.success("Meta tags copied to clipboard");
  };

  const downloadHTML = () => {
    const html = generateMetaTags();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Meta tags HTML file downloaded");
  };

  const { issues, suggestions } = analyzeMetaTags();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">SEO Meta Tags Generator</h1>
        <p className="text-muted-foreground">Generate optimized meta tags, Open Graph, and Twitter Cards for maximum SEO impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Basic SEO Meta Tags
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setAutoSync(true)}
                    >
                      Auto-sync
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={metaData.title}
                    onChange={(e) => updateMetaField('title', e.target.value)}
                    placeholder="Your Amazing Website Title"
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{metaData.title.length} characters</span>
                    <span className={metaData.title.length > 60 ? 'text-destructive' : metaData.title.length < 30 ? 'text-amber-600' : 'text-green-600'}>
                      Recommended: 30-60 characters
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Meta Description *</Label>
                  <Textarea
                    id="description"
                    value={metaData.description}
                    onChange={(e) => updateMetaField('description', e.target.value)}
                    placeholder="A compelling description of your page content..."
                    rows={3}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{metaData.description.length} characters</span>
                    <span className={metaData.description.length > 160 ? 'text-destructive' : metaData.description.length < 120 ? 'text-amber-600' : 'text-green-600'}>
                      Recommended: 120-160 characters
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    value={metaData.keywords}
                    onChange={(e) => updateMetaField('keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={metaData.author}
                      onChange={(e) => updateMetaField('author', e.target.value)}
                      placeholder="Your Name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      value={metaData.canonical}
                      onChange={(e) => updateMetaField('canonical', e.target.value)}
                      placeholder="https://example.com"
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Open Graph Meta Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="og-title">OG Title</Label>
                  <Input
                    id="og-title"
                    value={metaData.ogTitle}
                    onChange={(e) => updateMetaField('ogTitle', e.target.value)}
                    placeholder="Leave empty to use page title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="og-description">OG Description</Label>
                  <Textarea
                    id="og-description"
                    value={metaData.ogDescription}
                    onChange={(e) => updateMetaField('ogDescription', e.target.value)}
                    placeholder="Leave empty to use meta description"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="og-type">OG Type</Label>
                    <Select value={metaData.ogType} onValueChange={(value) => updateMetaField('ogType', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select OG type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ogTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="og-url">OG URL</Label>
                    <Input
                      id="og-url"
                      value={metaData.ogUrl}
                      onChange={(e) => updateMetaField('ogUrl', e.target.value)}
                      placeholder="https://example.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="og-image">OG Image URL</Label>
                  <Input
                    id="og-image"
                    value={metaData.ogImage}
                    onChange={(e) => updateMetaField('ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1200x630 pixels
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Twitter Card Meta Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitter-card">Twitter Card Type</Label>
                  <Select value={metaData.twitterCard} onValueChange={(value) => updateMetaField('twitterCard', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {twitterCardTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="twitter-title">Twitter Title</Label>
                  <Input
                    id="twitter-title"
                    value={metaData.twitterTitle}
                    onChange={(e) => updateMetaField('twitterTitle', e.target.value)}
                    placeholder="Leave empty to use page title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter-description">Twitter Description</Label>
                  <Textarea
                    id="twitter-description"
                    value={metaData.twitterDescription}
                    onChange={(e) => updateMetaField('twitterDescription', e.target.value)}
                    placeholder="Leave empty to use meta description"
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter-image">Twitter Image URL</Label>
                  <Input
                    id="twitter-image"
                    value={metaData.twitterImage}
                    onChange={(e) => updateMetaField('twitterImage', e.target.value)}
                    placeholder="https://example.com/twitter-image.jpg"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1200x675 pixels for large image cards
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitter-site">Twitter Site Handle</Label>
                    <Input
                      id="twitter-site"
                      value={metaData.twitterSite}
                      onChange={(e) => updateMetaField('twitterSite', e.target.value)}
                      placeholder="@yoursite"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter-creator">Twitter Creator Handle</Label>
                    <Input
                      id="twitter-creator"
                      value={metaData.twitterCreator}
                      onChange={(e) => updateMetaField('twitterCreator', e.target.value)}
                      placeholder="@yourcreator"
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="robots">Robots</Label>
                    <Select value={metaData.robots} onValueChange={(value) => updateMetaField('robots', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select robots option" />
                      </SelectTrigger>
                      <SelectContent>
                        {robotsOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={metaData.language}
                      onChange={(e) => updateMetaField('language', e.target.value)}
                      placeholder="en"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="viewport">Viewport</Label>
                  <Input
                    id="viewport"
                    value={metaData.viewport}
                    onChange={(e) => updateMetaField('viewport', e.target.value)}
                    placeholder="width=device-width, initial-scale=1.0"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="charset">Character Set</Label>
                  <Input
                    id="charset"
                    value={metaData.charset}
                    onChange={(e) => updateMetaField('charset', e.target.value)}
                    placeholder="UTF-8"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview and Analysis Panel */}
        <div className="space-y-6">
          {/* SEO Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Issues ({issues.length})
                  </h4>
                  <ul className="space-y-1">
                    {issues.map((issue, index) => (
                      <li key={index} className="text-sm text-destructive">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Suggestions ({suggestions.length})
                  </h4>
                  <ul className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-amber-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {issues.length === 0 && suggestions.length === 0 && (
                <div className="text-center text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Perfect!</p>
                  <p className="text-sm">Your meta tags look great</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Social Preview</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={activePreview === 'google' ? 'default' : 'outline'}
                    onClick={() => setActivePreview('google')}
                  >
                    Google
                  </Button>
                  <Button
                    size="sm"
                    variant={activePreview === 'facebook' ? 'default' : 'outline'}
                    onClick={() => setActivePreview('facebook')}
                  >
                    Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant={activePreview === 'twitter' ? 'default' : 'outline'}
                    onClick={() => setActivePreview('twitter')}
                  >
                    Twitter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activePreview === 'google' && (
                <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                  <div className="text-sm text-green-600">{metaData.canonical || 'https://example.com'}</div>
                  <div className="text-lg font-medium text-blue-600 hover:underline cursor-pointer">
                    {metaData.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metaData.description}
                  </div>
                </div>
              )}

              {activePreview === 'facebook' && (
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  {metaData.ogImage && (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Image 
                        src={metaData.ogImage} 
                        alt="OG Preview"
                        width={1200}
                        height={630}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-500">
                        Image Preview
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground uppercase">
                      {new URL(metaData.ogUrl || metaData.canonical || 'https://example.com').hostname}
                    </div>
                    <div className="font-medium text-sm mt-1">
                      {metaData.ogTitle || metaData.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {metaData.ogDescription || metaData.description}
                    </div>
                  </div>
                </div>
              )}

              {activePreview === 'twitter' && (
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  {metaData.twitterImage && metaData.twitterCard === 'summary_large_image' && (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Image 
                        src={metaData.twitterImage} 
                        alt="Twitter Preview"
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-500">
                        Twitter Image
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="font-medium text-sm">
                      {metaData.twitterTitle || metaData.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {metaData.twitterDescription || metaData.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new URL(metaData.ogUrl || metaData.canonical || 'https://example.com').hostname}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Meta Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <pre className="text-xs overflow-auto max-h-96">
                  <code>{generateMetaTags()}</code>
                </pre>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={copyToClipboard} size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button onClick={downloadHTML} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MetaTagGenerator;
