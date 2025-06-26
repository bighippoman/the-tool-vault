"use client";

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, Percent, AlertTriangle, Award, Lightbulb, Info, BookOpen, CheckCircle, HelpCircle, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentData {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  timeHorizon: number;
  taxRate: number;
  inflationRate: number;
  contributionFrequency: 'monthly' | 'quarterly' | 'annually';
  investmentType: 'stocks' | 'bonds' | 'mixed' | 'crypto' | 'reits';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface CalculationResult {
  finalValue: number;
  totalContributions: number;
  totalReturns: number;
  realValue: number;
  afterTaxValue: number;
  yearlyData: Array<{
    year: number;
    balance: number;
    contributions: number;
    returns: number;
    realValue: number;
  }>;
}

const InvestmentCalculator = () => {
  const { toast } = useToast();
  const [data, setData] = useState<InvestmentData>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturn: 7,
    timeHorizon: 30,
    taxRate: 15,
    inflationRate: 2.5,
    contributionFrequency: 'monthly',
    investmentType: 'mixed',
    riskTolerance: 'moderate'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate investment projections
  const calculations = useMemo((): CalculationResult => {
    const contributionsPerYear = data.contributionFrequency === 'monthly' ? 12 : 
                                 data.contributionFrequency === 'quarterly' ? 4 : 1;
    const contributionAmount = data.monthlyContribution * (12 / contributionsPerYear);
    
    let balance = data.initialInvestment;
    let totalContributions = data.initialInvestment;
    const yearlyData = [];

    for (let year = 1; year <= data.timeHorizon; year++) {
      const yearContributions = contributionAmount * contributionsPerYear;
      
      // Calculate compound growth
      for (let i = 0; i < contributionsPerYear; i++) {
        balance = balance * (1 + data.annualReturn / 100 / contributionsPerYear) + contributionAmount;
      }
      
      totalContributions += yearContributions;
      const returns = balance - totalContributions;
      const realValue = balance / Math.pow(1 + data.inflationRate / 100, year);
      
      yearlyData.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        returns: Math.round(returns),
        realValue: Math.round(realValue)
      });
    }

    const finalValue = balance;
    const totalReturns = finalValue - totalContributions;
    const realValue = finalValue / Math.pow(1 + data.inflationRate / 100, data.timeHorizon);
    const afterTaxValue = finalValue - (totalReturns * data.taxRate / 100);

    return {
      finalValue,
      totalContributions,
      totalReturns,
      realValue,
      afterTaxValue,
      yearlyData
    };
  }, [data]);

  // AI-powered investment insights
  const getInvestmentInsights = useMemo(() => {
    const insights = [];
    
    if (data.annualReturn > 10) {
      insights.push({
        type: 'warning',
        title: 'High Return Assumption',
        message: `Your ${data.annualReturn}% expected return is quite optimistic. Historical stock market average is around 7-10%.`
      });
    }
    
    if (data.monthlyContribution / (data.initialInvestment || 1) > 12) {
      insights.push({
        type: 'positive',
        title: 'Excellent Contribution Habit',
        message: 'Your monthly contributions are substantial relative to your initial investment. This will significantly boost your returns!'
      });
    }
    
    if (data.timeHorizon > 20 && data.riskTolerance === 'conservative') {
      insights.push({
        type: 'suggestion',
        title: 'Consider Higher Risk Tolerance',
        message: 'With a 20+ year horizon, you might benefit from a more aggressive portfolio allocation.'
      });
    }

    if (calculations.realValue / calculations.finalValue < 0.6) {
      insights.push({
        type: 'warning',
        title: 'Inflation Impact',
        message: `Inflation will significantly erode your purchasing power. Your real value will be ${((calculations.realValue / calculations.finalValue) * 100).toFixed(1)}% of nominal value.`
      });
    }

    return insights;
  }, [data, calculations]);

  // Risk assessment
  const getRiskMetrics = () => {
    const volatility = data.investmentType === 'stocks' ? 15 : 
                      data.investmentType === 'bonds' ? 5 :
                      data.investmentType === 'crypto' ? 40 :
                      data.investmentType === 'reits' ? 20 : 12;
    
    const worstCase = calculations.finalValue * (1 - volatility / 100);
    const bestCase = calculations.finalValue * (1 + volatility / 100);
    
    return { volatility, worstCase, bestCase };
  };

  const riskMetrics = getRiskMetrics();

  // Smart chart data formatting based on time horizon
  const getChartData = () => {
    const { yearlyData } = calculations;
    const totalYears = data.timeHorizon;
    
    // For very long time horizons, show data every few years to avoid crowding
    const interval = totalYears <= 10 ? 1 : 
                     totalYears <= 20 ? 2 :
                     totalYears <= 30 ? 3 : 5;
    
    const filteredData = yearlyData.filter((_, index) => 
      index === 0 || (index + 1) % interval === 0 || index === yearlyData.length - 1
    );
    
    return filteredData.map(item => ({
      ...item,
      yearDisplay: `Y${item.year}`,
      balanceK: Math.round(item.balance / 1000),
      contributionsK: Math.round(item.contributions / 1000),
      returnsK: Math.round(item.returns / 1000),
      realValueK: Math.round(item.realValue / 1000)
    }));
  };

  const chartData = getChartData();

  const handleInputChange = (field: keyof InvestmentData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000) {
      return `$${(value).toFixed(0)}K`;
    }
    return `$${value}K`;
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value * 1000);
  };

  const exportData = () => {
    const csvData = [
      ['Year', 'Balance', 'Contributions', 'Returns', 'Real Value'],
      ...calculations.yearlyData.map(row => [
        row.year,
        row.balance,
        row.contributions,
        row.returns,
        row.realValue
      ])
    ];
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investment-projection.csv';
    a.click();
    
    toast({
      title: "Data Exported",
      description: "Your investment projection has been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Advanced Investment Calculator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Professional-grade investment calculator with AI-powered insights, risk analysis, and comprehensive projections. 
          Plan your financial future with precision and confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Parameters
              </CardTitle>
              <CardDescription>Configure your investment scenario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initial">Initial Investment</Label>
                <Input
                  id="initial"
                  type="number"
                  value={data.initialInvestment}
                  onChange={(e) => handleInputChange('initialInvestment', parseFloat(e.target.value) || 0)}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly">Regular Contribution</Label>
                <div className="flex gap-2">
                  <Input
                    id="monthly"
                    type="number"
                    value={data.monthlyContribution}
                    onChange={(e) => handleInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                    className="text-lg font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="return">Expected Annual Return (%)</Label>
                <Input
                  id="return"
                  type="number"
                  step="0.1"
                  value={data.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', parseFloat(e.target.value) || 0)}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time Horizon (Years)</Label>
                <Input
                  id="time"
                  type="number"
                  value={data.timeHorizon}
                  onChange={(e) => handleInputChange('timeHorizon', parseInt(e.target.value) || 0)}
                  className="text-lg font-medium"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    <Input
                      id="tax"
                      type="number"
                      step="0.1"
                      value={data.taxRate}
                      onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inflation">Inflation Rate (%)</Label>
                    <Input
                      id="inflation"
                      type="number"
                      step="0.1"
                      value={data.inflationRate}
                      onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Tolerance</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculations.finalValue)}
                </div>
                <p className="text-sm text-muted-foreground">Final Value</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculations.totalContributions)}
                </div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(calculations.totalReturns)}
                </div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {((calculations.totalReturns / calculations.totalContributions) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">ROI</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Tabs */}
          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Growth Over Time</CardTitle>
                  <CardDescription>Portfolio value and inflation-adjusted growth (values in thousands)</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="w-full overflow-hidden">
                    <LineChart 
                      data={chartData} 
                      margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="yearDisplay" 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tickFormatter={formatYAxisTick}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={50}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl">
                                <p className="font-semibold mb-2 text-sm">{label}</p>
                                <div className="space-y-1">
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between gap-3 text-xs">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-2 h-2 rounded-full" 
                                          style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-muted-foreground">{entry.name}:</span>
                                      </div>
                                      <span className="font-mono font-semibold">
                                        {formatTooltipValue(entry.value as number)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="balanceK"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: "#2563eb", strokeWidth: 2 }}
                        name="Portfolio Value"
                      />
                      <Line
                        type="monotone"
                        dataKey="realValueK"
                        stroke="#ca8a04"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#ca8a04", strokeWidth: 2, r: 2 }}
                        activeDot={{ r: 4, stroke: "#ca8a04", strokeWidth: 2 }}
                        name="Inflation-Adjusted Value"
                      />
                    </LineChart>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Composition</CardTitle>
                    <CardDescription>Final value breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="w-full flex justify-center">
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Growth</CardTitle>
                    <CardDescription>How your money grows over time (in thousands)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[300px]">
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-red-600 mb-2">
                      <AlertTriangle className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(riskMetrics.worstCase)}
                    </div>
                    <p className="text-sm text-muted-foreground">Worst Case (-{riskMetrics.volatility}%)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-blue-600 mb-2">
                      <Target className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(calculations.finalValue)}
                    </div>
                    <p className="text-sm text-muted-foreground">Expected Case</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-green-600 mb-2">
                      <Award className="h-6 w-6 mx-auto" />
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(riskMetrics.bestCase)}
                    </div>
                    <p className="text-sm text-muted-foreground">Best Case (+{riskMetrics.volatility}%)</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                  <CardDescription>Understanding your investment risk</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Volatility</Label>
                      <div className="text-2xl font-bold">{riskMetrics.volatility}%</div>
                      <p className="text-sm text-muted-foreground">Expected annual price swings</p>
                    </div>
                    <div>
                      <Label>Inflation-Adjusted Value</Label>
                      <div className="text-2xl font-bold">{formatCurrency(calculations.realValue)}</div>
                      <p className="text-sm text-muted-foreground">Purchasing power in today&apos;s dollars</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {getInvestmentInsights.map((insight, index) => (
                  <div key={index} className={
                    insight.type === 'positive' ? 'border-green-200 bg-green-50' :
                    insight.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }>
                    <div className="flex items-start gap-3 p-4">
                      <div className="mt-0.5">
                        {insight.type === 'positive' ? <Award className="h-4 w-4 text-green-600" /> :
                         insight.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> :
                         <Lightbulb className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium mb-1">{insight.title}</div>
                        <div>{insight.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Optimal Contribution Strategy</div>
                    <p className="text-sm text-blue-700">
                      Based on your parameters, consider increasing contributions by ${((data.monthlyContribution * 0.1)).toFixed(0)} 
                      monthly to potentially reach {formatCurrency(calculations.finalValue * 1.1)} by retirement.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Tax Efficiency Tip</div>
                    <p className="text-sm text-green-700">
                      Your after-tax value is {formatCurrency(calculations.afterTaxValue)}. 
                      Consider tax-advantaged accounts like 401(k) or IRA to minimize tax impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportData} variant="outline" size="sm">
              Export Data
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link Copied",
                  description: "Share this calculator with others!",
                });
              }}
              variant="outline"
              size="sm"
            >
              Share Calculator
            </Button>
          </div>
        </div>
      </div>

      {/* Comprehensive Guide Section */}
      <div className="space-y-6 pt-8 border-t">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">How to Use the Investment Calculator</h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Learn how to make the most of this powerful investment planning tool with our comprehensive guide below.
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="understanding">Understanding Results</TabsTrigger>
            <TabsTrigger value="tips">Pro Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>Get up and running in minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Step 1: Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
                        <div>
                          <p className="font-medium">Initial Investment</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your starting capital. Can be $0 if you&apos;re only making regular contributions.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">2</div>
                        <div>
                          <p className="font-medium">Regular Contributions</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Amount you&apos;ll invest regularly. Consistency is key to building wealth over time.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">3</div>
                        <div>
                          <p className="font-medium">Time Horizon</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Investment period in years. Longer periods typically allow for more aggressive strategies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Step 2: Investment Strategy</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">4</div>
                        <div>
                          <p className="font-medium">Expected Return</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Set realistic expectations based on your investment type. Historical stock market average is 7-10%.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">5</div>
                        <div>
                          <p className="font-medium">Investment Type</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Choose your investment strategy (stocks, bonds, mixed portfolio, etc.) to get relevant insights.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">6</div>
                        <div>
                          <p className="font-medium">Review & Analyze</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Explore the charts and AI insights to understand your investment projection and risks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-green-600">Initial Investment</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your starting capital. Can be $0 if you&apos;re only making regular contributions.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-blue-600">Regular Contribution</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Amount you&apos;ll invest regularly. Consistency is key to building wealth over time.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-purple-600">Expected Annual Return</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your projected yearly return. Be conservative - the market doesn&apos;t always go up!
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-orange-600">Time Horizon</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Investment period in years. Longer timeframes allow for more risk and potential growth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Parameters</CardTitle>
                  <CardDescription>Fine-tune your calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-red-600">Tax Rate</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Capital gains tax on your investment returns. Varies by country and investment type.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-yellow-600">Inflation Rate</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        How much purchasing power decreases annually. Typically 2-3% in developed countries.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-indigo-600">Risk Tolerance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your comfort level with investment volatility. Affects portfolio recommendations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="understanding" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics Explained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Final Value</h4>
                        <p className="text-sm text-muted-foreground">Total portfolio value at the end of your investment period, including all contributions and compound growth.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Total Invested</h4>
                        <p className="text-sm text-muted-foreground">Sum of your initial investment plus all regular contributions over time.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Total Returns</h4>
                        <p className="text-sm text-muted-foreground">Money earned from compound growth - this is your profit from investing.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Percent className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">ROI (Return on Investment)</h4>
                        <p className="text-sm text-muted-foreground">Percentage return on your total investment. Higher is better, but consider the risks.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chart Interpretations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Growth Chart</h4>
                      <p className="text-sm text-muted-foreground">
                        Shows how your portfolio value increases over time. The blue line represents nominal value, 
                        while the dashed yellow line shows inflation-adjusted purchasing power.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Portfolio Composition</h4>
                      <p className="text-sm text-muted-foreground">
                        Pie chart showing the breakdown of your final portfolio: principal (initial investment), 
                        contributions (regular payments), and returns (compound growth).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Portfolio Growth</h4>
                      <p className="text-sm text-muted-foreground">
                        Stacked bar chart showing how each component grows over the years. 
                        Watch how returns (red) accelerate due to compound interest.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Understanding market volatility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <h4 className="font-medium text-red-600">Worst Case</h4>
                    <p className="text-sm text-muted-foreground">What your portfolio might be worth in a market downturn</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-600">Expected Case</h4>
                    <p className="text-sm text-muted-foreground">Your projected value based on historical averages</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-600">Best Case</h4>
                    <p className="text-sm text-muted-foreground">Potential value in a strong bull market</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Investment Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">Start Early, Invest Consistently</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Time is your biggest advantage. Even small amounts invested early can outperform larger amounts invested later.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800">Diversify Your Portfolio</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Don&apos;t put all your eggs in one basket. Spread investments across different asset classes and geographic regions.
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800">Stay the Course</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Market volatility is normal. Avoid emotional decisions and stick to your long-term investment plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Calculator Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800">Be Conservative with Returns</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Use 6-8% for mixed portfolios, 4-5% for bonds, 8-10% for stocks. Avoid unrealistic expectations.
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h4 className="font-medium text-indigo-800">Include Inflation</h4>
                      <p className="text-sm text-indigo-700 mt-1">
                        Always consider inflation to understand your real purchasing power in the future.
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800">Plan for Taxes</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Use tax-advantaged accounts (401k, IRA, ISA) when possible to minimize tax impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Investment Scenarios</CardTitle>
                <CardDescription>Try these examples to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-green-600 mb-2">Young Professional</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial: $5,000</li>
                      <li>• Monthly: $800</li>
                      <li>• Return: 8%</li>
                      <li>• Time: 35 years</li>
                      <li>• Type: Aggressive stocks</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-600 mb-2">Mid-Career Investor</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial: $50,000</li>
                      <li>• Monthly: $1,500</li>
                      <li>• Return: 7%</li>
                      <li>• Time: 20 years</li>
                      <li>• Type: Mixed portfolio</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-purple-600 mb-2">Pre-Retirement</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial: $200,000</li>
                      <li>• Monthly: $2,000</li>
                      <li>• Return: 5%</li>
                      <li>• Time: 10 years</li>
                      <li>• Type: Conservative bonds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Important Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Educational Purpose:</strong> This calculator is for educational and planning purposes only. 
                It cannot predict actual investment performance or guarantee future results.
              </p>
              <p>
                <strong>Market Volatility:</strong> Real markets are unpredictable. Your actual returns may be 
                significantly higher or lower than projections shown here.
              </p>
              <p>
                <strong>Professional Advice:</strong> Consider consulting with a qualified financial advisor 
                before making investment decisions, especially for large amounts.
              </p>
              <p>
                <strong>Tax Implications:</strong> Tax rates and rules vary by jurisdiction and can change over time. 
                This calculator provides general estimates only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
