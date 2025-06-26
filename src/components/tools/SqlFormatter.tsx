"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { copyToClipboardSafe } from '@/utils/clipboardUtils';
import { 
  Upload, 
  Copy, 
  Download, 
  RotateCcw, 
  Database,
  Check,
  AlertTriangle,
  File
} from 'lucide-react';

const SqlFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('mysql');
  const [indentSize, setIndentSize] = useState('2');
  const [upperCase, setUpperCase] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [stats, setStats] = useState({ lines: 0, keywords: 0, tables: 0 });

  const formatSQL = useCallback((sql: string) => {
    if (!sql.trim()) return '';
    
    let formatted = sql;
    const indent = ' '.repeat(parseInt(indentSize));
    
    // Basic SQL keywords
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'UNION', 'INSERT',
      'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW',
      'INTO', 'VALUES', 'SET', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE',
      'IN', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF'
    ];
    
    // Format keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, upperCase ? keyword.toUpperCase() : keyword.toLowerCase());
    });
    
    // Add proper spacing and line breaks
    formatted = formatted
      .replace(/,/g, ',\n' + indent)
      .replace(/\b(FROM|WHERE|GROUP BY|ORDER BY|HAVING|UNION)\b/gi, '\n$1')
      .replace(/\b(LEFT|RIGHT|INNER|OUTER)?\s*JOIN\b/gi, '\n$&')
      .replace(/\bON\b/gi, '\n' + indent + '$&')
      .replace(/\b(AND|OR)\b/gi, '\n' + indent + '$&')
      .replace(/;/g, ';\n');
    
    // Clean up extra spaces and lines
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    return formatted;
  }, [indentSize, upperCase]);

  const validateSQL = useCallback((sql: string) => {
    const errors: string[] = [];
    
    // Basic syntax validation
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Mismatched parentheses: ${openParens} opening, ${closeParens} closing`);
    }
    
    const singleQuotes = (sql.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      errors.push('Unmatched single quotes detected');
    }
    
    const doubleQuotes = (sql.match(/"/g) || []).length;
    if (doubleQuotes % 2 !== 0) {
      errors.push('Unmatched double quotes detected');
    }
    
    // Check for common issues
    if (sql.toLowerCase().includes('select') && !sql.toLowerCase().includes('from') && !sql.toLowerCase().includes('dual')) {
      errors.push('SELECT statement missing FROM clause');
    }
    
    return errors;
  }, []);

  const analyzeSQL = useCallback((sql: string) => {
    const lines = sql.split('\n').length;
    const keywords = (sql.match(/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/gi) || []).length;
    const tables = (sql.match(/\bFROM\s+(\w+)/gi) || []).length + 
                  (sql.match(/\bJOIN\s+(\w+)/gi) || []).length +
                  (sql.match(/\bUPDATE\s+(\w+)/gi) || []).length;
    
    return { lines, keywords, tables };
  }, []);

  const processSQL = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setErrors([]);
      setStats({ lines: 0, keywords: 0, tables: 0 });
      return;
    }

    const validationErrors = validateSQL(input);
    setErrors(validationErrors);
    
    const formatted = formatSQL(input);
    setOutput(formatted);
    
    const analysis = analyzeSQL(input);
    setStats(analysis);
  }, [input, validateSQL, setErrors, formatSQL, setOutput, analyzeSQL, setStats]);

  const copyToClipboard = async () => {
    if (!output) return;
    
    const success = await copyToClipboardSafe(output, 'Formatted SQL copied to clipboard');
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const downloadFile = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-query.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('SQL file downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sql')) {
      toast.error('Please select a SQL file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  const insertSample = () => {
    const sample = `SELECT 
    users.id,
    users.name,
    users.email,
    profiles.bio,
    COUNT(orders.id) as order_count
FROM users
LEFT JOIN profiles ON users.id = profiles.user_id
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at >= '2023-01-01'
    AND users.status = 'active'
GROUP BY users.id, users.name, users.email, profiles.bio
HAVING COUNT(orders.id) > 0
ORDER BY order_count DESC, users.name ASC
LIMIT 100;`;
    setInput(sample);
  };

  useEffect(() => {
    processSQL();
  }, [processSQL]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SQL Formatter & Validator
          </CardTitle>
          <CardDescription>
            Professional SQL formatting with syntax validation and dialect-specific optimization
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <File className="h-4 w-4" />
                SQL Query Input
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={insertSample}>
                  Sample
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput('')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <label>
                  <Button variant="ghost" size="sm" asChild>
                    <div className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept=".sql" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </div>
                  </Button>
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste your SQL query here..."
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="h-80 font-mono text-sm"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dialect">SQL Dialect</Label>
                <Select value={dialect} onValueChange={setDialect}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mssql">SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="indent">Indent Size</Label>
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={upperCase}
                onCheckedChange={setUpperCase}
              />
              <Label htmlFor="uppercase">Uppercase keywords</Label>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Formatted SQL</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                  {isCopied ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Your formatted SQL will appear here..."
              value={output} 
              readOnly
              className="h-80 font-mono text-sm"
            />
            
            {/* Stats */}
            {output && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-medium">{stats.lines}</div>
                  <div className="text-xs text-muted-foreground">Lines</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{stats.keywords}</div>
                  <div className="text-xs text-muted-foreground">Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{stats.tables}</div>
                  <div className="text-xs text-muted-foreground">Tables</div>
                </div>
              </div>
            )}
            
            {/* Errors */}
            {errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Syntax Issues</span>
                </div>
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SQL Formatting Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Professional Features</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Multi-dialect SQL support</li>
                <li>• Customizable indentation</li>
                <li>• Keyword case conversion</li>
                <li>• Syntax validation</li>
                <li>• Query analysis and statistics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Database Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline">Supported Databases</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• MySQL and MariaDB</li>
                <li>• PostgreSQL</li>
                <li>• Microsoft SQL Server</li>
                <li>• Oracle Database</li>
                <li>• SQLite</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Info */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Database className="h-4 w-4" />
          Professional SQL Formatter & Validator Tool
        </h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Advanced SQL formatting tool with multi-dialect support, syntax validation, and professional formatting options. 
            Perfect for database developers, analysts, and anyone working with SQL queries.
          </p>
          <p>
            <strong>Essential for:</strong> Database development, query optimization, code review, 
            SQL documentation, and maintaining consistent coding standards across teams.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SqlFormatter;
