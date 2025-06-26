"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Home, 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle
} from 'lucide-react';

interface AffordabilityResult {
  maxHomePrice: number;
  maxMonthlyPayment: number;
  downPaymentNeeded: number;
  loanAmount: number;
  frontEndRatio: number;
  backEndRatio: number;
  recommendation: 'excellent' | 'good' | 'risky' | 'too-high';
}

const MortgageAffordabilityCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState('80000');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('7.0');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTax, setPropertyTax] = useState('1.2');
  const [insurance, setInsurance] = useState('0.5');
  const [pmi, setPmi] = useState('0.5');
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const calculateAffordability = useCallback(() => {
    const monthlyIncome = parseFloat(annualIncome) / 12;
    const monthlyDebtPayments = parseFloat(monthlyDebts);
    const downPayment = parseFloat(downPaymentPercent) / 100;
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;
    const propTaxRate = parseFloat(propertyTax) / 100 / 12;
    const insuranceRate = parseFloat(insurance) / 100 / 12;
    const pmiRate = parseFloat(pmi) / 100 / 12;

    // 28% front-end ratio (housing costs only)
    const maxHousingPayment = monthlyIncome * 0.28;
    
    // 36% back-end ratio (total debt including housing)
    const maxTotalDebt = monthlyIncome * 0.36;
    const availableForHousing = maxTotalDebt - monthlyDebtPayments;
    
    // Use the more conservative limit
    const maxMonthlyPayment = Math.min(maxHousingPayment, availableForHousing);

    // Calculate maximum home price
    // Monthly payment = P&I + Property Tax + Insurance + PMI
    let maxHomePrice = 0;
    
    // Iterative approach to find max home price
    for (let price = 100000; price <= 2000000; price += 1000) {
      const loanAmount = price * (1 - downPayment);
      const monthlyPI = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const monthlyPropTax = price * propTaxRate;
      const monthlyInsurance = price * insuranceRate;
      const monthlyPMI = downPayment < 0.2 ? loanAmount * pmiRate : 0;
      
      const totalMonthlyPayment = monthlyPI + monthlyPropTax + monthlyInsurance + monthlyPMI;
      
      if (totalMonthlyPayment <= maxMonthlyPayment) {
        maxHomePrice = price;
      } else {
        break;
      }
    }

    const loanAmount = maxHomePrice * (1 - downPayment);
    const downPaymentNeeded = maxHomePrice * downPayment;
    
    // Calculate ratios for the recommended home price
    const monthlyPI = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const monthlyPropTax = maxHomePrice * propTaxRate;
    const monthlyInsurance = maxHomePrice * insuranceRate;
    const monthlyPMI = downPayment < 0.2 ? loanAmount * pmiRate : 0;
    const totalHousingPayment = monthlyPI + monthlyPropTax + monthlyInsurance + monthlyPMI;
    
    const frontEndRatio = (totalHousingPayment / monthlyIncome) * 100;
    const backEndRatio = ((totalHousingPayment + monthlyDebtPayments) / monthlyIncome) * 100;

    let recommendation: AffordabilityResult['recommendation'] = 'excellent';
    if (backEndRatio > 36 || frontEndRatio > 28) {
      recommendation = 'too-high';
    } else if (backEndRatio > 32 || frontEndRatio > 25) {
      recommendation = 'risky';
    } else if (backEndRatio > 28 || frontEndRatio > 22) {
      recommendation = 'good';
    }

    setResult({
      maxHomePrice,
      maxMonthlyPayment: totalHousingPayment,
      downPaymentNeeded,
      loanAmount,
      frontEndRatio,
      backEndRatio,
      recommendation
    });
  }, [annualIncome, monthlyDebts, downPaymentPercent, interestRate, loanTerm, propertyTax, insurance, pmi]);

  useEffect(() => {
    calculateAffordability();
  }, [calculateAffordability]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'risky': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'too-high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'excellent': return 'Excellent - Very affordable with low debt ratios';
      case 'good': return 'Good - Reasonable debt ratios with some cushion';
      case 'risky': return 'Risky - High debt ratios, consider lower price range';
      case 'too-high': return 'Too High - Exceeds recommended debt-to-income ratios';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Mortgage Affordability Calculator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Determine how much house you can afford based on your income, debts, and down payment. 
          Get detailed affordability analysis with debt-to-income ratios and expert recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <CardDescription>
                Enter your financial details for accurate calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="annualIncome">Annual Gross Income ($)</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="80000"
                />
              </div>

              <div>
                <Label htmlFor="monthlyDebts">Monthly Debt Payments ($)</Label>
                <Input
                  id="monthlyDebts"
                  type="number"
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(e.target.value)}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include car loans, credit cards, student loans, etc.
                </p>
              </div>

              <div>
                <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                <Input
                  id="downPaymentPercent"
                  type="number"
                  step="0.5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(e.target.value)}
                  placeholder="20"
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.0"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="30"
                />
              </div>

              <div>
                <Label htmlFor="propertyTax">Property Tax Rate (% annually)</Label>
                <Input
                  id="propertyTax"
                  type="number"
                  step="0.1"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  placeholder="1.2"
                />
              </div>

              <div>
                <Label htmlFor="insurance">Home Insurance Rate (% annually)</Label>
                <Input
                  id="insurance"
                  type="number"
                  step="0.1"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="0.5"
                />
              </div>

              <div>
                <Label htmlFor="pmi">PMI Rate (% annually)</Label>
                <Input
                  id="pmi"
                  type="number"
                  step="0.1"
                  value={pmi}
                  onChange={(e) => setPmi(e.target.value)}
                  placeholder="0.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only applies if down payment &lt; 20%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {result && (
            <div className="space-y-4">
              {/* Recommendation Banner */}
              <Card className={`border-2 ${getRecommendationColor(result.recommendation)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {result.recommendation === 'excellent' || result.recommendation === 'good' ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                    <div>
                      <h3 className="font-semibold">{getRecommendationText(result.recommendation)}</h3>
                      <p className="text-sm opacity-80">
                        Based on standard debt-to-income ratio guidelines
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
                        <p className="text-sm text-muted-foreground">Maximum Home Price</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(result.maxHomePrice)}
                        </p>
                      </div>
                      <Home className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Down Payment Needed</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(result.downPaymentNeeded)}
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
                        <p className="text-sm text-muted-foreground">Monthly Payment</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(result.maxMonthlyPayment)}
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
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(result.loanAmount)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Mortgage Affordability Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🏠 Understanding Affordability</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Based on 28/36 rule: 28% for housing, 36% total debt</li>
                <li>• Includes principal, interest, taxes, insurance, PMI</li>
                <li>• Considers your existing monthly debt obligations</li>
                <li>• Provides conservative, lender-approved estimates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💡 Tips for Home Buying</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Save for closing costs (2-5% of home price)</li>
                <li>• Consider property taxes and insurance carefully</li>
                <li>• 20% down payment avoids PMI</li>
                <li>• Leave room in budget for maintenance and repairs</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Smart Home Buying Strategy</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This calculator shows the maximum you can afford, but consider buying below this limit to maintain financial flexibility. 
              Factor in future goals, emergency fund needs, and potential income changes when deciding on your home price range.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageAffordabilityCalculator;
