'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PieChart, DollarSign, TrendingUp, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  type: 'needs' | 'wants' | 'savings';
}

interface BudgetAnalysis {
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  remaining: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  recommendation: 'excellent' | 'good' | 'needs-adjustment' | 'concerning';
}

const BudgetPlanner = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('5000');
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Housing', budgeted: 1500, spent: 1450, type: 'needs' },
    { id: '2', name: 'Food & Groceries', budgeted: 600, spent: 650, type: 'needs' },
    { id: '3', name: 'Transportation', budgeted: 400, spent: 380, type: 'needs' },
    { id: '4', name: 'Utilities', budgeted: 200, spent: 185, type: 'needs' },
    { id: '5', name: 'Entertainment', budgeted: 300, spent: 320, type: 'wants' },
    { id: '6', name: 'Dining Out', budgeted: 250, spent: 280, type: 'wants' },
    { id: '7', name: 'Shopping', budgeted: 200, spent: 150, type: 'wants' },
    { id: '8', name: 'Emergency Fund', budgeted: 500, spent: 500, type: 'savings' },
    { id: '9', name: 'Retirement', budgeted: 400, spent: 400, type: 'savings' },
    { id: '10', name: 'Investments', budgeted: 200, spent: 200, type: 'savings' }
  ]);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);

  const addCategory = (type: 'needs' | 'wants' | 'savings') => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: `New ${type === 'needs' ? 'Need' : type === 'wants' ? 'Want' : 'Savings Goal'}`,
      budgeted: 0,
      spent: 0,
      type
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const updateCategory = (id: string, field: keyof BudgetCategory, value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const calculateAnalysis = useCallback(() => {
    const income = parseFloat(monthlyIncome);
    const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = income - totalSpent;

    const needsTotal = categories.filter(cat => cat.type === 'needs').reduce((sum, cat) => sum + cat.budgeted, 0);
    const wantsTotal = categories.filter(cat => cat.type === 'wants').reduce((sum, cat) => sum + cat.budgeted, 0);
    const savingsTotal = categories.filter(cat => cat.type === 'savings').reduce((sum, cat) => sum + cat.budgeted, 0);

    let needsPercentage = 0;
    let wantsPercentage = 0;
    let savingsPercentage = 0;

    if (income > 0) {
      needsPercentage = (needsTotal / income) * 100;
      wantsPercentage = (wantsTotal / income) * 100;
      savingsPercentage = (savingsTotal / income) * 100;
    }

    // Determine recommendation based on 50/30/20 rule
    let recommendation: BudgetAnalysis['recommendation'] = 'excellent';
    if (income <= 0) {
      recommendation = 'needs-adjustment'; // Or some other appropriate state for zero/negative income
    } else if (needsPercentage > 60 || wantsPercentage > 40 || savingsPercentage < 10) {
      recommendation = 'concerning';
    } else if (needsPercentage > 55 || wantsPercentage > 35 || savingsPercentage < 15) {
      recommendation = 'needs-adjustment';
    } else if (needsPercentage > 50 || wantsPercentage > 30 || savingsPercentage < 20) {
      recommendation = 'good';
    }

    setAnalysis({
      totalIncome: income,
      totalBudgeted,
      totalSpent,
      remaining,
      needsPercentage,
      wantsPercentage,
      savingsPercentage,
      recommendation
    });
  }, [monthlyIncome, categories]);

  useEffect(() => {
    if (monthlyIncome && categories) { // Ensure dependencies are valid before calling
        calculateAnalysis();
    }
  }, [calculateAnalysis, categories, monthlyIncome]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-adjustment': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'concerning': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'excellent': return 'Excellent Budget - Following the 50/30/20 rule perfectly';
      case 'good': return 'Good Budget - Close to ideal allocation with minor adjustments needed';
      case 'needs-adjustment': return 'Needs Adjustment - Some categories are off balance';
      case 'concerning': return 'Concerning - Major budget rebalancing required';
      default: return '';
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'needs': return 'bg-blue-100 text-blue-800';
      case 'wants': return 'bg-purple-100 text-purple-800';
      case 'savings': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Smart Budget Planner</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create comprehensive budgets with the 50/30/20 rule, track expenses, and get personalized recommendations 
          for better money management and financial goal achievement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Setup
              </CardTitle>
              <CardDescription>
                Set your income and budget categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly After-Tax Income ($)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Needs (50%)</h3>
                  <Button variant="outline" size="sm" onClick={() => addCategory('needs')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {categories.filter(cat => cat.type === 'needs').map((category) => (
                  <div key={category.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Budgeted</Label>
                        <Input
                          type="number"
                          value={category.budgeted}
                          onChange={(e) => updateCategory(category.id, 'budgeted', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Spent</Label>
                        <Input
                          type="number"
                          value={category.spent}
                          onChange={(e) => updateCategory(category.id, 'spent', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Wants (30%)</h3>
                  <Button variant="outline" size="sm" onClick={() => addCategory('wants')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {categories.filter(cat => cat.type === 'wants').map((category) => (
                  <div key={category.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Budgeted</Label>
                        <Input
                          type="number"
                          value={category.budgeted}
                          onChange={(e) => updateCategory(category.id, 'budgeted', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Spent</Label>
                        <Input
                          type="number"
                          value={category.spent}
                          onChange={(e) => updateCategory(category.id, 'spent', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Savings (20%)</h3>
                  <Button variant="outline" size="sm" onClick={() => addCategory('savings')}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {categories.filter(cat => cat.type === 'savings').map((category) => (
                  <div key={category.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Budgeted</Label>
                        <Input
                          type="number"
                          value={category.budgeted}
                          onChange={(e) => updateCategory(category.id, 'budgeted', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Spent</Label>
                        <Input
                          type="number"
                          value={category.spent}
                          onChange={(e) => updateCategory(category.id, 'spent', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {analysis && (
            <div className="space-y-4">
              {/* Recommendation Banner */}
              <Card className={`border-2 ${getRecommendationColor(analysis.recommendation)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {analysis.recommendation === 'excellent' || analysis.recommendation === 'good' ? (
                      <TrendingUp className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                    <div>
                      <h3 className="font-semibold">{getRecommendationText(analysis.recommendation)}</h3>
                      <p className="text-sm opacity-80">
                        Based on the 50/30/20 budgeting rule
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
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(analysis.totalIncome)}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(analysis.totalSpent)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className={`text-3xl font-bold ${analysis.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(analysis.remaining)}
                        </p>
                      </div>
                      <PieChart className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div>
                      <h3 className="font-semibold mb-3">50/30/20 Rule Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Needs</span>
                          <Badge variant={analysis.needsPercentage <= 50 ? "default" : "destructive"}>
                            {analysis.needsPercentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Wants</span>
                          <Badge variant={analysis.wantsPercentage <= 30 ? "default" : "destructive"}>
                            {analysis.wantsPercentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Savings</span>
                          <Badge variant={analysis.savingsPercentage >= 20 ? "default" : "destructive"}>
                            {analysis.savingsPercentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>
                    Track how well you&apos;re sticking to your budget in each category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const variance = category.spent - category.budgeted;
                      const percentVariance = category.budgeted > 0 ? (variance / category.budgeted) * 100 : 0;
                      
                      return (
                        <div key={category.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge className={getCategoryColor(category.type)}>
                              {category.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Budgeted</p>
                              <p className="font-semibold">{formatCurrency(category.budgeted)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Spent</p>
                              <p className="font-semibold">{formatCurrency(category.spent)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Variance</p>
                              <p className={`font-semibold ${variance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(variance)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">% Variance</p>
                              <p className={`font-semibold ${percentVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {percentVariance > 0 ? '+' : ''}{percentVariance.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Budget Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">💰 The 50/30/20 Rule</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>50% Needs:</strong> Essential expenses (housing, food, utilities)</li>
                <li>• <strong>30% Wants:</strong> Discretionary spending (entertainment, dining)</li>
                <li>• <strong>20% Savings:</strong> Emergency fund, retirement, investments</li>
                <li>• Adjust percentages based on your financial situation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 Budget Management Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Track expenses regularly and update spent amounts</li>
                <li>• Review and adjust categories monthly</li>
                <li>• Use the variance analysis to identify problem areas</li>
                <li>• Automate savings to ensure you meet your goals</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🎯 Budget Success Strategy</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Start with realistic budgets and gradually optimize. Focus on automating savings first, then work on reducing unnecessary wants. 
              Remember that budgeting is a skill that improves with practice - be patient and adjust as you learn your spending patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPlanner;
