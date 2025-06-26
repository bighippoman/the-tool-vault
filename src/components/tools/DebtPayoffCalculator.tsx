
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimumPayment: number;
  interestRate: number;
}

interface PayoffStrategy {
  method: 'snowball' | 'avalanche';
  totalMonths: number;
  totalInterest: number;
  monthlyPayment: number;
  schedule: Array<{
    month: number;
    debts: Array<{
      name: string;
      payment: number;
      balance: number;
      isComplete: boolean;
    }>;
  }>;
}

const DebtPayoffCalculator = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, minimumPayment: 150, interestRate: 18.99 },
    { id: '2', name: 'Credit Card 2', balance: 3000, minimumPayment: 90, interestRate: 15.99 },
    { id: '3', name: 'Student Loan', balance: 15000, minimumPayment: 200, interestRate: 6.8 }
  ]);
  const [extraPayment, setExtraPayment] = useState('200');
  const [snowballStrategy, setSnowballStrategy] = useState<PayoffStrategy | null>(null);
  const [avalancheStrategy, setAvalancheStrategy] = useState<PayoffStrategy | null>(null);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: 0,
      minimumPayment: 0,
      interestRate: 0
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const calculatePayoffStrategy = useCallback((method: 'snowball' | 'avalanche'): PayoffStrategy => {
    const workingDebts = debts.map(debt => ({ ...debt }));
    const totalMinimum = workingDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const monthlyPayment = totalMinimum + parseFloat(extraPayment);
    
    // Sort debts based on strategy
    if (method === 'snowball') {
      workingDebts.sort((a, b) => a.balance - b.balance);
    } else {
      workingDebts.sort((a, b) => b.interestRate - a.interestRate);
    }

    const schedule = [];
    let month = 0;
    let totalInterest = 0;

    while (workingDebts.some(debt => debt.balance > 0)) {
      month++;
      let remainingExtra = parseFloat(extraPayment);

      // Apply interest to all debts
      workingDebts.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.interestRate / 100) / 12;
          debt.balance += monthlyInterest;
          totalInterest += monthlyInterest;
        }
      });

      const monthData = {
        month,
        debts: workingDebts.map(debt => {
          let payment = 0;
          let isComplete = false;

          if (debt.balance > 0) {
            payment = debt.minimumPayment;
            debt.balance -= payment;

            // Apply extra payment to first debt in priority order
            if (remainingExtra > 0 && debt === workingDebts.find(d => d.balance > 0)) {
              const extraToApply = Math.min(remainingExtra, debt.balance);
              payment += extraToApply;
              debt.balance -= extraToApply;
              remainingExtra -= extraToApply;
            }

            if (debt.balance <= 0) {
              payment += debt.balance; // Refund overpayment
              debt.balance = 0;
              isComplete = true;
            }
          }

          return {
            name: debt.name,
            payment: Math.max(0, payment),
            balance: Math.max(0, debt.balance),
            isComplete
          };
        })
      };

      schedule.push(monthData);

      if (month > 600) break; // Safety limit
    }

    return {
      method,
      totalMonths: month,
      totalInterest,
      monthlyPayment,
      schedule: schedule.slice(0, 12) // Show first 12 months
    };
  }, [debts, extraPayment]);

  useEffect(() => {
    if (debts.length > 0 && debts.every(debt => debt.balance > 0)) {
      setSnowballStrategy(calculatePayoffStrategy('snowball'));
      setAvalancheStrategy(calculatePayoffStrategy('avalanche'));
    } else if (debts.length === 0) { // Clear strategies if all debts are removed
      setSnowballStrategy(null);
      setAvalancheStrategy(null);
    }
  }, [debts, extraPayment, calculatePayoffStrategy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Smart Debt Payoff Calculator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create optimized debt payoff strategies using snowball and avalanche methods. 
          Compare different approaches and visualize your path to financial freedom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Your Debts
              </CardTitle>
              <CardDescription>
                Add all your debts to calculate payoff strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {debts.map(debt => (
                <div key={debt.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      placeholder="Debt name"
                      className="font-medium"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebt(debt.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Balance ($)</Label>
                    <Input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Minimum Payment ($)</Label>
                    <Input
                      type="number"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={debt.interestRate}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addDebt}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Debt
              </Button>

              <div className="pt-4 border-t">
                <Label htmlFor="extraPayment">Extra Monthly Payment ($)</Label>
                <Input
                  id="extraPayment"
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  placeholder="200"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Additional amount beyond minimum payments
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {snowballStrategy && avalancheStrategy && (
            <Tabs defaultValue="comparison" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
                <TabsTrigger value="snowball">Snowball Method</TabsTrigger>
                <TabsTrigger value="avalanche">Avalanche Method</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Debt Snowball</CardTitle>
                      <CardDescription>Pay smallest balances first</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Payoff Time:</span>
                        <Badge variant="outline">{formatMonths(snowballStrategy.totalMonths)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-semibold">{formatCurrency(snowballStrategy.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold">{formatCurrency(snowballStrategy.monthlyPayment)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Best for:</strong> Motivation and quick wins
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700">Debt Avalanche</CardTitle>
                      <CardDescription>Pay highest interest rates first</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Payoff Time:</span>
                        <Badge variant="outline">{formatMonths(avalancheStrategy.totalMonths)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-semibold">{formatCurrency(avalancheStrategy.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-semibold">{formatCurrency(avalancheStrategy.monthlyPayment)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Best for:</strong> Minimizing total interest
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Potential Savings</h3>
                      {avalancheStrategy.totalInterest < snowballStrategy.totalInterest ? (
                        <p className="text-green-600">
                          Avalanche method saves{' '}
                          <span className="font-bold">
                            {formatCurrency(snowballStrategy.totalInterest - avalancheStrategy.totalInterest)}
                          </span>{' '}
                          in interest compared to snowball
                        </p>
                      ) : (
                        <p className="text-blue-600">
                          Both methods have similar total interest costs
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="snowball" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Snowball Method - Payment Schedule</CardTitle>
                    <CardDescription>First 12 months of payments (smallest balances first)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            {debts.map(debt => (
                              <th key={debt.id} className="text-left p-2">{debt.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {snowballStrategy.schedule.map(month => (
                            <tr key={month.month} className="border-b">
                              <td className="p-2 font-medium">{month.month}</td>
                              {month.debts.map(debt => (
                                <td key={debt.name} className={`p-2 ${debt.isComplete ? 'text-green-600 font-semibold' : ''}`}>
                                  {debt.isComplete ? 'PAID OFF!' : formatCurrency(debt.balance)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="avalanche" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Avalanche Method - Payment Schedule</CardTitle>
                    <CardDescription>First 12 months of payments (highest interest rates first)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            {debts.map(debt => (
                              <th key={debt.id} className="text-left p-2">{debt.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {avalancheStrategy.schedule.map(month => (
                            <tr key={month.month} className="border-b">
                              <td className="p-2 font-medium">{month.month}</td>
                              {month.debts.map(debt => (
                                <td key={debt.name} className={`p-2 ${debt.isComplete ? 'text-green-600 font-semibold' : ''}`}>
                                  {debt.isComplete ? 'PAID OFF!' : formatCurrency(debt.balance)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
          <CardTitle>How to Use This Debt Payoff Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📊 Understanding the Methods</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Snowball:</strong> Pay minimums on all debts, extra goes to smallest balance</li>
                <li>• <strong>Avalanche:</strong> Pay minimums on all debts, extra goes to highest interest rate</li>
                <li>• Snowball provides psychological wins and motivation</li>
                <li>• Avalanche minimizes total interest paid</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💡 Debt Payoff Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Stop using credit cards while paying off debt</li>
                <li>• Find extra money through budgeting and side income</li>
                <li>• Consider debt consolidation for high-interest debt</li>
                <li>• Celebrate milestones to stay motivated</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🎯 Success Strategy</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Choose the method that fits your personality: snowball for motivation and quick wins, or avalanche for maximum mathematical efficiency. 
              The most important factor is consistency - stick to your chosen method and make those extra payments every month!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebtPayoffCalculator;
