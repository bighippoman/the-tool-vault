'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface EmergencyFundPlan {
  recommendedAmount: number;
  currentSavings: number;
  monthsToGoal: number;
  monthlySavingsNeeded: number;
  totalWithInterest: number;
  savingsSchedule: Array<{
    month: number;
    saved: number;
    balance: number;
    progress: number;
  }>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const EmergencyFundCalculator = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState('3500');
  const [currentSavings, setCurrentSavings] = useState('2000');
  const [monthlySavings, setMonthlySavings] = useState('300');
  const [targetMonths, setTargetMonths] = useState('6');
  const [savingsInterestRate, setSavingsInterestRate] = useState('4.5');
  const [jobSecurity, setJobSecurity] = useState('stable');
  const [dependents, setDependents] = useState('1');
  const [plan, setPlan] = useState<EmergencyFundPlan | null>(null);

  const calculateEmergencyFund = useCallback(() => {
    const expenses = parseFloat(monthlyExpenses);
    const current = parseFloat(currentSavings);
    const monthly = parseFloat(monthlySavings);
    const months = parseFloat(targetMonths);
    const rate = parseFloat(savingsInterestRate) / 100 / 12;
    
    // Adjust recommended months based on circumstances
    let recommendedMonths = months;
    if (jobSecurity === 'unstable') recommendedMonths += 2;
    if (jobSecurity === 'very-unstable') recommendedMonths += 4;
    if (parseInt(dependents) > 2) recommendedMonths += 1;
    if (parseInt(dependents) > 4) recommendedMonths += 2;
    
    const recommendedAmount = expenses * recommendedMonths;
    const shortfall = Math.max(0, recommendedAmount - current);
    const monthsToGoal = monthly > 0 ? Math.ceil(shortfall / monthly) : 0;
    
    // Calculate with compound interest
    let totalWithInterest = current;
    const savingsSchedule = [];
    
    for (let month = 1; month <= Math.min(monthsToGoal, 60); month++) {
      totalWithInterest += monthly;
      totalWithInterest *= (1 + rate);
      
      const progress = (totalWithInterest / recommendedAmount) * 100;
      
      savingsSchedule.push({
        month,
        saved: month * monthly,
        balance: totalWithInterest,
        progress: Math.min(100, progress)
      });
      
      if (totalWithInterest >= recommendedAmount) break;
    }
    
    // Determine risk level
    let riskLevel: EmergencyFundPlan['riskLevel'] = 'low';
    const currentMonthsCovered = current / expenses;
    
    if (currentMonthsCovered < 1) {
      riskLevel = 'critical';
    } else if (currentMonthsCovered < 3) {
      riskLevel = 'high';
    } else if (currentMonthsCovered < recommendedMonths) {
      riskLevel = 'medium';
    }

    setPlan({
      recommendedAmount,
      currentSavings: current,
      monthsToGoal,
      monthlySavingsNeeded: shortfall / monthsToGoal,
      totalWithInterest,
      savingsSchedule: savingsSchedule.slice(0, 12), // Show first 12 months
      riskLevel
    });
  }, [monthlyExpenses, currentSavings, monthlySavings, targetMonths, savingsInterestRate, jobSecurity, dependents]);

  useEffect(() => {
    calculateEmergencyFund();
  }, [calculateEmergencyFund]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Low Risk - You have adequate emergency savings';
      case 'medium': return 'Medium Risk - Build up your emergency fund further';
      case 'high': return 'High Risk - Priority: Increase emergency savings immediately';
      case 'critical': return 'Critical Risk - Emergency fund is insufficient for financial security';
      default: return '';
    }
  };

  const getCurrentMonthsCovered = () => {
    return parseFloat(currentSavings) / parseFloat(monthlyExpenses);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Emergency Fund Calculator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your ideal emergency fund size based on your expenses, job security, and family situation. 
          Create a personalized savings plan to achieve financial security and peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Fund Details
              </CardTitle>
              <CardDescription>
                Enter your financial information to calculate your ideal emergency fund
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Essential Expenses ($)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  placeholder="3500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include housing, utilities, food, transportation, minimum debt payments
                </p>
              </div>

              <div>
                <Label htmlFor="currentSavings">Current Emergency Savings ($)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="2000"
                />
              </div>

              <div>
                <Label htmlFor="monthlySavings">Monthly Savings Ability ($)</Label>
                <Input
                  id="monthlySavings"
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(e.target.value)}
                  placeholder="300"
                />
              </div>

              <div>
                <Label htmlFor="targetMonths">Target Months of Expenses</Label>
                <Input
                  id="targetMonths"
                  type="number"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(e.target.value)}
                  placeholder="6"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Standard recommendation: 3-6 months
                </p>
              </div>

              <div>
                <Label htmlFor="savingsInterestRate">Savings Account Interest Rate (%)</Label>
                <Input
                  id="savingsInterestRate"
                  type="number"
                  step="0.1"
                  value={savingsInterestRate}
                  onChange={(e) => setSavingsInterestRate(e.target.value)}
                  placeholder="4.5"
                />
              </div>

              <div>
                <Label htmlFor="jobSecurity">Job Security Level</Label>
                <select
                  id="jobSecurity"
                  value={jobSecurity}
                  onChange={(e) => setJobSecurity(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="very-stable">Very Stable (Government, Tenure)</option>
                  <option value="stable">Stable (Established Company)</option>
                  <option value="unstable">Unstable (Contract, Startup)</option>
                  <option value="very-unstable">Very Unstable (Freelance, Commission)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  placeholder="1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {plan && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Fund Overview</TabsTrigger>
                <TabsTrigger value="savings-plan">Savings Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Risk Assessment Banner */}
                <Card className={`border-2 ${getRiskColor(plan.riskLevel)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      {plan.riskLevel === 'low' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertTriangle className="h-6 w-6" />
                      )}
                      <div>
                        <h3 className="font-semibold">{getRiskText(plan.riskLevel)}</h3>
                        <p className="text-sm opacity-80">
                          Current coverage: {getCurrentMonthsCovered().toFixed(1)} months of expenses
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
                          <p className="text-sm text-muted-foreground">Recommended Emergency Fund</p>
                          <p className="text-3xl font-bold text-primary">
                            {formatCurrency(plan.recommendedAmount)}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Savings</p>
                          <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(plan.currentSavings)}
                          </p>
                        </div>
                        <Shield className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Time to Goal</p>
                          <p className="text-3xl font-bold">
                            {plan.monthsToGoal} months
                          </p>
                        </div>
                        <Calendar className="h-8 w-8" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Final Balance (with interest)</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {formatCurrency(plan.totalWithInterest)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Fund Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Current Progress</span>
                          <span>{((plan.currentSavings / plan.recommendedAmount) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (plan.currentSavings / plan.recommendedAmount) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount Still Needed</p>
                          <p className="font-semibold">{formatCurrency(plan.recommendedAmount - plan.currentSavings)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Months Coverage Goal</p>
                          <p className="font-semibold">{parseFloat(targetMonths)} months</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="savings-plan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>12-Month Savings Schedule</CardTitle>
                    <CardDescription>
                      Track your progress toward your emergency fund goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            <th className="text-left p-2">Monthly Deposit</th>
                            <th className="text-left p-2">Total Balance</th>
                            <th className="text-left p-2">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plan.savingsSchedule.map((month) => (
                            <tr key={month.month} className="border-b">
                              <td className="p-2 font-medium">{month.month}</td>
                              <td className="p-2">{formatCurrency(parseFloat(monthlySavings))}</td>
                              <td className="p-2 text-primary font-semibold">
                                {formatCurrency(month.balance)}
                              </td>
                              <td className="p-2">
                                <Badge 
                                  variant={month.progress >= 100 ? "default" : "secondary"}
                                  className={month.progress >= 100 ? "bg-green-600" : ""}
                                >
                                  {month.progress.toFixed(1)}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Savings Optimization Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">💡 Ways to Save More</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Set up automatic transfers to savings</li>
                          <li>• Use high-yield savings accounts (4-5% APY)</li>
                          <li>• Save tax refunds and bonuses</li>
                          <li>• Reduce unnecessary subscriptions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">🎯 Emergency Fund Rules</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Keep funds in easily accessible accounts</li>
                          <li>• Only use for true emergencies</li>
                          <li>• Replenish immediately after use</li>
                          <li>• Review and adjust annually</li>
                        </ul>
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
          <CardTitle>How to Use This Emergency Fund Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🛡️ Why Emergency Funds Matter</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Protects against job loss, medical emergencies, major repairs</li>
                <li>• Prevents reliance on high-interest credit cards</li>
                <li>• Provides peace of mind and financial security</li>
                <li>• Acts as a buffer for economic uncertainty</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📈 Building Your Fund</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Start with $1,000 as an initial goal</li>
                <li>• Gradually build to 3-6 months of expenses</li>
                <li>• Higher-risk jobs may need 6-12 months</li>
                <li>• Keep funds liquid but earning interest</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Success Strategy</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Building an emergency fund is a marathon, not a sprint. Start with what you can afford and gradually increase your contributions. 
              Even $25 per month is a good start. The key is consistency and protecting your fund from non-emergency spending.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyFundCalculator;
