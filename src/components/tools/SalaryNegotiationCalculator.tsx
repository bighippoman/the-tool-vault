"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, TrendingUp, Calculator, Target, Plus, Trash2
} from 'lucide-react';

interface Benefit {
  id: string;
  name: string;
  monthlyValue: number;
  taxable: boolean;
}

interface SalaryAnalysis {
  salaryIncrease: number;
  percentageIncrease: number;
  netIncrease: number;
  monthlyIncrease: number;
  benefitIncrease: number;
  totalCompIncrease: number;
  lifetimeValue: number;
  negotiationPower: 'weak' | 'moderate' | 'strong' | 'excellent';
}

const SalaryNegotiationCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState('75000');
  const [proposedSalary, setProposedSalary] = useState('82000');
  const [taxRate, setTaxRate] = useState('25');
  const [yearsAtCompany, setYearsAtCompany] = useState('2');
  const [marketResearch, setMarketResearch] = useState('85000');
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', name: 'Health Insurance', monthlyValue: 400, taxable: false },
    { id: '2', name: '401k Match', monthlyValue: 300, taxable: false },
    { id: '3', name: 'Dental Insurance', monthlyValue: 50, taxable: false },
    { id: '4', name: 'Vision Insurance', monthlyValue: 25, taxable: false },
    { id: '5', name: 'Life Insurance', monthlyValue: 30, taxable: false }
  ]);
  const [proposedBenefits, setProposedBenefits] = useState<Benefit[]>([
    { id: '1', name: 'Health Insurance', monthlyValue: 450, taxable: false },
    { id: '2', name: '401k Match', monthlyValue: 350, taxable: false },
    { id: '3', name: 'Dental Insurance', monthlyValue: 60, taxable: false },
    { id: '4', name: 'Vision Insurance', monthlyValue: 30, taxable: false },
    { id: '5', name: 'Life Insurance', monthlyValue: 40, taxable: false },
    { id: '6', name: 'Flexible Spending Account', monthlyValue: 100, taxable: false }
  ]);
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);

  const addBenefit = (isProposed: boolean) => {
    const newBenefit: Benefit = {
      id: Date.now().toString(),
      name: 'New Benefit',
      monthlyValue: 0,
      taxable: false
    };
    
    if (isProposed) {
      setProposedBenefits([...proposedBenefits, newBenefit]);
    } else {
      setBenefits([...benefits, newBenefit]);
    }
  };

  const removeBenefit = (id: string, isProposed: boolean) => {
    if (isProposed) {
      setProposedBenefits(proposedBenefits.filter(b => b.id !== id));
    } else {
      setBenefits(benefits.filter(b => b.id !== id));
    }
  };

  const updateBenefit = (id: string, field: keyof Benefit, value: string | number | boolean, isProposed: boolean) => {
    const updateFunc = (benefit: Benefit) => 
      benefit.id === id ? { ...benefit, [field]: value } : benefit;
    
    if (isProposed) {
      setProposedBenefits(proposedBenefits.map(updateFunc));
    } else {
      setBenefits(benefits.map(updateFunc));
    }
  };

  const calculateAnalysis = useCallback(() => {
    const currentSal = parseFloat(currentSalary);
    const proposedSal = parseFloat(proposedSalary);
    const tax = parseFloat(taxRate) / 100;
    const years = parseInt(yearsAtCompany);
    
    const salaryIncrease = proposedSal - currentSal;
    const percentageIncrease = (salaryIncrease / currentSal) * 100;
    const netIncrease = salaryIncrease * (1 - tax);
    const monthlyIncrease = netIncrease / 12;
    
    // Calculate total benefit values
    const currentBenefitValue = benefits.reduce((sum, benefit) => sum + benefit.monthlyValue * 12, 0);
    const proposedBenefitValue = proposedBenefits.reduce((sum, benefit) => sum + benefit.monthlyValue * 12, 0);
    const benefitIncrease = proposedBenefitValue - currentBenefitValue;
    
    // Calculate total compensation
    const currentTotalComp = currentSal + currentBenefitValue;
    const proposedTotalComp = proposedSal + proposedBenefitValue;
    const totalCompIncrease = proposedTotalComp - currentTotalComp;
    
    // Calculate lifetime value (assuming 30 year career)
    const lifetimeValue = totalCompIncrease * 30;
    
    // Determine negotiation power score
    let negotiationPower: 'weak' | 'moderate' | 'strong' | 'excellent' = 'weak';
    if (parseFloat(marketResearch) === 0 && years >= 3) {
      negotiationPower = 'excellent';
    } else if (parseFloat(marketResearch) === 0 && years >= 2) {
      negotiationPower = 'strong';
    } else if (parseFloat(marketResearch) === 0 || years >= 1) {
      negotiationPower = 'moderate';
    }
    
    setAnalysis({
      salaryIncrease,
      percentageIncrease,
      netIncrease,
      monthlyIncrease,
      benefitIncrease,
      totalCompIncrease,
      lifetimeValue,
      negotiationPower
    });
  }, [currentSalary, proposedSalary, taxRate, yearsAtCompany, marketResearch, benefits, proposedBenefits]);

  useEffect(() => {
    calculateAnalysis();
  }, [calculateAnalysis]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPowerColor = (power: string) => {
    switch (power) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'strong': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'weak': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPowerText = (power: string) => {
    switch (power) {
      case 'excellent': return 'Excellent Position - Strong case for negotiation';
      case 'strong': return 'Strong Position - Good leverage for increase';
      case 'moderate': return 'Moderate Position - Some negotiation opportunity';
      case 'weak': return 'Weak Position - Build more value before negotiating';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Salary Negotiation Calculator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate salary increases, benefits value, and total compensation packages. 
          Get insights into your negotiation strength and lifetime earning potential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Salary Information
              </CardTitle>
              <CardDescription>
                Enter your current and proposed compensation details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentSalary">Current Annual Salary ($)</Label>
                <Input
                  id="currentSalary"
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  placeholder="75000"
                />
              </div>

              <div>
                <Label htmlFor="proposedSalary">Proposed Annual Salary ($)</Label>
                <Input
                  id="proposedSalary"
                  type="number"
                  value={proposedSalary}
                  onChange={(e) => setProposedSalary(e.target.value)}
                  placeholder="82000"
                />
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="25"
                />
              </div>

              <div>
                <Label htmlFor="yearsAtCompany">Years at Company</Label>
                <Input
                  id="yearsAtCompany"
                  type="number"
                  value={yearsAtCompany}
                  onChange={(e) => setYearsAtCompany(e.target.value)}
                  placeholder="2"
                />
              </div>

              <div>
                <Label htmlFor="marketResearch">Market Rate Research ($)</Label>
                <Input
                  id="marketResearch"
                  type="number"
                  value={marketResearch}
                  onChange={(e) => setMarketResearch(e.target.value)}
                  placeholder="85000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Research similar roles in your area
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {analysis && (
            <Tabs defaultValue="analysis" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Salary Analysis</TabsTrigger>
                <TabsTrigger value="benefits">Benefits Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-4">
                {/* Negotiation Power Banner */}
                <Card className={`border-2 ${getPowerColor(analysis.negotiationPower)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Target className="h-6 w-6" />
                      <div>
                        <h3 className="font-semibold">{getPowerText(analysis.negotiationPower)}</h3>
                        <p className="text-sm opacity-80">
                          Based on tenure, market research, and ask amount
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Salary Increase</p>
                          <p className="text-3xl font-bold text-primary">
                            {formatCurrency(analysis.salaryIncrease)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {analysis.percentageIncrease.toFixed(1)}% increase
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">After-Tax Increase</p>
                          <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(analysis.netIncrease)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Monthly: {formatCurrency(analysis.monthlyIncrease)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Compensation</p>
                          <p className="text-3xl font-bold">
                            {formatCurrency(parseFloat(proposedSalary) + proposedBenefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            vs {formatCurrency(parseFloat(currentSalary) + benefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))} current
                          </p>
                        </div>
                        <Calculator className="h-8 w-8" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">30-Year Lifetime Value</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {formatCurrency(analysis.lifetimeValue)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total career impact
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Position Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current vs Market</p>
                        <p className="text-lg font-semibold">
                          {((parseFloat(currentSalary) / parseFloat(marketResearch)) * 100).toFixed(1)}% of market rate
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proposed vs Market</p>
                        <p className="text-lg font-semibold">
                          {((parseFloat(proposedSalary) / parseFloat(marketResearch)) * 100).toFixed(1)}% of market rate
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {parseFloat(proposedSalary) < parseFloat(marketResearch) * 0.95 && (
                        <p className="text-green-600 font-medium">✓ Your ask is reasonable compared to market rates</p>
                      )}
                      {parseFloat(currentSalary) < parseFloat(marketResearch) * 0.9 && (
                        <p className="text-blue-600 font-medium">💡 You appear to be underpaid relative to market</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Current Benefits
                        <Button variant="outline" size="sm" onClick={() => addBenefit(false)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {benefits.map((benefit) => (
                        <div key={benefit.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              value={benefit.name}
                              onChange={(e) => updateBenefit(benefit.id, 'name', e.target.value, false)}
                              className="text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBenefit(benefit.id, false)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={benefit.monthlyValue}
                              onChange={(e) => updateBenefit(benefit.id, 'monthlyValue', parseFloat(e.target.value) || 0, false)}
                              placeholder="Monthly value"
                              className="text-sm"
                            />
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={benefit.taxable}
                                onChange={(e) => updateBenefit(benefit.id, 'taxable', e.target.checked, false)}
                              />
                              Taxable
                            </label>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <p className="font-semibold">
                          Total Annual Value: {formatCurrency(benefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Proposed Benefits
                        <Button variant="outline" size="sm" onClick={() => addBenefit(true)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {proposedBenefits.map((benefit) => (
                        <div key={benefit.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Input
                              value={benefit.name}
                              onChange={(e) => updateBenefit(benefit.id, 'name', e.target.value, true)}
                              className="text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBenefit(benefit.id, true)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={benefit.monthlyValue}
                              onChange={(e) => updateBenefit(benefit.id, 'monthlyValue', parseFloat(e.target.value) || 0, true)}
                              placeholder="Monthly value"
                              className="text-sm"
                            />
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={benefit.taxable}
                                onChange={(e) => updateBenefit(benefit.id, 'taxable', e.target.checked, true)}
                              />
                              Taxable
                            </label>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <p className="font-semibold">
                          Total Annual Value: {formatCurrency(proposedBenefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Benefits Comparison Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Benefits</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(benefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Proposed Benefits</p>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(proposedBenefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Benefits Increase</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(proposedBenefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0) - benefits.reduce((sum, b) => sum + (b.monthlyValue * 12), 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Salary Negotiation Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">💼 Negotiation Preparation</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Research market rates using Glassdoor, PayScale, LinkedIn</li>
                <li>• Document your achievements and added value</li>
                <li>• Consider total compensation, not just base salary</li>
                <li>• Time your request strategically (after reviews, projects)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Negotiation Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Present data-driven case with market research</li>
                <li>• Be flexible on benefits vs salary trade-offs</li>
                <li>• Practice your pitch and anticipate objections</li>
                <li>• Consider non-monetary benefits (PTO, flexibility)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Negotiation Strategy</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Remember that salary negotiations are conversations, not confrontations. Focus on your value contribution, 
              use market data to support your ask, and be prepared to discuss the entire compensation package. 
              The worst they can say is no, but you&apos;ll never get what you don&apos;t ask for.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryNegotiationCalculator;
