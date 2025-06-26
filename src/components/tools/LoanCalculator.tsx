"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState('100000');
  const [interestRate, setInterestRate] = useState('4.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
  });

    const calculateLoan = useCallback(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = (parseFloat(loanTerm) || 0) * 12; // Total number of payments

    if (p <= 0 || r <= 0 || n <= 0) {
      setResults({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
      });
      return;
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    setResults({
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalPayment: isFinite(totalPayment) ? totalPayment : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
    });
  }, [principal, interestRate, loanTerm]);

  useEffect(() => {
    calculateLoan();
  }, [calculateLoan]);



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="loan-calculator-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal" className="text-sm flex items-center gap-1">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  Loan Amount
                </Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="100000"
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interest" className="text-sm flex items-center gap-1">
                  <Percent className="h-3 w-3 sm:h-4 sm:w-4" />
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="interest"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="4.5"
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="term" className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  Loan Term (Years)
                </Label>
                <Input
                  id="term"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="30"
                  className="text-sm sm:text-base"
                />
              </div>
              
              <Button onClick={calculateLoan} className="w-full btn-mobile-friendly">
                <Calculator className="h-4 w-4 sm:mr-2" />
                Calculate Loan
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-lg">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                    {formatCurrency(results.monthlyPayment)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Monthly Payment</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-secondary/50 rounded-lg">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {formatCurrency(results.totalPayment)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Payment</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-destructive/10 rounded-lg">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">
                    {formatCurrency(results.totalInterest)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Interest</div>
                </div>
              </div>
              
              {/* Payment Breakdown */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm sm:text-base">Payment Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Principal:</span>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {formatCurrency(parseFloat(principal) || 0)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {parseFloat(interestRate) || 0}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Loan Term:</span>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {parseFloat(loanTerm) || 0} years
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Payments:</span>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      {(parseFloat(loanTerm) || 0) * 12} payments
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">About Loan Calculations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground">
            This calculator uses the standard loan payment formula to determine your monthly payment amount. 
            The calculation assumes a fixed interest rate over the entire loan term. Actual loan terms may vary 
            based on your credit score, down payment, and lender requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCalculator;
