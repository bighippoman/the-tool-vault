'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Calculator, Target, Percent, BookOpen, AlertCircle, Edit3
} from 'lucide-react';

interface StockData {
  symbol: string;
  currentPrice: number;
  eps: number;
  revenue: number;
  growthRate: number;
  dividendYield: number;
  peRatio: number;
  bookValue: number;
  freeCashFlow: number;
  discountRate: number;
  terminalGrowthRate: number;
}

const StockAnalysisCalculator = () => {
  const [stockData, setStockData] = useState<StockData>({
    symbol: 'AAPL',
    currentPrice: 150,
    eps: 6.15,
    revenue: 365000000000,
    growthRate: 8,
    dividendYield: 0.5,
    peRatio: 25,
    bookValue: 4.5,
    freeCashFlow: 93000000000,
    discountRate: 10,
    terminalGrowthRate: 3
  });

  // DCF Calculation
  const calculateDCF = () => {
    const years = 5;
    const projectedCashFlows = [];
    let currentFCF = stockData.freeCashFlow;
    
    for (let i = 1; i <= years; i++) {
      currentFCF *= (1 + stockData.growthRate / 100);
      const presentValue = currentFCF / Math.pow(1 + stockData.discountRate / 100, i);
      projectedCashFlows.push({
        year: i,
        cashFlow: currentFCF,
        presentValue: presentValue
      });
    }

    const terminalValue = (currentFCF * (1 + stockData.terminalGrowthRate / 100)) / 
                         ((stockData.discountRate - stockData.terminalGrowthRate) / 100);
    const terminalPV = terminalValue / Math.pow(1 + stockData.discountRate / 100, years);
    
    const totalPV = projectedCashFlows.reduce((sum, cf) => sum + cf.presentValue, 0) + terminalPV;
    
    return {
      projectedCashFlows,
      terminalValue,
      terminalPV,
      totalPV,
      intrinsicValue: totalPV / 1000000000 // Assuming shares outstanding
    };
  };

  // Multiple Valuation Methods
  const calculateValuationMetrics = () => {
    const dcf = calculateDCF();
    const peValuation = stockData.eps * stockData.peRatio;
    const pbValuation = stockData.bookValue * 2.5; // Assuming P/B ratio of 2.5
    const dividendDiscount = (stockData.currentPrice * stockData.dividendYield / 100) / (stockData.discountRate / 100);
    
    return {
      dcf: dcf.intrinsicValue,
      peValuation,
      pbValuation,
      dividendDiscount,
      average: (dcf.intrinsicValue + peValuation + pbValuation + dividendDiscount) / 4,
      dcfDetails: dcf
    };
  };

  const valuation = calculateValuationMetrics();
  const upside = ((valuation.average - stockData.currentPrice) / stockData.currentPrice) * 100;

  // Risk Metrics
  const calculateRiskMetrics = () => {
    const debtToEquity = 0.8; // Example ratio
    const currentRatio = 1.5; // Example ratio
    const riskScore = Math.max(0, Math.min(100, 
      50 + (stockData.growthRate - 5) * 5 - (stockData.peRatio - 20) * 2
    ));
    
    return {
      debtToEquity,
      currentRatio,
      riskScore,
      riskLevel: riskScore > 70 ? 'Low' : riskScore > 40 ? 'Medium' : 'High'
    };
  };

  const riskMetrics = calculateRiskMetrics();

  const valuationData = [
    { method: 'DCF', value: valuation.dcf },
    { method: 'P/E', value: valuation.peValuation },
    { method: 'P/B', value: valuation.pbValuation },
    { method: 'Dividend', value: valuation.dividendDiscount },
    { method: 'Average', value: valuation.average }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* SEO Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Stock Analysis Calculator</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Comprehensive stock valuation using DCF, P/E ratios, dividend yield analysis with advanced financial metrics
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">DCF Analysis</Badge>
          <Badge variant="secondary">Multiple Valuation</Badge>
          <Badge variant="secondary">Risk Assessment</Badge>
          <Badge variant="secondary">Professional Grade</Badge>
        </div>
      </div>

      {/* Quick Input Section - Now Prominent */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Enter Stock Details
          </CardTitle>
          <CardDescription>
            Input the key financial metrics for your stock analysis. All fields update the analysis in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="symbol" className="text-sm font-medium">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={stockData.symbol}
                onChange={(e) => setStockData({ ...stockData, symbol: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currentPrice" className="text-sm font-medium">Current Price ($)</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={stockData.currentPrice}
                onChange={(e) => setStockData({ ...stockData, currentPrice: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eps" className="text-sm font-medium">Earnings Per Share ($)</Label>
              <Input
                id="eps"
                type="number"
                step="0.01"
                placeholder="6.15"
                value={stockData.eps}
                onChange={(e) => setStockData({ ...stockData, eps: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="peRatio" className="text-sm font-medium">P/E Ratio</Label>
              <Input
                id="peRatio"
                type="number"
                step="0.1"
                placeholder="25.0"
                value={stockData.peRatio}
                onChange={(e) => setStockData({ ...stockData, peRatio: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="freeCashFlow" className="text-sm font-medium">Free Cash Flow ($B)</Label>
              <Input
                id="freeCashFlow"
                type="number"
                placeholder="93"
                value={stockData.freeCashFlow / 1000000000}
                onChange={(e) => setStockData({ ...stockData, freeCashFlow: (parseFloat(e.target.value) || 0) * 1000000000 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="growthRate" className="text-sm font-medium">Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                step="0.1"
                placeholder="8.0"
                value={stockData.growthRate}
                onChange={(e) => setStockData({ ...stockData, growthRate: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dividendYield" className="text-sm font-medium">Dividend Yield (%)</Label>
              <Input
                id="dividendYield"
                type="number"
                step="0.1"
                placeholder="0.5"
                value={stockData.dividendYield}
                onChange={(e) => setStockData({ ...stockData, dividendYield: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="discountRate" className="text-sm font-medium">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                step="0.1"
                placeholder="10.0"
                value={stockData.discountRate}
                onChange={(e) => setStockData({ ...stockData, discountRate: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
          <TabsTrigger value="valuation">Detailed Valuation</TabsTrigger>
          <TabsTrigger value="guide">How to Use</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Fair Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${valuation.average.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Avg. of all methods</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Current Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stockData.currentPrice.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">{stockData.symbol}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Upside/Downside
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold flex items-center gap-2 ${upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {upside >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {upside.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  riskMetrics.riskLevel === 'Low' ? 'text-green-600' : 
                  riskMetrics.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {riskMetrics.riskLevel}
                </div>
                <p className="text-sm text-muted-foreground">{riskMetrics.riskScore}/100</p>
              </CardContent>
            </Card>
          </div>

          {/* Valuation Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Valuation Methods Comparison</CardTitle>
              <CardDescription>Different approaches to stock valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={valuationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Valuation']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Investment Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Investment Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  upside > 20 ? 'bg-green-50 border border-green-200' :
                  upside > 0 ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <h3 className={`font-semibold ${
                    upside > 20 ? 'text-green-900' :
                    upside > 0 ? 'text-yellow-900' :
                    'text-red-900'
                  }`}>
                    {upside > 20 ? 'Strong Buy' : upside > 0 ? 'Buy' : 'Hold/Sell'}
                  </h3>
                  <p className={`text-sm ${
                    upside > 20 ? 'text-green-700' :
                    upside > 0 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {upside > 20 ? 'Stock appears significantly undervalued' :
                     upside > 0 ? 'Stock shows moderate upside potential' :
                     'Stock appears overvalued or fairly priced'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stockData.peRatio.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">P/E Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stockData.dividendYield.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Dividend Yield</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stockData.growthRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-6">
          {/* DCF Analysis Details */}
          <Card>
            <CardHeader>
              <CardTitle>Discounted Cash Flow (DCF) Analysis</CardTitle>
              <CardDescription>5-year cash flow projections and terminal value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-right p-2">Projected FCF</th>
                      <th className="text-right p-2">Present Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuation.dcfDetails.projectedCashFlows.map((cf) => (
                      <tr key={cf.year} className="border-b">
                        <td className="p-2">{cf.year}</td>
                        <td className="text-right p-2">${(cf.cashFlow / 1000000000).toFixed(2)}B</td>
                        <td className="text-right p-2">${(cf.presentValue / 1000000000).toFixed(2)}B</td>
                      </tr>
                    ))}
                    <tr className="border-b font-semibold">
                      <td className="p-2">Terminal</td>
                      <td className="text-right p-2">${(valuation.dcfDetails.terminalValue / 1000000000).toFixed(2)}B</td>
                      <td className="text-right p-2">${(valuation.dcfDetails.terminalPV / 1000000000).toFixed(2)}B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-900">
                  DCF Fair Value: ${valuation.dcf.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">
                  Based on {stockData.discountRate}% discount rate and {stockData.terminalGrowthRate}% terminal growth
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relative Valuation */}
          <Card>
            <CardHeader>
              <CardTitle>Relative Valuation Multiples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">${valuation.peValuation.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">P/E Valuation</div>
                  <div className="text-xs text-muted-foreground mt-1">EPS × P/E Ratio</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">${valuation.pbValuation.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">P/B Valuation</div>
                  <div className="text-xs text-muted-foreground mt-1">Book Value × P/B</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">${valuation.dividendDiscount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Dividend Model</div>
                  <div className="text-xs text-muted-foreground mt-1">DDM Valuation</div>
                </div>
                <div className="p-4 border rounded-lg text-center bg-blue-50">
                  <div className="text-2xl font-bold text-blue-800">${valuation.average.toFixed(2)}</div>
                  <div className="text-sm text-blue-700">Average Value</div>
                  <div className="text-xs text-blue-600 mt-1">All Methods</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                How to Use the Stock Analysis Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Step-by-Step Guide</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-medium">Enter Stock Symbol</h4>
                        <p className="text-sm text-muted-foreground">Start by entering the stock ticker symbol (e.g., AAPL, GOOGL, MSFT)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-medium">Input Financial Data</h4>
                        <p className="text-sm text-muted-foreground">Enter the current price, EPS, P/E ratio, and other metrics from financial reports</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-medium">Review Analysis</h4>
                        <p className="text-sm text-muted-foreground">See the calculated fair value, upside potential, and investment recommendation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Where to Find Stock Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Yahoo Finance:</strong> Free financial data for most stocks</li>
                      <li><strong>SEC Filings (10-K, 10-Q):</strong> Official company reports</li>
                      <li><strong>Company Investor Relations:</strong> Latest earnings reports</li>
                      <li><strong>Financial News Sites:</strong> Bloomberg, Reuters, MarketWatch</li>
                      <li><strong>Brokerage Platforms:</strong> TD Ameritrade, E*TRADE, etc.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Valuation Methods Explained</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-blue-700">DCF Analysis</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Values company based on projected future cash flows discounted to present value
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-green-700">P/E Valuation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Multiplies earnings per share by industry-average P/E ratio
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-purple-700">P/B Valuation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on book value and price-to-book multiples
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-orange-700">Dividend Model</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Values stock based on present value of future dividends
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Investment Decision Framework</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm"><strong>Strong Buy:</strong> Fair value 20%+ above current price</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm"><strong>Buy:</strong> Fair value 0-20% above current price</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm"><strong>Hold/Sell:</strong> Fair value below current price</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700">
                    This tool is for educational purposes only and should not be considered as financial advice. 
                    Always conduct your own research and consult with financial professionals before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockAnalysisCalculator;
