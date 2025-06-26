"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, BookOpen, X, Plus, RefreshCw, Eye, BarChart3, Copy, Clock, AlertTriangle, Scale, Users, Shield, Building, Database, UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  id: string;
  url?: string;
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  riskFactors: string[];
  userRights: string[];
  companyRights: string[];
  dataHandling: {
    collection: string;
    usage: string;
    sharing: string;
    retention: string;
  };
  terminationClauses: string[];
  changePolicy: string;
  disputeResolution: string;
  riskScore: number;
  readingTime: number;
  documentType: string;
  totalClauses: number;
  recommendations: string[];
}

const TermsAnalyzer = () => {
  const [inputMethod, setInputMethod] = useState<'text' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<string>('');
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  const addUrl = () => {
    setUrls([...urls, '']);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const analyzeWithAI = async (text: string, title: string): Promise<AnalysisResult> => {
    try {
      console.log('Starting comprehensive analysis for:', title);
      console.log('Text length:', text.length);
      
      const { data } = await supabase.functions.invoke('analyze-terms', {
        body: { text, title }
      });

      console.log('Supabase response:', { data });

      if (!data) {
        throw new Error('No data received from analysis service');
      }

      console.log('Comprehensive analysis successful:', data);
      return data;
    } catch {
      throw new Error('Analysis failed. Please try again.');
    }
  };

  const fetchUrlContent = async (url: string): Promise<string> => {
    try {
      toast.info('Note: URL fetching is simulated in this demo');
      
      const domain = new URL(url).hostname;
      if (domain.includes('google')) {
        return `Google Terms of Service: We collect information you provide directly to us, such as when you create an account. We may collect device information including logs, referrer data, and location data. We may share your information with third parties for advertising purposes. You are responsible for your conduct and any content you provide. We may terminate your account for any reason. These terms may be updated at any time without notice. You grant us a worldwide, royalty-free license to use your content. We disclaim all warranties and limit our liability. These terms are governed by California law.`;
      } else if (domain.includes('facebook') || domain.includes('meta')) {
        return `Facebook/Meta Terms: By using our service, you agree to these terms. We collect extensive data about your activities, connections, and interests. We use this data for targeted advertising and may share it with advertisers. You grant us an irrevocable, transferable license to your content. We may use your name and profile picture in ads. Account termination can occur without warning. We reserve the right to modify these terms at any time. You waive your right to participate in class action lawsuits. All disputes must be resolved through binding arbitration.`;
      } else {
        return `Sample Terms of Service: We collect your personal information including email addresses, usage data, and device information. This information may be shared with third-party vendors and advertising partners. You are solely responsible for any damages resulting from your use of our service. We reserve the right to terminate your account at our discretion without prior notice. These terms are subject to change without notification. By continuing to use our service, you agree to any modifications. You grant us a perpetual, irrevocable license to use any content you upload. We disclaim all warranties and our liability is limited to the amount you paid us.`;
      }
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
  };

  const analyzeDocument = async () => {
    if (!inputText.trim() && inputMethod === 'text') {
      toast.error('Please enter text to analyze');
      return;
    }

    if (inputMethod === 'url' && !urls.some(url => url.trim())) {
      toast.error('Please enter at least one URL');
      return;
    }

    setAnalyzing(true);
    
    try {
      if (inputMethod === 'text') {
        toast.info('Performing comprehensive AI analysis...');
        const result = await analyzeWithAI(inputText, 'Pasted Document');
        setResults([result]);
        setSelectedResult(result.id);
        toast.success('Comprehensive analysis complete!');
      } else {
        const validUrls = urls.filter(url => url.trim());
        const newResults: AnalysisResult[] = [];

        for (const url of validUrls) {
          try {
            toast.info(`Fetching content from ${new URL(url).hostname}...`);
            const content = await fetchUrlContent(url);
            
            toast.info(`Performing comprehensive analysis of ${new URL(url).hostname}...`);
            const result = await analyzeWithAI(content, new URL(url).hostname);
            result.url = url;
            newResults.push(result);
          } catch {
            console.error(`Failed to analyze ${url}`);
            toast.error(`Failed to analyze ${url}`);
          }
        }

        if (newResults.length > 0) {
          setResults(newResults);
          setSelectedResult(newResults[0].id);
          toast.success(`Successfully completed comprehensive analysis of ${newResults.length} document(s)!`);
        } else {
          throw new Error('Failed to analyze any of the provided URLs');
        }
      }
    } catch {
      console.error('Analysis failed');
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 76) return 'bg-red-100 text-red-900 border-red-300 dark:bg-red-900 dark:text-red-100';
    if (score >= 51) return 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900 dark:text-orange-100';
    if (score >= 26) return 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-green-100 text-green-900 border-green-300 dark:bg-green-900 dark:text-green-100';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 76) return 'High Risk';
    if (score >= 51) return 'Medium Risk';
    if (score >= 26) return 'Low Risk';
    return 'Minimal Risk';
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success('Copied to clipboard!'))
        .catch(() => toast.error('Failed to copy to clipboard'));
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success('Copied to clipboard!');
        } else {
          toast.error('Failed to copy to clipboard');
        }
      } catch {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const currentResult = results.find(r => r.id === selectedResult);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Comprehensive Terms Analyzer</h2>
        <p className="text-muted-foreground">
          Get detailed, expert-level analysis of legal documents with comprehensive breakdowns and actionable insights
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label>Input Method:</Label>
            <Select value={inputMethod} onValueChange={(value: 'text' | 'url') => setInputMethod(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Paste Text</SelectItem>
                <SelectItem value="url">URLs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inputMethod === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="input-text">Paste your Terms of Service, Privacy Policy, or EULA:</Label>
              <Textarea
                id="input-text"
                placeholder="Paste the legal document text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                className={dyslexiaMode ? 'font-mono' : ''}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Document URLs:</Label>
              {urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="https://example.com/terms"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    className="flex-1"
                  />
                  {urls.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addUrl}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another URL
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dyslexia-mode"
                checked={dyslexiaMode}
                onCheckedChange={setDyslexiaMode}
              />
              <Label htmlFor="dyslexia-mode">Dyslexia-friendly font</Label>
            </div>
            
            <Button 
              onClick={analyzeDocument} 
              disabled={analyzing}
              className="btn-mobile-friendly"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                  <span className="sm:hidden">Analyzing</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Comprehensive Analysis</span>
                  <span className="sm:hidden">Analyze</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          {/* Document Selector */}
          {results.length > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Label>Select Document:</Label>
                  <Select value={selectedResult} onValueChange={setSelectedResult}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {results.map((result) => (
                        <SelectItem key={result.id} value={result.id}>
                          {result.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentResult && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Analysis Overview
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${currentResult.summary}\n\nKey Points:\n${currentResult.keyPoints?.map(point => `• ${point}`).join('\n') || 'No key points available'}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">Reading Time</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{currentResult.readingTime || 0} min</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg text-center ${getRiskColor(currentResult.riskScore || 0)}`}>
                      <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">Risk Level</p>
                      <p className="text-xl font-bold">{getRiskLabel(currentResult.riskScore || 0)}</p>
                      <p className="text-xs">({currentResult.riskScore || 0}%)</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-center">
                      <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-green-700 dark:text-green-300">Document Type</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{currentResult.documentType || 'Unknown'}</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg text-center">
                      <Scale className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-purple-700 dark:text-purple-300">Total Clauses</p>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{currentResult.totalClauses || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className={`text-foreground leading-relaxed ${dyslexiaMode ? 'font-mono' : ''}`}>
                      {currentResult.summary || 'No summary available'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Points */}
              {currentResult.keyPoints && currentResult.keyPoints.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Points You Should Know</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentResult.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-background border rounded-lg">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <span className={`flex-1 ${dyslexiaMode ? 'font-mono' : ''}`}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Factors */}
              {currentResult.riskFactors && currentResult.riskFactors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Factors & Concerns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentResult.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <span className={`flex-1 text-red-900 dark:text-red-100 ${dyslexiaMode ? 'font-mono' : ''}`}>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rights Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Users className="h-5 w-5" />
                      Your Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentResult.userRights && currentResult.userRights.length > 0 ? (
                        currentResult.userRights.map((right, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                            <Shield className="h-4 w-4 text-green-600 mt-1" />
                            <span className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{right}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No specific user rights outlined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <Building className="h-5 w-5" />
                      Company Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentResult.companyRights && currentResult.companyRights.length > 0 ? (
                        currentResult.companyRights.map((right, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                            <Building className="h-4 w-4 text-orange-600 mt-1" />
                            <span className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{right}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No specific company rights outlined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Handling */}
              {currentResult.dataHandling && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Handling Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Data Collection</h4>
                          <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.dataHandling.collection || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Data Usage</h4>
                          <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.dataHandling.usage || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Data Sharing</h4>
                          <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.dataHandling.sharing || 'Not specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Data Retention</h4>
                          <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.dataHandling.retention || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserX className="h-5 w-5" />
                      Termination Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentResult.terminationClauses && currentResult.terminationClauses.length > 0 ? (
                        currentResult.terminationClauses.map((clause, index) => (
                          <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                            <span className={dyslexiaMode ? 'font-mono' : ''}>{clause}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">No specific termination conditions outlined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Legal Framework
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Terms Modification</h4>
                      <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.changePolicy || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Dispute Resolution</h4>
                      <p className={`text-sm ${dyslexiaMode ? 'font-mono' : ''}`}>{currentResult.disputeResolution || 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {currentResult.recommendations && currentResult.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <BookOpen className="h-5 w-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <span className={`flex-1 text-blue-900 dark:text-blue-100 ${dyslexiaMode ? 'font-mono' : ''}`}>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {results.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Ready for Comprehensive Analysis</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Paste a legal document or enter URLs above to get started with detailed AI-powered analysis including risk assessment, rights breakdown, and actionable recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TermsAnalyzer;
