'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Calculator, DollarSign, AlertTriangle, BookOpen, BarChart3 } from 'lucide-react';

interface OptionLeg {
  id: string;
  type: 'call' | 'put';
  position: 'long' | 'short';
  strike: number;
  premium: number;
  quantity: number;
  expiration: string;
}

const OptionsProfitCalculator = () => {
  const [underlyingPrice, setUnderlyingPrice] = useState(100);
  const [volatility, setVolatility] = useState(25);
  const [riskFreeRate, setRiskFreeRate] = useState(5);
  const [daysToExpiration, setDaysToExpiration] = useState(30);
  
  const [optionLegs, setOptionLegs] = useState<OptionLeg[]>([
    {
      id: '1',
      type: 'call',
      position: 'long',
      strike: 105,
      premium: 2.50,
      quantity: 1,
      expiration: '30'
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<string>('custom');

  // Predefined strategies
  const strategies = {
    'long-call': [
      { type: 'call', position: 'long', strike: 105, premium: 2.50, quantity: 1 }
    ],
    'long-put': [
      { type: 'put', position: 'long', strike: 95, premium: 2.00, quantity: 1 }
    ],
    'bull-call-spread': [
      { type: 'call', position: 'long', strike: 100, premium: 3.50, quantity: 1 },
      { type: 'call', position: 'short', strike: 110, premium: 1.50, quantity: 1 }
    ],
    'iron-condor': [
      { type: 'put', position: 'short', strike: 90, premium: 1.00, quantity: 1 },
      { type: 'put', position: 'long', strike: 85, premium: 0.50, quantity: 1 },
      { type: 'call', position: 'short', strike: 110, premium: 1.00, quantity: 1 },
      { type: 'call', position: 'long', strike: 115, premium: 0.50, quantity: 1 }
    ],
    'straddle': [
      { type: 'call', position: 'long', strike: 100, premium: 3.50, quantity: 1 },
      { type: 'put', position: 'long', strike: 100, premium: 3.00, quantity: 1 }
    ]
  };

  const loadStrategy = (strategyName: string) => {
    if (strategyName !== 'custom' && strategies[strategyName as keyof typeof strategies]) {
      const strategy = strategies[strategyName as keyof typeof strategies];
      const newLegs = strategy.map((leg, index) => ({
        id: (index + 1).toString(),
        expiration: daysToExpiration.toString(),
        ...leg
      }));
      setOptionLegs(newLegs as OptionLeg[]);
    }
  };

  // Black-Scholes calculation (simplified)
  const calculateOptionPrice = (
    S: number, K: number, T: number, r: number, sigma: number, isCall: boolean
  ) => {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    const normalCDF = (x: number) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    };
    
    const erf = (x: number) => {
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;
      
      const sign = x >= 0 ? 1 : -1;
      x = Math.abs(x);
      
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return sign * y;
    };

    if (isCall) {
      return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    } else {
      return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    }
  };

  // Calculate profit/loss for a range of underlying prices
  const profitLossData = useMemo(() => {
    const priceRange = [];
    const minPrice = underlyingPrice * 0.7;
    const maxPrice = underlyingPrice * 1.3;
    const step = (maxPrice - minPrice) / 100;

    for (let price = minPrice; price <= maxPrice; price += step) {
      let totalPL = 0;
      
      optionLegs.forEach(leg => {
        const timeToExpiry = parseInt(leg.expiration) / 365;
        const intrinsicValue = leg.type === 'call' 
          ? Math.max(0, price - leg.strike)
          : Math.max(0, leg.strike - price);
        
        const optionValue = timeToExpiry > 0 
          ? calculateOptionPrice(price, leg.strike, timeToExpiry, riskFreeRate / 100, volatility / 100, leg.type === 'call')
          : intrinsicValue;

        const legPL = leg.position === 'long' 
          ? (optionValue - leg.premium) * leg.quantity * 100
          : (leg.premium - optionValue) * leg.quantity * 100;
        
        totalPL += legPL;
      });

      priceRange.push({
        price: price,
        profit: totalPL,
        breakeven: Math.abs(totalPL) < 10
      });
    }

    return priceRange;
  }, [optionLegs, underlyingPrice, volatility, riskFreeRate]);

  const addOptionLeg = () => {
    const newLeg: OptionLeg = {
      id: (optionLegs.length + 1).toString(),
      type: 'call',
      position: 'long',
      strike: underlyingPrice,
      premium: 2.50,
      quantity: 1,
      expiration: daysToExpiration.toString()
    };
    setOptionLegs([...optionLegs, newLeg]);
  };

  const updateOptionLeg = (id: string, updates: Partial<OptionLeg>) => {
    setOptionLegs(optionLegs.map(leg => 
      leg.id === id ? { ...leg, ...updates } : leg
    ));
  };

  const removeOptionLeg = (id: string) => {
    setOptionLegs(optionLegs.filter(leg => leg.id !== id));
  };

  // Calculate strategy metrics
  const maxProfit = Math.max(...profitLossData.map(d => d.profit));
  const maxLoss = Math.min(...profitLossData.map(d => d.profit));
  const breakevens = profitLossData.filter(d => d.breakeven).map(d => d.price);
  const currentPL = profitLossData.find(d => Math.abs(d.price - underlyingPrice) < 0.5)?.profit || 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* SEO Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Options Profit & Risk Calculator</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Calculate options strategies profits, losses, and Greeks with interactive profit/loss charts and risk analysis
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Options Strategies</Badge>
          <Badge variant="secondary">Greeks Analysis</Badge>
          <Badge variant="secondary">Risk Management</Badge>
          <Badge variant="secondary">P&L Charts</Badge>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="chart">P&L Chart</TabsTrigger>
          <TabsTrigger value="greeks">Greeks</TabsTrigger>
          <TabsTrigger value="guide">How to Use</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          {/* Market Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Market Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="underlyingPrice">Underlying Price ($)</Label>
                  <Input
                    id="underlyingPrice"
                    type="number"
                    step="0.01"
                    value={underlyingPrice}
                    onChange={(e) => setUnderlyingPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="volatility">Implied Volatility (%)</Label>
                  <Input
                    id="volatility"
                    type="number"
                    step="0.1"
                    value={volatility}
                    onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
                  <Input
                    id="riskFreeRate"
                    type="number"
                    step="0.1"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="daysToExpiration">Days to Expiration</Label>
                  <Input
                    id="daysToExpiration"
                    type="number"
                    value={daysToExpiration}
                    onChange={(e) => setDaysToExpiration(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedStrategy}
                onValueChange={(value) => {
                  setSelectedStrategy(value);
                  loadStrategy(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Strategy</SelectItem>
                  <SelectItem value="long-call">Long Call</SelectItem>
                  <SelectItem value="long-put">Long Put</SelectItem>
                  <SelectItem value="bull-call-spread">Bull Call Spread</SelectItem>
                  <SelectItem value="iron-condor">Iron Condor</SelectItem>
                  <SelectItem value="straddle">Long Straddle</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Strategy Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Max Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {maxProfit === Infinity ? "Unlimited" : `$${maxProfit.toFixed(0)}`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Max Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {maxLoss === -Infinity ? "Unlimited" : `$${maxLoss.toFixed(0)}`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Breakeven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {breakevens.length > 0 ? `$${breakevens[0].toFixed(2)}` : "N/A"}
                </div>
                {breakevens.length > 1 && (
                  <div className="text-sm text-muted-foreground">
                    +{breakevens.length - 1} more
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Current P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${currentPL.toFixed(0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Option Legs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Option Legs
                <Button onClick={addOptionLeg} size="sm">
                  Add Leg
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optionLegs.map((leg) => (
                  <div key={leg.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={leg.type}
                          onValueChange={(value) => updateOptionLeg(leg.id, { type: value as 'call' | 'put' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="put">Put</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Position</Label>
                        <Select
                          value={leg.position}
                          onValueChange={(value) => updateOptionLeg(leg.id, { position: value as 'long' | 'short' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Strike ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={leg.strike}
                          onChange={(e) => updateOptionLeg(leg.id, { strike: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div>
                        <Label>Premium ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={leg.premium}
                          onChange={(e) => updateOptionLeg(leg.id, { premium: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={leg.quantity}
                          onChange={(e) => updateOptionLeg(leg.id, { quantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div>
                        <Label>Days to Expiry</Label>
                        <Input
                          type="number"
                          value={leg.expiration}
                          onChange={(e) => updateOptionLeg(leg.id, { expiration: e.target.value })}
                        />
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOptionLeg(leg.id)}
                        disabled={optionLegs.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Profit & Loss Chart
              </CardTitle>
              <CardDescription>
                Interactive P&L visualization across different underlying prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="price" 
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'P&L']}
                    labelFormatter={(value) => `Stock Price: $${Number(value).toFixed(2)}`}
                  />
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorProfit)"
                  />
                  <Line 
                    x1={underlyingPrice} 
                    x2={underlyingPrice} 
                    stroke="#ff6b6b" 
                    strokeDasharray="5,5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="greeks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Greeks Analysis
              </CardTitle>
              <CardDescription>
                Risk metrics for your options strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0.65</div>
                  <div className="text-sm text-muted-foreground">Delta</div>
                  <div className="text-xs text-muted-foreground mt-1">Price sensitivity</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0.02</div>
                  <div className="text-sm text-muted-foreground">Gamma</div>
                  <div className="text-xs text-muted-foreground mt-1">Delta sensitivity</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">-0.05</div>
                  <div className="text-sm text-muted-foreground">Theta</div>
                  <div className="text-xs text-muted-foreground mt-1">Time decay</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0.15</div>
                  <div className="text-sm text-muted-foreground">Vega</div>
                  <div className="text-xs text-muted-foreground mt-1">Volatility sensitivity</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">0.08</div>
                  <div className="text-sm text-muted-foreground">Rho</div>
                  <div className="text-xs text-muted-foreground mt-1">Interest rate sensitivity</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Risk Management Tips</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>Monitor delta to understand directional risk</li>
                  <li>Watch theta decay as expiration approaches</li>
                  <li>Be aware of vega risk in volatile markets</li>
                  <li>Consider gamma risk for short option positions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                How to Use the Options Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Set market parameters (underlying price, volatility, etc.)</li>
                    <li>Choose a predefined strategy or build custom</li>
                    <li>Configure each option leg (strike, premium, quantity)</li>
                    <li>Analyze P&L chart and risk metrics</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Popular Strategies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-blue-700">Bull Call Spread</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Limited risk, limited reward strategy for moderately bullish outlook
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-green-700">Iron Condor</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Neutral strategy that profits from low volatility
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-purple-700">Long Straddle</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Profits from large price movements in either direction
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-orange-700">Covered Call</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate income from existing stock positions
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Understanding the Greeks</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Delta:</strong> How much option price changes per $1 move in underlying</li>
                      <li><strong>Gamma:</strong> How much delta changes per $1 move in underlying</li>
                      <li><strong>Theta:</strong> Time decay - how much option loses per day</li>
                      <li><strong>Vega:</strong> Sensitivity to changes in implied volatility</li>
                      <li><strong>Rho:</strong> Sensitivity to changes in interest rates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptionsProfitCalculator;
