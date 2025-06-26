import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import yaml from 'js-yaml'
import { Builder } from 'xml2js'
import Papa from 'papaparse'
import toml from '@iarna/toml'
import { JSONPath } from 'jsonpath-plus'

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, verbose: true })
addFormats(ajv)

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  securityIssues: SecurityIssue[]
  dataQuality: DataQualityReport
  performance: PerformanceMetrics
  qualityScore: number
  scoreBreakdown: ScoreBreakdown
  recommendations: string[]
}

export interface ScoreBreakdown {
  baseScore: number;
  deductions: ScoreDeduction[];
  bonuses: ScoreBonus[];
  finalScore: number;
  summary: string;
}

export interface ScoreDeduction {
  category: 'syntax' | 'security' | 'data-quality' | 'performance' | 'structure' | 'best-practice';
  reason: string;
  impact: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ScoreBonus {
  category: 'excellence' | 'performance' | 'structure' | 'best-practice';
  reason: string;
  impact: number;
}

export interface ValidationError {
  path: string
  message: string
  keyword: string
  schemaPath: string
  data: unknown
  line?: number
  column?: number
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationWarning {
  path: string
  message: string
  type: 'performance' | 'structure' | 'best-practice' | 'security' | 'data-quality'
  severity: 'low' | 'medium' | 'high'
}

export interface SecurityIssue {
  path: string
  type: 'xss' | 'injection' | 'dos' | 'malicious-url' | 'sensitive-data' | 'regex-bomb'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  recommendation: string
}

export interface DataQualityReport {
  completeness: number // % of non-null values
  consistency: number // % of consistent data types
  validity: number // % of valid formatted data
  accuracy: number // % of data matching expected patterns
  duplicates: number // Number of duplicate entries
  anomalies: string[] // Detected anomalies
}

export interface PerformanceMetrics {
  parseTime: number
  validationTime: number
  memoryUsage: number
  complexity: number
  size: number
  bottlenecks: string[]
  optimizationSuggestions: string[]
}

export interface StructureAnalysis {
  depth: number
  keys: number
  objects: number
  arrays: number
  primitives: number
  circularReferences: string[]
  duplicateKeys: string[]
  dataTypes: Map<string, number>
  patterns: Map<string, number>
  nullValues: number
  emptyValues: number
}

export interface SchemaInfo {
  id: string
  name: string
  description: string
  version: string
  schema: object
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export class JsonEnterpriseValidator {
  private schemas: Map<string, SchemaInfo> = new Map()

  // Advanced JSON validation with schema
  async validateWithSchema(json: string, schema?: object): Promise<ValidationResult> {
    const startTime = performance.now()
    
    try {
      const parsed = JSON.parse(json)
      const parseTime = performance.now() - startTime
      
      let validationErrors: ValidationError[] = []
      let validationTime = 0
      
      if (schema) {
        const validationStart = performance.now()
        const validate = ajv.compile(schema)
        const isValid = validate(parsed)
        validationTime = performance.now() - validationStart
        
        if (!isValid && validate.errors) {
          validationErrors = validate.errors.map(error => ({
            path: error.instancePath || error.schemaPath,
            message: error.message || 'Validation error',
            keyword: error.keyword,
            schemaPath: error.schemaPath,
            data: error.data,
            severity: 'error' as const
          }))
        }
      }
      
      const analysis = this.analyzeStructure(parsed)
      const warnings = this.generateWarnings(analysis, json)
      const securityIssues = this.detectSecurityIssues(parsed)
      const dataQuality = this.evaluateDataQuality(parsed)
      const performanceMetrics = this.evaluatePerformance(analysis, json, parseTime, validationTime)
      const scoreBreakdown = this.calculateScoreBreakdown(analysis, validationErrors, warnings, securityIssues, dataQuality)
      const qualityScore = scoreBreakdown.finalScore
      const recommendations = this.generateRecommendations(analysis, validationErrors, warnings, securityIssues, dataQuality)
      
      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        warnings,
        securityIssues,
        dataQuality,
        performance: performanceMetrics,
        qualityScore,
        scoreBreakdown,
        recommendations
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          path: '',
          message: error instanceof Error ? error.message : 'Parse error',
          keyword: 'parse',
          schemaPath: '',
          data: null,
          severity: 'error' as const
        }],
        warnings: [],
        securityIssues: [],
        dataQuality: {
          completeness: 0,
          consistency: 0,
          validity: 0,
          accuracy: 0,
          duplicates: 0,
          anomalies: []
        },
        performance: {
          parseTime: performance.now() - startTime,
          validationTime: 0,
          memoryUsage: 0,
          complexity: 0,
          size: new Blob([json]).size,
          bottlenecks: [],
          optimizationSuggestions: []
        },
        qualityScore: 0,
        scoreBreakdown: {
          baseScore: 100,
          deductions: [
            {
              category: 'syntax',
              reason: error instanceof Error ? error.message : 'Parse error',
              impact: 100,
              severity: 'critical'
            }
          ],
          bonuses: [],
          finalScore: 0,
          summary: 'Invalid JSON with critical parsing errors. Unable to process.'
        },
        recommendations: ['Fix JSON syntax errors', 'Validate JSON structure']
      }
    }
  }

  // Convert JSON to other formats
  async convertFormat(json: string, targetFormat: 'yaml' | 'xml' | 'csv' | 'toml'): Promise<string> {
    const parsed = JSON.parse(json)
    
    switch (targetFormat) {
      case 'yaml': {
        return yaml.dump(parsed, { indent: 2 })
      }
      
      case 'xml': {
        const builder = new Builder({ 
          headless: true,
          renderOpts: { pretty: true, indent: '  ' }
        })
        return builder.buildObject(parsed)
      }
      
      case 'csv': {
        if (Array.isArray(parsed)) {
          return Papa.unparse(parsed)
        }
        throw new Error('CSV conversion requires an array of objects')
      }
      
      case 'toml': {
        return toml.stringify(parsed)
      }
      
      default: {
        throw new Error(`Unsupported format: ${targetFormat}`)
      }
    }
  }

  // JSONPath query execution
  queryJsonPath(json: string, path: string): unknown[] {
    try {
      const parsed = JSON.parse(json)
      return JSONPath({ path, json: parsed })
    } catch (error) {
      throw new Error(`JSONPath query failed: ${error}`)
    }
  }

  // Schema management
  saveSchema(schema: object, metadata: Omit<SchemaInfo, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = this.generateId()
    const schemaInfo: SchemaInfo = {
      ...metadata,
      id,
      schema,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.schemas.set(id, schemaInfo)
    return id
  }

  getSchema(id: string): SchemaInfo | undefined {
    return this.schemas.get(id)
  }

  listSchemas(): SchemaInfo[] {
    return Array.from(this.schemas.values())
  }

  deleteSchema(id: string): boolean {
    return this.schemas.delete(id)
  }

  // Batch validation
  async validateBatch(files: { name: string; content: string; schema?: object }[]): Promise<Map<string, ValidationResult>> {
    const results = new Map<string, ValidationResult>()
    
    for (const file of files) {
      try {
        const result = await this.validateWithSchema(file.content, file.schema)
        results.set(file.name, result)
      } catch (error) {
        results.set(file.name, {
          isValid: false,
          errors: [{
            path: '',
            message: error instanceof Error ? error.message : 'Validation failed',
            keyword: 'batch',
            schemaPath: '',
            data: null,
            severity: 'error'
          }],
          warnings: [],
          securityIssues: [],
          dataQuality: {
            completeness: 0,
            consistency: 0,
            validity: 0,
            accuracy: 0,
            duplicates: 0,
            anomalies: []
          },
          performance: {
            parseTime: 0,
            validationTime: 0,
            memoryUsage: 0,
            complexity: 0,
            size: 0,
            bottlenecks: [],
            optimizationSuggestions: []
          },
          qualityScore: 0,
          scoreBreakdown: {
            baseScore: 100,
            deductions: [
              {
                category: 'syntax',
                reason: error instanceof Error ? error.message : 'Validation failed',
                impact: 100,
                severity: 'critical'
              }
            ],
            bonuses: [],
            finalScore: 0,
            summary: 'Invalid JSON with critical validation errors. Unable to process.'
          },
          recommendations: ['Fix JSON syntax errors', 'Validate JSON structure']
        })
      }
    }
    
    return results
  }

  // Generate JSON Schema from sample data (browser-compatible)
  generateSchema(json: string, options: { 
    title?: string
    description?: string
    required?: boolean
    additionalProperties?: boolean
  } = {}): object {
    try {
      const parsed = JSON.parse(json)
      return this.inferSchema(parsed, options)
    } catch {
      throw new Error('Invalid JSON for schema generation')
    }
  }

  private inferSchema(data: unknown, options: {
    title?: string
    description?: string
    required?: boolean
    additionalProperties?: boolean
  }, path = ''): Record<string, unknown> {
    if (data === null) {
      return { type: 'null' }
    }
    
    if (Array.isArray(data)) {
      const items = data.length > 0 ? this.inferSchema(data[0], options, `${path}[0]`) : {}
      return {
        type: 'array',
        items,
        minItems: options.required ? 1 : 0
      }
    }
    
    if (typeof data === 'object') {
      const properties: Record<string, unknown> = {}
      const required: string[] = []
      
      for (const [key, value] of Object.entries(data)) {
        properties[key] = this.inferSchema(value, options, `${path}.${key}`)
        if (options.required && value !== null && value !== undefined) {
          required.push(key)
        }
      }
      
      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
        additionalProperties: options.additionalProperties ?? false
      }
    }
    
    const type = typeof data
    const schema: Record<string, unknown> = { type }
    
    if (type === 'string') {
      // Detect common formats
      if (this.isEmail(data as string)) schema.format = 'email'
      else if (this.isUri(data as string)) schema.format = 'uri'
      else if (this.isDate(data as string)) schema.format = 'date-time'
    }
    
    return schema
  }

  private analyzeStructure(data: unknown, visited = new Set(), path = ''): StructureAnalysis {
    const analysis: StructureAnalysis = {
      depth: 0,
      keys: 0,
      objects: 0,
      arrays: 0,
      primitives: 0,
      circularReferences: [],
      duplicateKeys: [],
      dataTypes: new Map(),
      patterns: new Map(),
      nullValues: 0,
      emptyValues: 0
    }

    this.analyzeRecursive(data, analysis, visited, path, 0)
    return analysis
  }

  private analyzeRecursive(data: unknown, analysis: StructureAnalysis, visited: Set<unknown>, path: string, depth: number): void {
    analysis.depth = Math.max(analysis.depth, depth)
    
    if (data === null || data === undefined) {
      analysis.primitives++
      analysis.dataTypes.set('null', (analysis.dataTypes.get('null') || 0) + 1)
      analysis.nullValues++
      return
    }

    const type = Array.isArray(data) ? 'array' : typeof data
    analysis.dataTypes.set(type, (analysis.dataTypes.get(type) || 0) + 1)

    if (typeof data === 'object') {
      if (visited.has(data)) {
        analysis.circularReferences.push(path)
        return
      }
      visited.add(data)

      if (Array.isArray(data)) {
        analysis.arrays++
        data.forEach((item, index) => {
          this.analyzeRecursive(item, analysis, visited, `${path}[${index}]`, depth + 1)
        })
      } else {
        analysis.objects++
        const keys = Object.keys(data)
        analysis.keys += keys.length
        
        // Check for duplicate keys (case-insensitive)
        const lowerKeys = keys.map(k => k.toLowerCase())
        const duplicates = lowerKeys.filter((key, index) => lowerKeys.indexOf(key) !== index)
        if (duplicates.length > 0) {
          analysis.duplicateKeys.push(...duplicates.map(key => `${path}.${key}`))
        }

        keys.forEach(key => {
          this.analyzeRecursive((data as Record<string, unknown>)[key], analysis, visited, `${path}.${key}`, depth + 1)
        })
      }
      
      visited.delete(data)
    } else {
      analysis.primitives++
      if (data === '') analysis.emptyValues++
    }
  }

  private generateWarnings(analysis: StructureAnalysis, json: string): ValidationWarning[] {
    const warnings: ValidationWarning[] = []

    // Performance warnings
    if (analysis.depth > 20) {
      warnings.push({
        path: '',
        message: `Deep nesting detected (${analysis.depth} levels). Consider flattening structure.`,
        type: 'performance',
        severity: 'medium'
      })
    }

    if (analysis.keys > 1000) {
      warnings.push({
        path: '',
        message: `Large number of keys (${analysis.keys}). Consider pagination or chunking.`,
        type: 'performance',
        severity: 'medium'
      })
    }

    // Structure warnings
    if (analysis.circularReferences.length > 0) {
      warnings.push({
        path: analysis.circularReferences.join(', '),
        message: 'Circular references detected',
        type: 'structure',
        severity: 'high'
      })
    }

    if (analysis.duplicateKeys.length > 0) {
      warnings.push({
        path: analysis.duplicateKeys.join(', '),
        message: 'Duplicate keys found (case-insensitive)',
        type: 'structure',
        severity: 'medium'
      })
    }

    // Best practice warnings
    const size = new Blob([json]).size
    if (size > 1024 * 1024) { // 1MB
      warnings.push({
        path: '',
        message: `Large file size (${(size / 1024 / 1024).toFixed(2)}MB). Consider compression or chunking.`,
        type: 'best-practice',
        severity: 'low'
      })
    }

    return warnings
  }

  private detectSecurityIssues(data: unknown): SecurityIssue[] {
    const issues: SecurityIssue[] = []

    // Detect potential security issues
    if (typeof data === 'string' && this.isUri(data)) {
      try {
        const url = new URL(data)
        if (url.protocol === 'http:') {
          issues.push({
            path: '',
            type: 'malicious-url',
            message: 'Insecure URL detected',
            severity: 'high',
            recommendation: 'Use HTTPS instead'
          })
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    return issues
  }

  private evaluateDataQuality(data: unknown): DataQualityReport {
    const report: DataQualityReport = {
      completeness: 1.0, // Default to perfect score
      consistency: 1.0,
      validity: 1.0,
      accuracy: 1.0,
      duplicates: 0,
      anomalies: []
    }

    // Basic check if data is empty
    if (!data) {
      report.completeness = 0;
      report.consistency = 0;
      report.validity = 0;
      report.accuracy = 0;
      return report;
    }

    // Calculate completeness by checking for null/empty values
    const { missingCount, totalCount } = this.countMissingValues(data);
    if (totalCount > 0) {
      report.completeness = Math.max(0, Math.min(1, 1 - (missingCount / totalCount)));
    }

    // Calculate consistency by checking for type inconsistencies in arrays
    const inconsistencies = this.findTypeInconsistencies(data);
    report.consistency = Math.max(0, Math.min(1, 1 - (inconsistencies.length * 0.1)));

    // Check for invalid formats (date, email, URL)
    const invalidFormats = this.findInvalidFormats(data);
    report.validity = Math.max(0, Math.min(1, 1 - (invalidFormats.length * 0.1)));
    
    // Check for suspicious values (far outliers, etc)
    const inaccuracies = this.findInaccuracies(data);
    report.accuracy = Math.max(0, Math.min(1, 1 - (inaccuracies.length * 0.1)));
    
    // Check for duplicates in arrays
    if (Array.isArray(data)) {
      report.duplicates = this.countDuplicates(data);
      report.anomalies = [...inconsistencies, ...invalidFormats, ...inaccuracies].slice(0, 5);
    } else {
      report.anomalies = [...inconsistencies, ...invalidFormats, ...inaccuracies].slice(0, 5);
    }

    return report;
  }
  
  private countMissingValues(data: unknown): { missingCount: number; totalCount: number } {
    let missingCount = 0;
    let totalCount = 0;
    
    const checkValue = (value: unknown) => {
      totalCount++;
      if (value === null || value === undefined || value === '') {
        missingCount++;
      }
    };
    
    const traverse = (item: unknown) => {
      if (item === null || item === undefined) {
        checkValue(item);
      } else if (Array.isArray(item)) {
        item.forEach(val => traverse(val));
      } else if (typeof item === 'object') {
        Object.values(item).forEach(val => traverse(val));
      } else {
        checkValue(item);
      }
    };
    
    traverse(data);
    return { missingCount, totalCount };
  }
  
  private findTypeInconsistencies(data: unknown): string[] {
    const inconsistencies: string[] = [];
    
    const checkArray = (arr: unknown[], path: string) => {
      if (arr.length < 2) return;
      
      // Check for type consistency in arrays
      const firstType = typeof arr[0];
      arr.forEach((item, index) => {
        if (typeof item !== firstType) {
          inconsistencies.push(`Type inconsistency at ${path}[${index}]: expected ${firstType}, got ${typeof item}`);
        }
      });
      
      // Check object field consistency
      if (firstType === 'object' && arr[0] !== null) {
        const firstKeys = Object.keys(arr[0] as Record<string, unknown>).sort().join(',');
        arr.forEach((item, index) => {
          if (item === null) return;
          if (typeof item === 'object') {
            const itemKeys = Object.keys(item as Record<string, unknown>).sort().join(',');
            if (itemKeys !== firstKeys) {
              inconsistencies.push(`Structure inconsistency at ${path}[${index}]: fields don't match other array items`);
            }
          }
        });
      }
      
      // Recurse into array items
      arr.forEach((item, index) => {
        if (Array.isArray(item)) {
          checkArray(item, `${path}[${index}]`);
        } else if (typeof item === 'object' && item !== null) {
          checkObject(item as Record<string, unknown>, `${path}[${index}]`);
        }
      });
    };
    
    const checkObject = (obj: Record<string, unknown>, path: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          checkArray(value, path ? `${path}.${key}` : key);
        } else if (typeof value === 'object' && value !== null) {
          checkObject(value as Record<string, unknown>, path ? `${path}.${key}` : key);
        }
      });
    };
    
    if (Array.isArray(data)) {
      checkArray(data, 'root');
    } else if (typeof data === 'object' && data !== null) {
      checkObject(data as Record<string, unknown>, 'root');
    }
    
    return inconsistencies;
  }
  
  private findInvalidFormats(data: unknown): string[] {
    const invalidFormats: string[] = [];
    
    const isValidEmail = (value: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };
    
    const isValidUrl = (value: string): boolean => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    };
    
    const isValidDate = (value: string): boolean => {
      const timestamp = Date.parse(value);
      return !isNaN(timestamp);
    };
    
    const checkValue = (value: unknown, key: string, path: string) => {
      if (typeof value !== 'string') return;
      
      const keyLower = key.toLowerCase();
      
      // Check email fields
      if (keyLower.includes('email')) {
        if (!isValidEmail(value)) {
          invalidFormats.push(`Invalid email format at ${path}: ${value}`);
        }
      }
      // Check URL fields
      else if (keyLower.includes('url') || keyLower.includes('link') || keyLower.includes('website')) {
        if (!isValidUrl(value)) {
          invalidFormats.push(`Invalid URL format at ${path}: ${value}`);
        }
      }
      // Check date fields
      else if (keyLower.includes('date') || keyLower.includes('time')) {
        if (!isValidDate(value)) {
          invalidFormats.push(`Invalid date format at ${path}: ${value}`);
        }
      }
      // Check if value looks like email but isn't in an email field
      else if (value.includes('@') && value.includes('.')) {
        if (!isValidEmail(value)) {
          invalidFormats.push(`Possible invalid email at ${path}: ${value}`);
        }
      }
      // Check if value looks like URL but isn't in a URL field
      else if (value.startsWith('http')) {
        if (!isValidUrl(value)) {
          invalidFormats.push(`Possible invalid URL at ${path}: ${value}`);
        }
      }
    };
    
    const traverse = (item: unknown, path: string = '') => {
      if (Array.isArray(item)) {
        item.forEach((val, idx) => {
          traverse(val, path ? `${path}[${idx}]` : `[${idx}]`);
        });
      } else if (typeof item === 'object' && item !== null) {
        Object.entries(item as Record<string, unknown>).forEach(([key, val]) => {
          const newPath = path ? `${path}.${key}` : key;
          if (typeof val !== 'object' || val === null) {
            checkValue(val, key, newPath);
          } else {
            traverse(val, newPath);
          }
        });
      }
    };
    
    traverse(data);
    return invalidFormats;
  }
  
  private findInaccuracies(data: unknown): string[] {
    const inaccuracies: string[] = [];
    
    const checkValue = (value: unknown, key: string, path: string) => {
      const keyLower = key.toLowerCase();
      
      // Check numeric values in specific fields
      if (typeof value === 'number') {
        // Age fields
        if (keyLower.includes('age')) {
          if (value < 0 || value > 120) {
            inaccuracies.push(`Suspicious age value at ${path}: ${value}`);
          }
        }
        // Year fields
        else if (keyLower.includes('year')) {
          const currentYear = new Date().getFullYear();
          if (value < 1900 || value > currentYear + 10) {
            inaccuracies.push(`Suspicious year value at ${path}: ${value}`);
          }
        }
        // Percentage fields
        else if (keyLower.includes('percent') || keyLower.includes('rate') || key.endsWith('%')) {
          if (value < 0 || value > 100) {
            inaccuracies.push(`Suspicious percentage at ${path}: ${value}`);
          }
        }
      }
      // Check string values
      else if (typeof value === 'string') {
        // Very long strings that might be incorrect
        if (value.length > 10000) {
          inaccuracies.push(`Unusually long string at ${path}: ${value.length} chars`);
        }
      }
    };
    
    const traverse = (item: unknown, path: string = '') => {
      if (Array.isArray(item)) {
        item.forEach((val, idx) => {
          traverse(val, path ? `${path}[${idx}]` : `[${idx}]`);
        });
      } else if (typeof item === 'object' && item !== null) {
        Object.entries(item as Record<string, unknown>).forEach(([key, val]) => {
          const newPath = path ? `${path}.${key}` : key;
          if (typeof val !== 'object' || val === null) {
            checkValue(val, key, newPath);
          } else {
            traverse(val, newPath);
          }
        });
      }
    };
    
    traverse(data);
    return inaccuracies;
  }
  
  private countDuplicates(arr: unknown[]): number {
    let count = 0;
    
    // For primitive values
    if (arr.every(item => typeof item !== 'object' || item === null)) {
      const seen = new Set();
      arr.forEach(item => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          count++;
        }
        seen.add(key);
      });
    }
    // For objects
    else {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
            count++;
          }
        }
      }
    }
    
    return count;
  }

  private evaluatePerformance(analysis: StructureAnalysis, json: string, parseTime: number, validationTime: number): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      parseTime,
      validationTime,
      memoryUsage: 0,
      complexity: 0,
      size: new Blob([json]).size,
      bottlenecks: [],
      optimizationSuggestions: []
    }

    // Evaluate performance metrics
    metrics.memoryUsage = analysis.primitives * 2 + analysis.objects * 1.5 + analysis.arrays * 1.2
    metrics.complexity = analysis.depth * 2 + analysis.objects * 1.5 + analysis.arrays * 1.2 + analysis.keys * 0.1
    metrics.bottlenecks = analysis.circularReferences.length > 0 ? ['Circular references'] : []
    metrics.optimizationSuggestions = analysis.duplicateKeys.length > 0 ? ['Remove duplicate keys'] : []

    return metrics
  }

  private calculateScoreBreakdown(analysis: StructureAnalysis, errors: ValidationError[], warnings: ValidationWarning[], securityIssues: SecurityIssue[], dataQuality: DataQualityReport): ScoreBreakdown {
    const deductions: ScoreDeduction[] = [];
    const bonuses: ScoreBonus[] = [];
    
    // Calculate weighted component scores (each out of 100)
    let syntaxScore = 100;
    let securityScore = 100;
    let dataQualityScore = 100;
    let structureScore = 100;
    
    // === SYNTAX & VALIDATION SCORE (25% weight) ===
    if (errors.length > 0) {
      const errorImpact = Math.min(errors.length * 25, 100); // Cap at 100%
      syntaxScore = Math.max(0, 100 - errorImpact);
      deductions.push({
        category: 'syntax',
        reason: `${errors.length} validation error${errors.length > 1 ? 's' : ''} found`,
        impact: errorImpact,
        severity: 'critical'
      });
    }
    
    // === SECURITY SCORE (25% weight) ===
    let securityDeductions = 0;
    const highSeverityIssues = securityIssues.filter(issue => issue.severity === 'high');
    if (highSeverityIssues.length > 0) {
      const impact = Math.min(highSeverityIssues.length * 40, 100);
      securityDeductions += impact;
      deductions.push({
        category: 'security',
        reason: `${highSeverityIssues.length} high severity security issue${highSeverityIssues.length > 1 ? 's' : ''}`,
        impact,
        severity: 'critical'
      });
    }
    
    const mediumSeverityIssues = securityIssues.filter(issue => issue.severity === 'medium');
    if (mediumSeverityIssues.length > 0) {
      const impact = Math.min(mediumSeverityIssues.length * 20, 60);
      securityDeductions += impact;
      deductions.push({
        category: 'security',
        reason: `${mediumSeverityIssues.length} medium severity security issue${mediumSeverityIssues.length > 1 ? 's' : ''}`,
        impact,
        severity: 'high'
      });
    }
    
    const lowSeverityIssues = securityIssues.filter(issue => issue.severity === 'low');
    if (lowSeverityIssues.length > 0) {
      const impact = Math.min(lowSeverityIssues.length * 10, 40);
      securityDeductions += impact;
      deductions.push({
        category: 'security',
        reason: `${lowSeverityIssues.length} low severity security issue${lowSeverityIssues.length > 1 ? 's' : ''}`,
        impact,
        severity: 'medium'
      });
    }
    securityScore = Math.max(0, 100 - securityDeductions);
    
    // === DATA QUALITY SCORE (30% weight) ===
    let dataDeductions = 0;
    
    if (dataQuality.completeness < 0.95) {
      const impact = Math.round((1 - dataQuality.completeness) * 100);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `Data completeness at ${(dataQuality.completeness * 100).toFixed(1)}% (${impact}% deduction)`,
        impact,
        severity: dataQuality.completeness < 0.8 ? 'high' : 'medium'
      });
    }
    
    if (dataQuality.consistency < 0.95) {
      const impact = Math.round((1 - dataQuality.consistency) * 80);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `Data consistency at ${(dataQuality.consistency * 100).toFixed(1)}% (${impact}% deduction)`,
        impact,
        severity: dataQuality.consistency < 0.8 ? 'high' : 'medium'
      });
    }
    
    if (dataQuality.validity < 0.95) {
      const impact = Math.round((1 - dataQuality.validity) * 60);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `Data validity at ${(dataQuality.validity * 100).toFixed(1)}% (${impact}% deduction)`,
        impact,
        severity: dataQuality.validity < 0.8 ? 'high' : 'medium'
      });
    }
    
    if (dataQuality.accuracy < 0.95) {
      const impact = Math.round((1 - dataQuality.accuracy) * 40);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `Data accuracy at ${(dataQuality.accuracy * 100).toFixed(1)}% (${impact}% deduction)`,
        impact,
        severity: dataQuality.accuracy < 0.8 ? 'medium' : 'low'
      });
    }
    
    if (dataQuality.duplicates > 0) {
      const impact = Math.min(dataQuality.duplicates * 5, 30);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `${dataQuality.duplicates} duplicate value${dataQuality.duplicates > 1 ? 's' : ''} found (${impact}% deduction)`,
        impact,
        severity: 'low'
      });
    }
    
    if (dataQuality.anomalies.length > 0) {
      const impact = Math.min(dataQuality.anomalies.length * 3, 20);
      dataDeductions += impact;
      deductions.push({
        category: 'data-quality',
        reason: `${dataQuality.anomalies.length} data anomal${dataQuality.anomalies.length > 1 ? 'ies' : 'y'} detected (${impact}% deduction)`,
        impact,
        severity: 'low'
      });
    }
    
    dataQualityScore = Math.max(0, 100 - Math.min(dataDeductions, 100));
    
    // === STRUCTURE SCORE (20% weight) ===
    let structureDeductions = 0;
    
    const structureWarnings = warnings.filter(w => w.type === 'structure');
    if (structureWarnings.length > 0) {
      const impact = Math.min(structureWarnings.length * 15, 60);
      structureDeductions += impact;
      deductions.push({
        category: 'structure',
        reason: `${structureWarnings.length} structural issue${structureWarnings.length > 1 ? 's' : ''} found (${impact}% deduction)`,
        impact,
        severity: 'medium'
      });
    }
    
    const performanceWarnings = warnings.filter(w => w.type === 'performance');
    if (performanceWarnings.length > 0) {
      const impact = Math.min(performanceWarnings.length * 10, 40);
      structureDeductions += impact;
      deductions.push({
        category: 'performance',
        reason: `${performanceWarnings.length} performance issue${performanceWarnings.length > 1 ? 's' : ''} identified (${impact}% deduction)`,
        impact,
        severity: 'medium'
      });
    }
    
    const bestPracticeWarnings = warnings.filter(w => w.type === 'best-practice');
    if (bestPracticeWarnings.length > 0) {
      const impact = Math.min(bestPracticeWarnings.length * 8, 30);
      structureDeductions += impact;
      deductions.push({
        category: 'best-practice',
        reason: `${bestPracticeWarnings.length} best practice violation${bestPracticeWarnings.length > 1 ? 's' : ''} (${impact}% deduction)`,
        impact,
        severity: 'low'
      });
    }
    
    structureScore = Math.max(0, 100 - Math.min(structureDeductions, 100));
    
    // === CALCULATE WEIGHTED FINAL SCORE ===
    const weights = {
      syntax: 0.25,      // 25% - Critical for basic functionality
      security: 0.25,    // 25% - Critical for enterprise use
      dataQuality: 0.30, // 30% - Most important for data integrity
      structure: 0.20    // 20% - Important for maintainability
    };
    
    const weightedScore = Math.round(
      syntaxScore * weights.syntax +
      securityScore * weights.security +
      dataQualityScore * weights.dataQuality +
      structureScore * weights.structure
    );
    
    // === BONUSES (can add up to 10 points) ===
    let bonusPoints = 0;
    
    if (errors.length === 0) {
      bonusPoints += 3;
      bonuses.push({
        category: 'excellence',
        reason: 'Perfect syntax validation - no errors found',
        impact: 3
      });
    }
    
    if (securityIssues.length === 0) {
      bonusPoints += 4;
      bonuses.push({
        category: 'excellence',
        reason: 'No security vulnerabilities detected',
        impact: 4
      });
    }
    
    if (dataQuality.completeness >= 0.99 && dataQuality.consistency >= 0.99 && dataQuality.validity >= 0.99) {
      bonusPoints += 3;
      bonuses.push({
        category: 'excellence',
        reason: 'Exceptional data quality (99%+ across all metrics)',
        impact: 3
      });
    }
    
    const finalScore = Math.min(100, weightedScore + bonusPoints);
    
    // === GENERATE TRANSPARENT SUMMARY ===
    const componentScores = [
      `Syntax: ${syntaxScore}% (25% weight)`,
      `Security: ${securityScore}% (25% weight)`,
      `Data Quality: ${dataQualityScore}% (30% weight)`,
      `Structure: ${structureScore}% (20% weight)`
    ];
    
    let summary = `Weighted score: ${weightedScore}/100`;
    if (bonusPoints > 0) {
      summary += ` + ${bonusPoints} bonus points`;
    }
    summary += ` = ${finalScore}/100. Component scores: ${componentScores.join(', ')}.`;
    
    if (finalScore >= 95) {
      summary += ' Outstanding JSON quality with enterprise-grade standards.';
    } else if (finalScore >= 85) {
      summary += ' Excellent JSON quality with minor room for improvement.';
    } else if (finalScore >= 75) {
      summary += ' Good JSON quality with some areas needing attention.';
    } else if (finalScore >= 60) {
      summary += ' Acceptable JSON with several issues requiring fixes.';
    } else if (finalScore >= 40) {
      summary += ' Poor JSON quality with significant problems.';
    } else {
      summary += ' Critical JSON issues requiring immediate attention.';
    }
    
    return {
      baseScore: 100,
      deductions,
      bonuses,
      finalScore,
      summary
    };
  }

  private generateRecommendations(analysis: StructureAnalysis, errors: ValidationError[], warnings: ValidationWarning[], securityIssues: SecurityIssue[], dataQuality: DataQualityReport): string[] {
    const recommendations: string[] = []

    // Generate recommendations based on analysis
    if (analysis.depth > 20) {
      recommendations.push('Flatten the structure to improve performance')
    }

    if (analysis.keys > 1000) {
      recommendations.push('Consider pagination or chunking to reduce the number of keys')
    }

    if (analysis.circularReferences.length > 0) {
      recommendations.push('Remove circular references to improve performance and security')
    }

    if (analysis.duplicateKeys.length > 0) {
      recommendations.push('Remove duplicate keys to improve data quality')
    }

    if (securityIssues.length > 0) {
      recommendations.push(...securityIssues.map(issue => issue.recommendation))
    }

    if (dataQuality.completeness < 0.9) {
      recommendations.push('Improve data completeness to improve data quality')
    }

    if (dataQuality.consistency < 0.9) {
      recommendations.push('Improve data consistency to improve data quality')
    }

    if (dataQuality.validity < 0.9) {
      recommendations.push('Improve data validity to improve data quality')
    }

    if (dataQuality.accuracy < 0.9) {
      recommendations.push('Improve data accuracy to improve data quality')
    }

    if (dataQuality.duplicates > 0) {
      recommendations.push('Remove duplicate entries to improve data quality')
    }

    if (dataQuality.anomalies.length > 0) {
      recommendations.push('Investigate and resolve anomalies to improve data quality')
    }

    return recommendations
  }

  private isEmail(str: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
  }

  private isUri(str: string): boolean {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  private isDate(str: string): boolean {
    return !isNaN(Date.parse(str))
  }

  private isValidValue(/* _value: unknown */): boolean {
    // Implement custom validation logic here
    return true
  }

  private isAccurateValue(/* _value: unknown */): boolean {
    // Implement custom accuracy logic here
    return true
  }

  private isAnomaly(/* _value: unknown */): boolean {
    // Implement custom anomaly detection logic here
    return false
  }

  private jsonToToml(obj: Record<string, unknown>, prefix = ''): string {
    // Basic TOML conversion - would need proper TOML library
    let result = ''
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result += `\n[${fullKey}]\n`
        result += this.jsonToToml(value as Record<string, unknown>, fullKey)
      } else {
        result += `${key} = ${JSON.stringify(value)}\n`
      }
    }
    
    return result
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const jsonValidator = new JsonEnterpriseValidator()
