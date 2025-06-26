"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { 
  DollarSign, TrendingUp, TrendingDown, Target, Plus, Trash2, PiggyBank, Lightbulb, AlertTriangle, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

interface Budget {
  category: string;
  budgeted: number;
  spent: number;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

const PersonalFinanceDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food & Dining', budgeted: 500, spent: 0 },
    { category: 'Transportation', budgeted: 300, spent: 0 },
    { category: 'Entertainment', budgeted: 200, spent: 0 },
    { category: 'Shopping', budgeted: 250, spent: 0 },
    { category: 'Bills & Utilities', budgeted: 400, spent: 0 },
    { category: 'Healthcare', budgeted: 150, spent: 0 },
  ]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    type: 'expense' as 'expense' | 'income'
  });
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Calculate totals
  const incomeItems = expenses.filter(e => e.type === 'income');
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  // Update budget spent amounts based on expenses
  useEffect(() => {
    setBudgets(prevBudgets => 
      prevBudgets.map(budget => ({
        ...budget,
        spent: expenses
          .filter(e => e.category === budget.category && e.type === 'expense')
          .reduce((sum, e) => sum + e.amount, 0)
      }))
    );
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0],
      type: newExpense.type
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({ category: '', amount: '', description: '', type: 'expense' });
    toast.success(`${newExpense.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      deadline: newGoal.deadline,
      priority: newGoal.priority
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', target: '', current: '', deadline: '', priority: 'medium' });
    toast.success('Financial goal added successfully!');
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast.success('Transaction removed');
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    toast.success('Goal removed');
  };

  // AI-powered insights
  const generateInsights = () => {
    const insights = [];
    
    // Budget analysis
    const overBudgetCategories = budgets.filter(b => b.spent > b.budgeted);
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Budget Overspend Alert',
        message: `You're over budget in ${overBudgetCategories.length} categories: ${overBudgetCategories.map(b => b.category).join(', ')}`
      });
    }

    // Savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    if (savingsRate < 20) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of income.`
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Great Savings Rate!',
        message: `Your savings rate of ${savingsRate.toFixed(1)}% is excellent. Keep up the good work!`
      });
    }

    // Spending patterns
    const categorySpending = expenses
      .filter(e => e.type === 'expense')
      .reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];
    if (topCategory) {
      insights.push({
        type: 'info',
        title: 'Top Spending Category',
        message: `You spend the most on ${topCategory[0]} ($${topCategory[1].toFixed(2)}). Consider if this aligns with your priorities.`
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Chart data
  const budgetChartData = budgets.map(budget => ({
    category: budget.category,
    budgeted: budget.budgeted,
    spent: budget.spent,
    remaining: Math.max(0, budget.budgeted - budget.spent)
  }));

  const expensesByCategory = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">AI Personal Finance Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive financial management with AI-powered insights and recommendations
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget vs Spending Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spending by Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenses.slice(-5).reverse().map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">{expense.category} • {expense.date}</div>
                    </div>
                    <div className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No transactions yet. Add your first transaction in the Transactions tab.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Add Transaction */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newExpense.type} onValueChange={(value: 'expense' | 'income') => setNewExpense(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {newExpense.type === 'expense' ? (
                        <>
                          <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                          <SelectItem value="Other Income">Other Income</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addExpense} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{expense.description}</span>
                        <Badge variant="outline">{expense.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{expense.category} • {expense.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeExpense(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No transactions yet. Add your first transaction above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map(budget => {
                  const percentUsed = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
                  const isOverBudget = budget.spent > budget.budgeted;
                  
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{budget.category}</span>
                        <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                          ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentUsed, 100)} 
                        className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentUsed.toFixed(1)}% used</span>
                        <span>
                          {isOverBudget 
                            ? `$${(budget.spent - budget.budgeted).toFixed(2)} over budget`
                            : `$${(budget.budgeted - budget.spent).toFixed(2)} remaining`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Add Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Add Financial Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    placeholder="Emergency Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="target">Target Amount ($)</Label>
                  <Input
                    id="target"
                    type="number"
                    step="0.01"
                    placeholder="10000"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="current">Current Amount ($)</Label>
                  <Input
                    id="current"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, current: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addGoal} className="mt-4">
                <Target className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              
              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeGoal(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${(goal.target - goal.current).toFixed(2)} remaining</span>
                        <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {goals.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No financial goals yet. Add your first goal above.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Financial Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    insight.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-start gap-3">
                      {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                      {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                      {insight.type === 'info' && <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />}
                      <div>
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {insights.length === 0 && (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Add some transactions and goals to get AI-powered insights!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalFinanceDashboard;
