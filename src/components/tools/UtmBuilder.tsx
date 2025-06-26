'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, Copy, Download, BarChart, ExternalLink, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

interface SavedUTM {
  id: string;
  name: string;
  url: string;
  finalUrl: string;
  params: UTMParams;
  createdAt: string;
  clicks?: number;
}

const UtmBuilder = () => {
  const [utmParams, setUtmParams] = useState<UTMParams>({
    url: 'https://example.com',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });

  const [savedUTMs, setSavedUTMs] = useState<SavedUTM[]>([
    {
      id: '1',
      name: 'Summer Campaign - Facebook',
      url: 'https://example.com',
      finalUrl: 'https://example.com?utm_source=facebook&utm_medium=social&utm_campaign=summer2024',
      params: {
        url: 'https://example.com',
        source: 'facebook',
        medium: 'social',
        campaign: 'summer2024',
        term: '',
        content: ''
      },
      createdAt: '2024-01-15',
      clicks: 1250
    }
  ]);

  const [campaignName, setCampaignName] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const { toast } = useToast();

  const presetCombinations = [
    { name: 'Google Ads', source: 'google', medium: 'cpc', icon: '🎯' },
    { name: 'Facebook Ads', source: 'facebook', medium: 'social', icon: '📘' },
    { name: 'Instagram', source: 'instagram', medium: 'social', icon: '📸' },
    { name: 'LinkedIn', source: 'linkedin', medium: 'social', icon: '💼' },
    { name: 'Twitter/X', source: 'twitter', medium: 'social', icon: '🐦' },
    { name: 'Email Newsletter', source: 'newsletter', medium: 'email', icon: '📧' },
    { name: 'YouTube', source: 'youtube', medium: 'video', icon: '📺' },
    { name: 'Blog Post', source: 'blog', medium: 'referral', icon: '✍️' },
    { name: 'Banner Ad', source: 'website', medium: 'banner', icon: '🖼️' },
    { name: 'Affiliate', source: 'affiliate', medium: 'referral', icon: '🤝' }
  ];

  const generateUTMUrl = (params: UTMParams = utmParams): string => {
    if (!params.url) return '';
    
    const url = new URL(params.url);
    const searchParams = new URLSearchParams();
    
    if (params.source) searchParams.set('utm_source', params.source);
    if (params.medium) searchParams.set('utm_medium', params.medium);
    if (params.campaign) searchParams.set('utm_campaign', params.campaign);
    if (params.term) searchParams.set('utm_term', params.term);
    if (params.content) searchParams.set('utm_content', params.content);
    
    const existingParams = url.searchParams;
    searchParams.forEach((value, key) => {
      existingParams.set(key, value);
    });
    
    return url.toString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "UTM URL copied to clipboard",
    });
  };

  const saveUTM = () => {
    if (!utmParams.url || !utmParams.source || !utmParams.medium || !utmParams.campaign) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in URL, Source, Medium, and Campaign fields",
        variant: "destructive"
      });
      return;
    }

    const newUTM: SavedUTM = {
      id: Date.now().toString(),
      name: campaignName || `${utmParams.source} - ${utmParams.campaign}`,
      url: utmParams.url,
      finalUrl: generateUTMUrl(),
      params: utmParams,
      createdAt: new Date().toISOString().split('T')[0],
      clicks: 0
    };

    setSavedUTMs(prev => [newUTM, ...prev]);
    setCampaignName('');
    
    toast({
      title: "UTM Saved!",
      description: "Your UTM campaign has been saved successfully",
    });
  };

  const deleteUTM = (id: string) => {
    setSavedUTMs(prev => prev.filter(utm => utm.id !== id));
    toast({
      title: "UTM Deleted",
      description: "Campaign has been removed from your saved list",
    });
  };

  const applyPreset = (preset: typeof presetCombinations[0]) => {
    setUtmParams(prev => ({
      ...prev,
      source: preset.source,
      medium: preset.medium
    }));
  };

  const processBulkUrls = () => {
    if (!bulkUrls.trim() || !utmParams.source || !utmParams.medium || !utmParams.campaign) {
      toast({
        title: "Missing Information",
        description: "Please provide URLs and complete UTM parameters",
        variant: "destructive"
      });
      return;
    }

    const urls = bulkUrls.split('\n').filter(url => url.trim());
    const results = urls.map(url => ({
      original: url.trim(),
      utm: generateUTMUrl({ ...utmParams, url: url.trim() })
    }));

    const resultText = results.map(r => `${r.original} → ${r.utm}`).join('\n');
    copyToClipboard(resultText);
    
    toast({
      title: "Bulk URLs Processed!",
      description: `${results.length} URLs with UTM parameters copied to clipboard`,
    });
  };

  const downloadCSV = () => {
    const csvContent = [
      'Campaign Name,Original URL,UTM URL,Source,Medium,Campaign,Term,Content,Created Date,Clicks',
      ...savedUTMs.map(utm => 
        `"${utm.name}","${utm.url}","${utm.finalUrl}","${utm.params.source}","${utm.params.medium}","${utm.params.campaign}","${utm.params.term}","${utm.params.content}","${utm.createdAt}","${utm.clicks || 0}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-campaigns.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Downloaded!",
      description: "Your UTM campaigns have been exported",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced UTM Campaign Builder</h1>
        <p className="text-muted-foreground">Build, track, and analyze UTM parameters for precise campaign attribution</p>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder">UTM Builder</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* UTM Builder Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name (Optional)</Label>
                    <Input
                      id="campaign-name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Summer 2024 - Social Media Campaign"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website-url">Website URL *</Label>
                    <Input
                      id="website-url"
                      type="url"
                      value={utmParams.url}
                      onChange={(e) => setUtmParams(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="utm-source">Campaign Source *</Label>
                      <Input
                        id="utm-source"
                        value={utmParams.source}
                        onChange={(e) => setUtmParams(prev => ({ ...prev, source: e.target.value }))}
                        placeholder="google, facebook, newsletter"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="utm-medium">Campaign Medium *</Label>
                      <Input
                        id="utm-medium"
                        value={utmParams.medium}
                        onChange={(e) => setUtmParams(prev => ({ ...prev, medium: e.target.value }))}
                        placeholder="cpc, social, email"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="utm-campaign">Campaign Name *</Label>
                    <Input
                      id="utm-campaign"
                      value={utmParams.campaign}
                      onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                      placeholder="summer_sale_2024"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="utm-term">Campaign Term (Optional)</Label>
                      <Input
                        id="utm-term"
                        value={utmParams.term}
                        onChange={(e) => setUtmParams(prev => ({ ...prev, term: e.target.value }))}
                        placeholder="running+shoes"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="utm-content">Campaign Content (Optional)</Label>
                      <Input
                        id="utm-content"
                        value={utmParams.content}
                        onChange={(e) => setUtmParams(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="logolink, textlink"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {presetCombinations.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="h-auto p-3 flex flex-col gap-1"
                      >
                        <span className="text-lg">{preset.icon}</span>
                        <span className="text-xs text-center">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated URL Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated UTM URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm break-all">
                      {generateUTMUrl() || 'Enter URL and UTM parameters to generate link'}
                    </p>
                  </div>
                  
                  {generateUTMUrl() && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => copyToClipboard(generateUTMUrl())}
                        className="w-full"
                        size="sm"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                      <Button 
                        onClick={() => window.open(generateUTMUrl(), '_blank')}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Test URL
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>UTM Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <Badge variant="secondary">{utmParams.source || 'Not set'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium:</span>
                      <Badge variant="secondary">{utmParams.medium || 'Not set'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Campaign:</span>
                      <Badge variant="secondary">{utmParams.campaign || 'Not set'}</Badge>
                    </div>
                    {utmParams.term && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Term:</span>
                        <Badge variant="outline">{utmParams.term}</Badge>
                      </div>
                    )}
                    {utmParams.content && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Content:</span>
                        <Badge variant="outline">{utmParams.content}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveUTM} className="w-full" size="lg">
                Save Campaign
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk UTM Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulk-urls">URLs (one per line)</Label>
                <Textarea
                  id="bulk-urls"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder={`https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3`}
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bulk-source">Source</Label>
                  <Input
                    id="bulk-source"
                    value={utmParams.source}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="facebook"
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-medium">Medium</Label>
                  <Input
                    id="bulk-medium"
                    value={utmParams.medium}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, medium: e.target.value }))}
                    placeholder="social"
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-campaign">Campaign</Label>
                  <Input
                    id="bulk-campaign"
                    value={utmParams.campaign}
                    onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                    placeholder="summer2024"
                  />
                </div>
              </div>

              <Button onClick={processBulkUrls} className="w-full">
                Generate Bulk UTM URLs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Saved Campaigns ({savedUTMs.length})</h3>
            <Button onClick={downloadCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {savedUTMs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">No Saved Campaigns</h3>
                <p className="text-muted-foreground">Create your first UTM campaign to track performance!</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Source/Medium</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedUTMs.map((utm) => (
                      <TableRow key={utm.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{utm.name}</div>
                            <div className="text-sm text-muted-foreground">{utm.params.campaign}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-xs">{utm.params.source}</Badge>
                            <Badge variant="outline" className="text-xs">{utm.params.medium}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">{utm.url}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{utm.clicks || 0}</div>
                            <div className="text-xs text-muted-foreground">clicks</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {utm.createdAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(utm.finalUrl)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(utm.finalUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteUTM(utm.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">12.5K</div>
                  <div className="text-sm text-muted-foreground">Total Clicks</div>
                  <div className="text-xs text-green-600">+23% from last month</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-sm text-muted-foreground">Active Campaigns</div>
                  <div className="text-xs text-blue-600">Across 8 platforms</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">3.2%</div>
                  <div className="text-sm text-muted-foreground">Avg. CTR</div>
                  <div className="text-xs text-green-600">+0.5% improvement</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold">$2.35</div>
                  <div className="text-sm text-muted-foreground">Cost per Click</div>
                  <div className="text-xs text-red-600">-$0.15 from last month</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: 'Google Ads', clicks: 4250, percentage: 34 },
                    { source: 'Facebook', clicks: 3100, percentage: 25 },
                    { source: 'Email', clicks: 2800, percentage: 22 },
                    { source: 'LinkedIn', clicks: 1200, percentage: 10 },
                    { source: 'Twitter', clicks: 1150, percentage: 9 }
                  ].map((item) => (
                    <div key={item.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <span className="font-medium">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.clicks.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-green-700">Best Performing Medium</h4>
                    <p className="text-sm text-muted-foreground">Social media campaigns show 28% higher engagement</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-blue-700">UTM Naming Convention</h4>
                    <p className="text-sm text-muted-foreground">Use consistent naming for better tracking and analysis</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h4 className="font-medium text-amber-700">A/B Testing</h4>
                    <p className="text-sm text-muted-foreground">Test different UTM content values to optimize performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtmBuilder;
