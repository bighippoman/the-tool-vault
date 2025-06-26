'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, AlertCircle, CheckCircle, Clock, Smartphone, Search, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  url: string;
  overallScore: number;
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    score: number;
  };
  seo: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    h1Count: number;
    metaTagsPresent: string[];
    score: number;
  };
  conversion: {
    ctaCount: number;
    ctaText: string[];
    formCount: number;
    trustSignals: string[];
    urgencyElements: number;
    score: number;
  };
  mobile: {
    responsive: boolean;
    viewportMeta: boolean;
    fontSizeOptimal: boolean;
    touchTargetSize: boolean;
    score: number;
  };
  issues: string[];
  recommendations: string[];
}

const LandingPageAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const mockAnalysis: AnalysisResult = {
    url: 'https://example.com',
    overallScore: 78,
    performance: {
      loadTime: 2.3,
      firstContentfulPaint: 1.2,
      largestContentfulPaint: 2.8,
      cumulativeLayoutShift: 0.05,
      score: 85
    },
    seo: {
      title: 'Amazing Landing Page - Convert More Visitors',
      titleLength: 45,
      description: 'Discover our amazing product that helps you convert more visitors into customers with proven strategies.',
      descriptionLength: 125,
      h1Count: 1,
      metaTagsPresent: ['title', 'description', 'og:title', 'og:description', 'twitter:card'],
      score: 82
    },
    conversion: {
      ctaCount: 3,
      ctaText: ['Start Free Trial', 'Get Started Now', 'Download Free Guide'],
      formCount: 1,
      trustSignals: ['Customer testimonials', 'Security badges', 'Money-back guarantee'],
      urgencyElements: 2,
      score: 75
    },
    mobile: {
      responsive: true,
      viewportMeta: true,
      fontSizeOptimal: true,
      touchTargetSize: false,
      score: 88
    },
    issues: [
      'Touch targets are too small on mobile',
      'Missing schema markup for better SEO',
      'Could benefit from more social proof',
      'Above-the-fold CTA could be more prominent'
    ],
    recommendations: [
      'Increase touch target size to at least 44px',
      'Add structured data markup for products/services',
      'Include more customer testimonials above the fold',
      'A/B test different CTA button colors and text',
      'Optimize images for faster loading',
      'Add exit-intent popup to capture leaving visitors'
    ]
  };

  const analyzeUrl = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysis({ ...mockAnalysis, url });
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete!",
      description: "Your landing page has been thoroughly analyzed",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Landing Page Performance Analyzer</h1>
        <p className="text-muted-foreground">Analyze landing pages for conversion optimization with actionable insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analyze Landing Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={analyzeUrl} 
              disabled={isAnalyzing}
              className="min-w-32"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Analyzing performance...</span>
                <span>33%</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Score</span>
                <Badge variant={getScoreBadgeVariant(analysis.overallScore)} className="text-lg px-3 py-1">
                  {analysis.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={analysis.overallScore} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Your landing page scored {analysis.overallScore} out of 100. 
                  {analysis.overallScore >= 80 ? ' Excellent performance!' : 
                   analysis.overallScore >= 60 ? ' Good, but room for improvement.' : 
                   ' Needs significant optimization.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Performance</p>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.performance.score)}`}>
                          {analysis.performance.score}
                        </div>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">SEO</p>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.seo.score)}`}>
                          {analysis.seo.score}
                        </div>
                      </div>
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.conversion.score)}`}>
                          {analysis.conversion.score}
                        </div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.mobile.score)}`}>
                          {analysis.mobile.score}
                        </div>
                      </div>
                      <Smartphone className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      Issues Found ({analysis.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.issues.map((issue, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <CheckCircle className="h-5 w-5" />
                      Recommendations ({analysis.recommendations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.slice(0, 4).map((recommendation, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Load Time</span>
                          <span className="text-sm">{analysis.performance.loadTime}s</span>
                        </div>
                        <Progress value={(5 - analysis.performance.loadTime) * 20} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: Under 3 seconds
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">First Contentful Paint</span>
                          <span className="text-sm">{analysis.performance.firstContentfulPaint}s</span>
                        </div>
                        <Progress value={(3 - analysis.performance.firstContentfulPaint) * 33.33} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: Under 1.8 seconds
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Largest Contentful Paint</span>
                          <span className="text-sm">{analysis.performance.largestContentfulPaint}s</span>
                        </div>
                        <Progress value={(4 - analysis.performance.largestContentfulPaint) * 25} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: Under 2.5 seconds
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Cumulative Layout Shift</span>
                          <span className="text-sm">{analysis.performance.cumulativeLayoutShift}</span>
                        </div>
                        <Progress value={Math.max(0, (0.1 - analysis.performance.cumulativeLayoutShift) * 1000)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: Under 0.1
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Performance Optimization Tips</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Optimize and compress images</li>
                      <li>• Minimize HTTP requests</li>
                      <li>• Enable browser caching</li>
                      <li>• Use a Content Delivery Network (CDN)</li>
                      <li>• Minimize CSS and JavaScript files</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Page Title</h4>
                        <p className="text-sm bg-muted p-2 rounded">{analysis.seo.title}</p>
                        <div className="flex justify-between text-xs mt-1">
                          <span className={analysis.seo.titleLength >= 30 && analysis.seo.titleLength <= 60 ? 'text-green-600' : 'text-amber-600'}>
                            {analysis.seo.titleLength} characters
                          </span>
                          <span>Optimal: 30-60 characters</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Meta Description</h4>
                        <p className="text-sm bg-muted p-2 rounded">{analysis.seo.description}</p>
                        <div className="flex justify-between text-xs mt-1">
                          <span className={analysis.seo.descriptionLength >= 120 && analysis.seo.descriptionLength <= 160 ? 'text-green-600' : 'text-amber-600'}>
                            {analysis.seo.descriptionLength} characters
                          </span>
                          <span>Optimal: 120-160 characters</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">H1 Tags</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysis.seo.h1Count === 1 ? 'default' : 'destructive'}>
                            {analysis.seo.h1Count} H1 tag{analysis.seo.h1Count !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {analysis.seo.h1Count === 1 ? 'Perfect!' : 'Should have exactly 1 H1 tag'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Meta Tags Present</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.seo.metaTagsPresent.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Call-to-Action Buttons</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{analysis.conversion.ctaCount} CTAs found</Badge>
                            <span className="text-sm text-muted-foreground">
                              {analysis.conversion.ctaCount >= 2 ? 'Good' : 'Consider adding more'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {analysis.conversion.ctaText.map((cta, index) => (
                              <div key={index} className="text-sm bg-muted p-2 rounded">
                                &quot;{cta}&quot;
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Forms</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysis.conversion.formCount >= 1 ? 'default' : 'secondary'}>
                            {analysis.conversion.formCount} form{analysis.conversion.formCount !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {analysis.conversion.formCount >= 1 ? 'Lead capture present' : 'No lead capture found'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Trust Signals</h4>
                        <div className="space-y-1">
                          {analysis.conversion.trustSignals.map((signal, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {signal}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Urgency Elements</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysis.conversion.urgencyElements >= 1 ? 'default' : 'secondary'}>
                            {analysis.conversion.urgencyElements} element{analysis.conversion.urgencyElements !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {analysis.conversion.urgencyElements >= 1 ? 'Creating urgency' : 'Consider adding urgency'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Responsive Design</span>
                        {analysis.mobile.responsive ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Viewport Meta Tag</span>
                        {analysis.mobile.viewportMeta ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Optimal Font Size</span>
                        {analysis.mobile.fontSizeOptimal ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Touch Target Size</span>
                        {analysis.mobile.touchTargetSize ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Mobile Optimization Checklist</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Touch targets should be at least 44px</li>
                      <li>• Font size should be at least 16px</li>
                      <li>• Avoid horizontal scrolling</li>
                      <li>• Optimize for thumb navigation</li>
                      <li>• Test on multiple devices and screen sizes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default LandingPageAnalyzer;
