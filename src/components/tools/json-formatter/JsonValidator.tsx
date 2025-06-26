import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JsonValidatorProps {
  jsonString: string;
  onChange: (isValid: boolean, error?: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings: string[];
  stats: {
    size: number;
    keys: number;
    depth: number;
    arrays: number;
    objects: number;
  };
}

const JsonValidator = ({ jsonString, onChange }: JsonValidatorProps) => {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    stats: { size: 0, keys: 0, depth: 0, arrays: 0, objects: 0 }
  });
  const [schema, setSchema] = useState<string>('');
  const [schemaValidation, setSchemaValidation] = useState<{ isValid: boolean; errors: string[] } | null>(null);

  const validateJson = useCallback(() => {
    if (!jsonString.trim()) {
      const result = {
        isValid: true,
        warnings: [],
        stats: { size: 0, keys: 0, depth: 0, arrays: 0, objects: 0 }
      };
      setValidation(result);
      onChange(true);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString) as unknown;
      const stats = analyzeJson(parsed);
      const warnings = generateWarnings(parsed, stats);
      
      const result = {
        isValid: true,
        warnings,
        stats
      };
      
      setValidation(result);
      onChange(true);
    } catch (error) {
      const result = {
        isValid: false,
        error: (error as Error).message,
        warnings: [],
        stats: { size: 0, keys: 0, depth: 0, arrays: 0, objects: 0 }
      };
      
      setValidation(result);
      onChange(false, result.error);
    }
  }, [jsonString, onChange]);

  useEffect(() => {
    validateJson();
  }, [validateJson]);

  const analyzeJson = (data: unknown): ValidationResult['stats'] => {
    const stats = { size: 0, keys: 0, depth: 0, arrays: 0, objects: 0 };
    
    const analyze = (obj: unknown, currentDepth: number = 0): void => {
      stats.depth = Math.max(stats.depth, currentDepth);
      stats.size += 1;
      
      if (Array.isArray(obj)) {
        stats.arrays += 1;
        obj.forEach(item => analyze(item, currentDepth + 1));
      } else if (typeof obj === 'object' && obj !== null) {
        stats.objects += 1;
        const keys = Object.keys(obj);
        stats.keys += keys.length;
        keys.forEach(key => analyze(obj[key], currentDepth + 1));
      }
    };
    
    analyze(data);
    return stats;
  };

  const generateWarnings = (data: unknown, stats: ValidationResult['stats']): string[] => {
    const warnings: string[] = [];
    
    if (stats.depth > 10) {
      warnings.push('Deep nesting detected (>10 levels) - may impact performance');
    }
    
    if (stats.size > 1000) {
      warnings.push('Large JSON object detected (>1000 nodes) - consider pagination');
    }
    
    if (JSON.stringify(data).length > 100000) {
      warnings.push('Large JSON string detected (>100KB) - may impact browser performance');
    }
    
    // Check for potential issues
    const jsonString = JSON.stringify(data);
    if (jsonString.includes('undefined')) {
      warnings.push('Contains undefined values (not valid in JSON)');
    }
    
    return warnings;
  };

  const validateWithSchema = () => {
    if (!schema.trim()) return;
    
    try {
      const schemaObj = JSON.parse(schema) as unknown;
      const dataObj = JSON.parse(jsonString) as unknown;
      
      // Basic schema validation (simplified)
      const result = basicSchemaValidation(dataObj, schemaObj);
      setSchemaValidation(result);
    } catch {
      setSchemaValidation({
        isValid: false,
        errors: ['Invalid schema or JSON']
      });
    }
  };

  const basicSchemaValidation = (data: unknown, schema: unknown): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    const validate = (obj: unknown, schemaObj: unknown, path: string = ''): void => {
      if (typeof schemaObj === 'object' && schemaObj !== null && 'type' in schemaObj) {
        const expectedType = (schemaObj as { type: string }).type;
        const actualType = Array.isArray(obj) ? 'array' : typeof obj;
        
        if (expectedType !== actualType) {
          errors.push(`Type mismatch at ${path}: expected ${expectedType}, got ${actualType}`);
        }
      }
      
      if (typeof schemaObj === 'object' && schemaObj !== null && 'required' in schemaObj) {
        const required = (schemaObj as { required: string[] }).required;
        if (Array.isArray(required) && typeof obj === 'object' && obj !== null) {
          required.forEach(field => {
            if (!(field in (obj as Record<string, unknown>))) {
              errors.push(`Missing required field: ${path}.${field}`);
            }
          });
        }
      }
      
      if (typeof schemaObj === 'object' && schemaObj !== null && 'properties' in schemaObj) {
        const properties = (schemaObj as { properties: Record<string, unknown> }).properties;
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
          Object.keys(properties).forEach(key => {
            validate((obj as Record<string, unknown>)[key], properties[key], `${path}.${key}`);
          });
        }
      }
    };
    
    validate(data, schema);
    return { isValid: errors.length === 0, errors };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {validation.isValid ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
          {validation.isValid ? 'Valid JSON' : 'Invalid JSON'}
        </span>
      </div>
      
      {validation.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">Error:</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{validation.error}</p>
        </div>
      )}
      
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Warnings:</span>
          </div>
          <ul className="text-yellow-700 text-sm space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Info className="h-4 w-4" />
            <span className="font-medium">Statistics:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            <div>Objects: {validation.stats.objects}</div>
            <div>Arrays: {validation.stats.arrays}</div>
            <div>Keys: {validation.stats.keys}</div>
            <div>Max Depth: {validation.stats.depth}</div>
            <div>Total Nodes: {validation.stats.size}</div>
            <div>Size: {JSON.stringify(jsonString).length} chars</div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="font-medium">Schema Validation (Optional):</h4>
        <Textarea
          placeholder="Paste JSON Schema here..."
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          className="min-h-[100px] font-mono text-sm"
        />
        <Button onClick={validateWithSchema} disabled={!schema.trim() || !validation.isValid}>
          Validate Against Schema
        </Button>
        
        {schemaValidation && (
          <div className={`border rounded-lg p-3 ${schemaValidation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2">
              {schemaValidation.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={schemaValidation.isValid ? 'text-green-600' : 'text-red-600'}>
                {schemaValidation.isValid ? 'Schema Valid' : 'Schema Invalid'}
              </span>
            </div>
            {schemaValidation.errors && schemaValidation.errors.length > 0 && (
              <ul className="text-red-700 text-sm mt-2 space-y-1">
                {schemaValidation.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonValidator;
