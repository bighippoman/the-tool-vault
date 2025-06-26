'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RetirementProjection {
  finalBalance: number;
  totalContributions: number;
  totalGrowth: number;
  monthlyWithdrawal: number;
  shortfall: number;
  monthlyNeeded: number;
  projectionByAge: Array<{
    age: number;
    balance: number;
    contributions: number;
  }>;
  recommendation: 'on-track' | 'needs-improvement' | 'critical';
}

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('25000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [expectedReturn, setExpectedReturn] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState('5000');
  const [socialSecurityIncome, setSocialSecurityIncome] = useState('1800');
  const [projection, setProjection] = useState<RetirementProjection | null>(null);

  const calculateRetirement = useCallback(() => {
    const currentAgeNum = parseFloat(currentAge);
    const retirementAgeNum = parseFloat(retirementAge);
    const yearsToRetirement = retirementAgeNum - currentAgeNum;
    const currentSavingsNum = parseFloat(currentSavings);
    const monthlyContributionNum = parseFloat(monthlyContribution);
    const expectedReturnNum = parseFloat(expectedReturn) / 100;
    const inflationRateNum = parseFloat(inflationRate) / 100;
    const desiredMonthlyIncomeNum = parseFloat(desiredMonthlyIncome);
    const socialSecurityIncomeNum = parseFloat(socialSecurityIncome);

    if (yearsToRetirement <= 0) return;

    // Calculate future value of current savings
    const futureValueCurrent = currentSavingsNum * Math.pow(1 + expectedReturnNum, yearsToRetirement);
    
    // Calculate future value of monthly contributions (annuity)
    const monthlyRate = expectedReturnNum / 12;
    const totalMonths = yearsToRetirement * 12;
    const futureValueContributions = monthlyContributionNum * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const finalBalance = futureValueCurrent + futureValueContributions;
    const totalContributions = currentSavingsNum + (monthlyContributionNum * totalMonths);
    const totalGrowth = finalBalance - totalContributions;
    
    // Calculate 4% withdrawal rule
    const annualWithdrawal = finalBalance * 0.04;
    const monthlyWithdrawal = annualWithdrawal / 12;
    
    // Adjust desired income for inflation
    const inflationAdjustedIncome = desiredMonthlyIncomeNum * Math.pow(1 + inflationRateNum, yearsToRetirement);
    const totalNeededIncome = inflationAdjustedIncome - socialSecurityIncomeNum;
    
    // Calculate shortfall
    const shortfall = Math.max(0, totalNeededIncome - monthlyWithdrawal);
    const monthlyNeeded = shortfall > 0 ? 
      (shortfall * 12 / 0.04 - finalBalance) / ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : 0;
    
    // Generate projection by age
    const projectionByAge = [];
    for (let age = currentAgeNum; age <= retirementAgeNum; age += 5) {
      const yearsFromNow = age - currentAgeNum;
      const monthsFromNow = yearsFromNow * 12;
      
      const currentBalance = currentSavingsNum * Math.pow(1 + expectedReturnNum, yearsFromNow);
      const contributionBalance = monthsFromNow > 0 ? 
        monthlyContributionNum * ((Math.pow(1 + monthlyRate, monthsFromNow) - 1) / monthlyRate) : 0;
      
      projectionByAge.push({
        age,
        balance: currentBalance + contributionBalance,
        contributions: currentSavingsNum + (monthlyContributionNum * monthsFromNow)
      });
    }
    
    // Determine recommendation
    let recommendation: 'on-track' | 'needs-improvement' | 'critical';
    if (shortfall === 0) {
      recommendation = 'on-track';
    } else if (shortfall < totalNeededIncome * 0.25) {
      recommendation = 'needs-improvement';
    } else {
      recommendation = 'critical';
    }
    
    setProjection({
      finalBalance,
      totalContributions,
      totalGrowth,
      monthlyWithdrawal,
      shortfall,
      monthlyNeeded,
      projectionByAge,
      recommendation
    });
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, inflationRate, desiredMonthlyIncome, socialSecurityIncome]);

  useEffect(() => {
    calculateRetirement();
  }, [calculateRetirement]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'on-track': return 'On Track - Your retirement savings are on pace to meet your goals';
      case 'needs-improvement': return 'Needs Improvement - Consider increasing contributions or adjusting goals';
      case 'critical': return 'Critical - Significant changes needed to meet retirement goals';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Advanced Retirement Calculator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Plan your retirement with detailed projections, inflation adjustments, and multiple scenario analysis. 
          Get personalized recommendations to achieve your retirement goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Retirement Planning
              </CardTitle>
              <CardDescription>
                Enter your retirement planning details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    placeholder="65"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentSavings">Current Retirement Savings ($)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="25000"
                />
              </div>

              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500"
                />
              </div>

              <div>
                <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="7"
                />
              </div>

              <div>
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3"
                />
              </div>

              <div>
                <Label htmlFor="desiredMonthlyIncome">Desired Monthly Income (Today&apos;s $)</Label>
                <Input
                  id="desiredMonthlyIncome"
                  type="number"
                  value={desiredMonthlyIncome}
                  onChange={(e) => setDesiredMonthlyIncome(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div>
                <Label htmlFor="socialSecurityIncome">Expected Social Security (Today&apos;s $)</Label>
                <Input
                  id="socialSecurityIncome"
                  type="number"
                  value={socialSecurityIncome}
                  onChange={(e) => setSocialSecurityIncome(e.target.value)}
                  placeholder="1800"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {projection && (
            <div className="space-y-4">
              {/* Recommendation Banner */}
              <Card className={`border-2 ${getRecommendationColor(projection.recommendation)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{getRecommendationText(projection.recommendation)}</h3>
                      <p className="text-sm opacity-80">
                        Based on 4% withdrawal rule and inflation adjustments
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
                        <p className="text-sm text-muted-foreground">Projected Savings at Retirement</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(projection.finalBalance)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Investment Growth</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(projection.totalGrowth)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Contributions</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(projection.totalContributions)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Shortfall</p>
                        <p className="text-3xl font-bold text-red-600">
                          {projection.shortfall > 0 ? formatCurrency(projection.monthlyNeeded) : 'On Track!'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {projection.shortfall > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Action Needed
                    </h3>
                    <p className="text-orange-700 dark:text-orange-300">
                      To meet your retirement goals, consider increasing your monthly contribution by{' '}
                      <span className="font-semibold">{formatCurrency(projection.monthlyNeeded)}</span>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Retirement Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Planning Your Retirement</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Uses the 4% withdrawal rule for sustainable income</li>
                <li>• Adjusts for inflation to maintain purchasing power</li>
                <li>• Includes Social Security in income calculations</li>
                <li>• Assumes compound interest on investments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Retirement Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Start saving early to benefit from compound interest</li>
                <li>• Increase contributions with salary raises</li>
                <li>• Take advantage of employer 401(k) matching</li>
                <li>• Consider Roth vs Traditional retirement accounts</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Assumptions</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This calculator uses historical market averages and standard retirement planning rules. 
              Actual results may vary based on market performance, life expectancy, healthcare costs, and other factors. 
              Consider consulting with a financial advisor for personalized retirement planning advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementCalculator;
