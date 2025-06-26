"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, Copy, Sparkles, Lightbulb, Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Solution {
  steps: string[];
  finalAnswer: string;
  explanation: string;
  type: string;
}

const MathProblemSolver = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Example problems for demonstration
  const exampleProblems = [
    {
      category: 'Algebra',
      problems: [
        'Solve for x: 2x + 5 = 13',
        'Factor: x² - 5x + 6',
        'Solve the system: x + y = 7, 2x - y = 2',
        'Simplify: (3x + 2)(x - 4)',
        'Solve: 3x² + 2x - 8 = 0'
      ]
    },
    {
      category: 'Calculus',
      problems: [
        'Find the derivative of f(x) = x³ + 2x² - 4x + 1',
        'Integrate: ∫(2x + 3)dx',
        'Find the limit: lim(x→2) (x² - 4)/(x - 2)',
        'Find critical points of f(x) = x³ - 6x² + 9x',
        'Evaluate: ∫₀² (x² + 1)dx'
      ]
    },
    {
      category: 'Geometry',
      problems: [
        'Find the area of a circle with radius 5',
        'Calculate the volume of a sphere with radius 3',
        'Find the distance between points (1,2) and (4,6)',
        'Calculate the surface area of a cylinder with radius 4 and height 10',
        'Find the area of a triangle with sides 3, 4, and 5'
      ]
    }
  ];

  const solveProblem = async (problemText: string) => {
    setIsLoading(true);
    setSolution(null);
    
    try {
      console.log('Solving problem:', problemText);
      
      const { data, error } = await supabase.functions.invoke('solve-math-problem', {
        body: { problem: problemText }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to solve problem');
      }

      console.log('Solution received:', data);
      
      if (data?.solution) {
        setSolution(data.solution);
        toast.success('Problem solved successfully!');
      } else {
        throw new Error('No solution received');
      }

    } catch (error) {
      console.error('Error solving problem:', error);
      toast.error('Failed to solve problem. Please try again.');
      
      // Show fallback solution
      setSolution({
        steps: [
          'Error occurred while solving the problem',
          'Please check your internet connection and try again',
          'Make sure the problem is clearly written'
        ],
        finalAnswer: 'Unable to solve',
        explanation: 'There was an issue processing your request. Please try again.',
        type: 'Error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolve = () => {
    if (!problem.trim()) {
      toast.error('Please enter a math problem to solve');
      return;
    }
    solveProblem(problem);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const loadExample = (exampleProblem: string) => {
    setProblem(exampleProblem);
    setSolution(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI-Powered Math Problem Solver</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Solve complex mathematical equations with AI-powered step-by-step solutions, detailed explanations, and interactive problem-solving guidance.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary">Step-by-Step Solutions</Badge>
          <Badge variant="secondary">Algebra & Calculus</Badge>
          <Badge variant="secondary">Geometry & Statistics</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Input */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Enter Your Problem
              </CardTitle>
              <CardDescription>
                Type any math problem for AI-powered step-by-step solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="problem">Math Problem</Label>
                <Textarea
                  id="problem"
                  placeholder="e.g., Solve for x: 2x + 5 = 13"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleSolve} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Solving with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Solve with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Example Problems - Fixed Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Example Problems
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="algebra" className="w-full">
                <div className="px-4 mb-4">
                  <TabsList className="grid w-full grid-cols-3 h-auto max-w-full">
                    <TabsTrigger value="algebra" className="text-xs sm:text-sm px-1 py-2 truncate">Algebra</TabsTrigger>
                    <TabsTrigger value="calculus" className="text-xs sm:text-sm px-1 py-2 truncate">Calculus</TabsTrigger>
                    <TabsTrigger value="geometry" className="text-xs sm:text-sm px-1 py-2 truncate">Geometry</TabsTrigger>
                  </TabsList>
                </div>
                
                {exampleProblems.map((category) => (
                  <TabsContent key={category.category.toLowerCase()} value={category.category.toLowerCase()} className="px-4 pb-4">
                    <div className="space-y-2">
                      {category.problems.map((prob, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start h-auto p-3 text-wrap"
                          onClick={() => loadExample(prob)}
                        >
                          <div className="text-sm whitespace-normal break-words">{prob}</div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Solution Display */}
        <div className="lg:col-span-2">
          {solution ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Step-by-Step Solution
                  </CardTitle>
                  <Badge variant="outline">{solution.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Steps */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Solution Steps</Label>
                  <div className="space-y-3">
                    {solution.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Answer */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold text-green-900">Final Answer</Label>
                      <p className="text-lg font-mono text-green-800 mt-1">{solution.finalAnswer}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(solution.finalAnswer)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <Label className="text-base font-semibold mb-2 block">AI Explanation</Label>
                  <p className="text-muted-foreground bg-blue-50 p-4 rounded-lg">
                    {solution.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Solve with AI</h3>
                <p className="text-muted-foreground">
                  Enter a math problem on the left to see AI-powered step-by-step solutions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features Guide */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Problem Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Algebra</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Linear equations</li>
                <li>Quadratic equations</li>
                <li>System of equations</li>
                <li>Factoring</li>
                <li>Polynomial operations</li>
              </ul>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Calculus</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Derivatives</li>
                <li>Integrals</li>
                <li>Limits</li>
                <li>Optimization</li>
                <li>Related rates</li>
              </ul>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Geometry</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Area & Volume</li>
                <li>Distance & Angles</li>
                <li>Trigonometry</li>
                <li>Coordinate geometry</li>
                <li>3D shapes</li>
              </ul>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Statistics</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Mean & Median</li>
                <li>Standard deviation</li>
                <li>Probability</li>
                <li>Distributions</li>
                <li>Hypothesis testing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathProblemSolver;
