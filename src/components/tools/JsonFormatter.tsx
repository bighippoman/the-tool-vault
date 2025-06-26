/* eslint-disable */
// @ts-nocheck
'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Copy, Download, Upload, FileText, CheckCircle, XCircle, AlertCircle, Zap, Eye, Wrench, Loader2, Settings, Shield, Code, Database, BarChart3, Wand2, AlertTriangle, Lightbulb, Edit3, Monitor, Table, Maximize2, Minimize2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { JsonEnterpriseValidator, ValidationResult, SchemaInfo } from '@/lib/json-enterprise'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

interface JsonError {
  line: number
  column: number
  message: string
}

interface JsonStats {
  size: number
  lines: number
  keys: number
  arrays: number
  objects: number
  depth: number
}

type ViewMode = 'text' | 'code' | 'table'
type EditorMode = 'normal' | 'fullscreen'

export default function JsonFormatter() {
  const [input, setInput] = useState(`{
  "message": "🎉 Hello! This is placeholder JSON!",
  "purpose": "To show you how beautifully structured JSON looks",
  "instructions": "Please delete this and add your own JSON data",
  "features": {
    "formatting": "Make it pretty with proper indentation",
    "validation": "Check for syntax errors",
    "ai_fixing": "Let AI repair broken JSON",
    "enterprise": "Advanced validation and conversion"
  },
  "data_types": {
    "string": "Like this text",
    "number": 42,
    "boolean": true,
    "null": null,
    "array": ["item1", "item2", "item3"],
    "nested_object": {
      "level": 2,
      "example": "Nested data structure"
    }
  },
  "fun_fact": "JSON stands for JavaScript Object Notation",
  "emoji_status": "✅ Ready to format!",
  "timestamp": "2024-01-01T00:00:00Z"
}`)
  const [output, setOutput] = useState('')
  const [errors, setErrors] = useState<JsonError[]>([])
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isFixing, setIsFixing] = useState(false)
  const [description, setDescription] = useState('')
  const [showDescription, setShowDescription] = useState(false)
  const [isDescribing, setIsDescribing] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)
  const [minifyOutput, setMinifyOutput] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [schemaInfo, setSchemaInfo] = useState<SchemaInfo | null>(null)
  const [convertFormat, setConvertFormat] = useState<'yaml' | 'xml' | 'csv' | 'toml'>('yaml')
  const [convertedOutput, setConvertedOutput] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('code')
  const [editorMode, setEditorMode] = useState<EditorMode>('normal')
  const [panelSizes, setPanelSizes] = useState([50, 50])
  
  // Rate limiting state
  const [fixRequestCount, setFixRequestCount] = useState(0)
  const [lastFixReset, setLastFixReset] = useState(Date.now())
  const [isRateLimited, setIsRateLimited] = useState(false)
  
  // Track if input has changed since last fix
  const [lastFixedInput, setLastFixedInput] = useState('')
  const [hasInputChanged, setHasInputChanged] = useState(true)

  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: T) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const validateJson = useCallback((jsonString: string) => {
    if (!jsonString.trim()) {
      setErrors([])
      setIsValid(null)
      return { isValid: true, parsed: null }
    }

    try {
      const parsed = JSON.parse(jsonString)
      setErrors([])
      setIsValid(true)
      return { isValid: true, parsed }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const match = errorMessage.match(/at position (\d+)/)
      const position = match ? parseInt(match[1]) : 0
      
      // Calculate line and column from position
      const lines = jsonString.substring(0, position).split('\n')
      const line = lines.length
      const column = lines[lines.length - 1].length + 1

      const jsonError: JsonError = {
        line,
        column,
        message: errorMessage
      }

      setErrors([jsonError])
      setIsValid(false)
      return { isValid: false, parsed: null }
    }
  }, [])

  const sortObjectKeys = useCallback((obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    } else if (obj !== null && typeof obj === 'object') {
      const sortedKeys = Object.keys(obj as Record<string, unknown>).sort((a, b) => a.localeCompare(b))
      const sortedObj: Record<string, unknown> = {}
      sortedKeys.forEach(key => {
        sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
      })
      return sortedObj
    }
    return obj
  }, [])

  // Helper function to apply formatting options to any JSON string
  const applyFormatting = useCallback((jsonString: string): string => {
    try {
      let parsed = JSON.parse(jsonString)
      
      if (sortKeys) {
        parsed = sortObjectKeys(parsed)
      }
      
      return minifyOutput 
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentSize)
    } catch (error) {
      console.error('Formatting error:', error)
      return jsonString // Return original if parsing fails
    }
  }, [sortKeys, minifyOutput, indentSize, sortObjectKeys])

  const autoFixCommonErrors = useCallback((jsonString: string): { fixed: string; wasFixed: boolean; errors: string[] } => {
    let fixed = jsonString.trim()
    const errors: string[] = []
    let wasFixed = false

    // 1. Fix trailing commas (more comprehensive)
    if (fixed.includes(',}') || fixed.includes(',]')) {
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1')
      errors.push('Removed trailing commas')
      wasFixed = true
    }

    // 2. Fix unquoted keys (improved pattern)
    const unquotedKeyRegex = /(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g
    const matches = fixed.match(unquotedKeyRegex)
    if (matches) {
      fixed = fixed.replace(unquotedKeyRegex, '$1"$2":')
      errors.push('Added quotes to object keys')
      wasFixed = true
    }

    // 3. Fix single quotes to double quotes (improved)
    if (fixed.includes("'")) {
      // Handle both keys and values with single quotes
      fixed = fixed.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"')
      errors.push('Converted single quotes to double quotes')
      wasFixed = true
    }

    // 4. Fix unquoted string values (enhanced detection)
    // Match patterns like: "key": value where value should be quoted
    const unquotedValueRegex = /:\s*([a-zA-Z][a-zA-Z0-9\s_-]*[a-zA-Z0-9])\s*([,}\]\n])/g
    if (unquotedValueRegex.test(fixed)) {
      fixed = fixed.replace(unquotedValueRegex, ': "$1"$2')
      errors.push('Added quotes to string values')
      wasFixed = true
    }

    // 5. Fix JavaScript-style comments
    if (fixed.includes('//') || fixed.includes('/*')) {
      fixed = fixed.replace(/\/\/.*$/gm, '') // Remove single-line comments
      fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      errors.push('Removed JavaScript comments')
      wasFixed = true
    }

    // 6. Fix undefined/null values without quotes
    if (fixed.includes('undefined') || fixed.includes('NaN')) {
      fixed = fixed.replace(/:\s*undefined\s*([,}\]])/g, ': null$1')
      fixed = fixed.replace(/:\s*NaN\s*([,}\]])/g, ': null$1')
      errors.push('Converted undefined/NaN to null')
      wasFixed = true
    }

    // 7. Fix missing opening/closing braces (enhanced)
    const openBraces = (fixed.match(/\{/g) || []).length
    const closeBraces = (fixed.match(/\}/g) || []).length
    if (openBraces > closeBraces) {
      fixed = fixed + '}'.repeat(openBraces - closeBraces)
      errors.push('Added missing closing braces')
      wasFixed = true
    } else if (closeBraces > openBraces && !fixed.startsWith('{')) {
      fixed = '{'.repeat(closeBraces - openBraces) + fixed
      errors.push('Added missing opening braces')
      wasFixed = true
    }

    // 8. Fix missing opening/closing brackets (enhanced)
    const openBrackets = (fixed.match(/\[/g) || []).length
    const closeBrackets = (fixed.match(/\]/g) || []).length
    if (openBrackets > closeBrackets) {
      fixed = fixed + ']'.repeat(openBrackets - closeBrackets)
      errors.push('Added missing closing brackets')
      wasFixed = true
    } else if (closeBrackets > openBrackets && !fixed.startsWith('[')) {
      fixed = '['.repeat(closeBrackets - openBrackets) + fixed
      errors.push('Added missing opening brackets')
      wasFixed = true
    }

    // 9. Fix missing colons in object properties
    const missingColonRegex = /"([^"]+)"\s+"/g
    if (missingColonRegex.test(fixed)) {
      fixed = fixed.replace(missingColonRegex, '"$1": "')
      errors.push('Added missing colons')
      wasFixed = true
    }

    // 10. Fix concatenated strings (like "hello" + "world")
    if (fixed.includes('" + "') || fixed.includes("' + '")) {
      fixed = fixed.replace(/"([^"]*)" \+ "([^"]*)"/g, '"$1$2"')
      fixed = fixed.replace(/'([^']*)' \+ '([^']*)'/g, '"$1$2"')
      errors.push('Merged concatenated strings')
      wasFixed = true
    }

    // 11. Fix function calls and expressions
    if (fixed.includes('new Date()') || fixed.includes('new ')) {
      fixed = fixed.replace(/new Date\(\)/g, '"' + new Date().toISOString() + '"')
      fixed = fixed.replace(/new \w+\([^)]*\)/g, 'null')
      errors.push('Converted function calls to valid JSON')
      wasFixed = true
    }

    // 12. Fix boolean values as strings
    fixed = fixed.replace(/:\s*"true"\s*([,}\]])/g, ': true$1')
    fixed = fixed.replace(/:\s*"false"\s*([,}\]])/g, ': false$1')
    fixed = fixed.replace(/:\s*"null"\s*([,}\]])/g, ': null$1')
    if (fixed.includes('"true"') || fixed.includes('"false"') || fixed.includes('"null"')) {
      errors.push('Fixed quoted boolean/null values')
      wasFixed = true
    }

    // 13. Fix numeric values as strings (when appropriate)
    const quotedNumberRegex = /:\s*"(\d+(?:\.\d+)?)"\s*([,}\]])/g
    if (quotedNumberRegex.test(fixed)) {
      fixed = fixed.replace(quotedNumberRegex, ': $1$2')
      errors.push('Unquoted numeric values')
      wasFixed = true
    }

    // 14. Fix escaped quotes in wrong places
    if (fixed.includes('\\"')) {
      fixed = fixed.replace(/\\"/g, '"')
      errors.push('Fixed escaped quotes')
      wasFixed = true
    }

    // 15. Fix missing commas between objects/arrays
    // Pattern: }{ or ][
    if (fixed.includes('}{') || fixed.includes('][')) {
      fixed = fixed.replace(/}(\s*){/g, '},$1{')
      fixed = fixed.replace(/](\s*)\[/g, '],$1[')
      errors.push('Added missing commas between elements')
      wasFixed = true
    }

    // 16. Fix Python-style True/False/None
    if (fixed.includes('True') || fixed.includes('False') || fixed.includes('None')) {
      fixed = fixed.replace(/:\s*True\s*([,}\]])/g, ': true$1')
      fixed = fixed.replace(/:\s*False\s*([,}\]])/g, ': false$1')
      fixed = fixed.replace(/:\s*None\s*([,}\]])/g, ': null$1')
      errors.push('Converted Python literals to JSON')
      wasFixed = true
    }

    // 17. Fix extra commas and clean up whitespace
    fixed = fixed.replace(/,\s*$/, '') // Remove trailing comma at end
    fixed = fixed.replace(/,\s*,/g, ',') // Remove duplicate commas
    fixed = fixed.replace(/\s+/g, ' ') // Normalize whitespace

    // 18. Wrap bare values in object/array if needed
    if (fixed && !fixed.startsWith('{') && !fixed.startsWith('[') && !fixed.startsWith('"') && isNaN(Number(fixed))) {
      // If it looks like object properties, wrap in braces
      if (fixed.includes(':')) {
        fixed = `{${fixed}}`
        errors.push('Wrapped properties in object braces')
        wasFixed = true
      }
    }

    return { fixed, wasFixed, errors }
  }, [])

  const debouncedAutoFix = useCallback(async (jsonString: string) => {
    if (!jsonString.trim()) return
    
    try {
      const { data, error } = await supabase.functions.invoke('fix-json', {
        body: { 
          json: jsonString,
          "tool": "JSON Formatter, Validator and Fixer",
          "action": "fix_json"
        }
      })

      if (error) throw error

      if (data?.fixed_json) {
        const formattedOutput = applyFormatting(data.fixed_json)
        setOutput(formattedOutput)
        toast.success('JSON auto-fixed successfully!')
      }
    } catch (error) {
      console.error('Auto-fix failed:', error)
    }
  }, [applyFormatting])

  // Rate limiting logic
  const checkRateLimit = useCallback(() => {
    const now = Date.now()
    const oneMinute = 60 * 1000
    
    // Reset counter if a minute has passed
    if (now - lastFixReset > oneMinute) {
      setFixRequestCount(0)
      setLastFixReset(now)
      setIsRateLimited(false)
      return true
    }
    
    // Check if we've exceeded the limit
    if (fixRequestCount >= 5) {
      setIsRateLimited(true)
      return false
    }
    
    return true
  }, [fixRequestCount, lastFixReset])

  // Check if JSON needs fixing
  const needsFixing = useCallback(() => {
    if (!input.trim()) return false
    
    // If JSON is invalid, it definitely needs fixing
    if (isValid === false) return true
    
    // If JSON is valid, check if it could be improved
    if (isValid === true) {
      try {
        const parsed = JSON.parse(input)
        const formatted = applyFormatting(JSON.stringify(parsed))
        
        // Check if the input differs significantly from properly formatted version
        const inputNormalized = input.trim().replace(/\s+/g, ' ')
        const formattedNormalized = formatted.trim().replace(/\s+/g, ' ')
        
        // If they're essentially the same, no fixing needed
        if (inputNormalized === formattedNormalized) return false
        
        // If the formatted version is significantly different, it could be improved
        return inputNormalized !== formattedNormalized
      } catch {
        return true // If parsing fails, it needs fixing
      }
    }
    
    return false // Default to not needing fixing if unsure
  }, [input, isValid, applyFormatting])

  const fixJson = async () => {
    if (!input.trim()) return
    
    // Check if JSON actually needs fixing BEFORE checking rate limits
    if (isValid === true && !needsFixing()) {
      toast.success('🎉 No fix necessary! Your JSON is already perfectly valid and well-formatted.')
      return
    }
    
    // Check rate limit only if we actually need to fix something
    if (!checkRateLimit()) {
      toast.error('Rate limit exceeded. Please wait before trying again. (5 requests per minute)')
      return
    }
    
    // Check if input hasn't changed since last fix
    if (!hasInputChanged && lastFixedInput === input) {
      toast.info('🔄 No changes detected since last fix. Your JSON is already processed.')
      return
    }

    setIsFixing(true)
    console.log('Starting JSON fix with input:', input.substring(0, 100) + '...')
    
    try {
      // First, try automatic local fixes for common errors
      const autoFixResult = autoFixCommonErrors(input)
      
      if (autoFixResult.wasFixed) {
        // Test if the auto-fix worked
        try {
          JSON.parse(autoFixResult.fixed)
          // Success! The local fix worked
          const formattedOutput = applyFormatting(autoFixResult.fixed)
          setOutput(formattedOutput)
          setLastFixedInput(input)
          setHasInputChanged(false)
          toast.success(`🔧 Auto-fixed locally: ${autoFixResult.errors.join(', ')}`)
          console.log('Local auto-fix successful:', autoFixResult.errors)
          return
        } catch (parseError) {
          console.log('Local auto-fix failed, falling back to AI:', parseError)
          // Auto-fix didn't work, continue to AI fix
        }
      }
      
      // If we reach here and JSON is already valid, don't waste AI calls
      if (isValid === true) {
        toast.success('✨ Your JSON is already valid! No AI fix needed.')
        return
      }
      
      // If local fix didn't work or wasn't needed, use AI
      console.log('Using AI for complex JSON repair...')
      
      // Increment rate limit counter for AI usage
      setFixRequestCount(prev => prev + 1)
      
      console.log('Calling supabase function...')
      const { data, error } = await supabase.functions.invoke('fix-json', {
        body: { 
          json: input,
          "tool": "JSON Formatter, Validator and Fixer",
          "action": "fix_json"
        }
      })

      console.log('Fix JSON response:', { data, error })

      if (error) {
        console.error('Supabase function error:', error)
        throw error
      }

      if (data?.fixed_json) {
        console.log('Fixed JSON received:', data.fixed_json)
        
        // Check if AI actually changed anything
        try {
          const originalParsed = JSON.parse(input)
          const fixedParsed = JSON.parse(data.fixed_json)
          
          if (JSON.stringify(originalParsed) === JSON.stringify(fixedParsed)) {
            toast.success('✅ AI confirmed your JSON is already perfect! No changes made.')
            setOutput(applyFormatting(data.fixed_json))
          } else {
            const formattedOutput = applyFormatting(data.fixed_json)
            setOutput(formattedOutput)
            toast.success('🤖 JSON fixed with AI!')
          }
        } catch {
          // If we can't compare, just apply the fix
          const formattedOutput = applyFormatting(data.fixed_json)
          setOutput(formattedOutput)
          toast.success('🤖 JSON fixed with AI!')
        }
        
        setLastFixedInput(input)
        setHasInputChanged(false)
      } else {
        console.log('No fixed_json in response. Full data:', data)
        toast.error('No fixed JSON returned from AI')
      }
    } catch (error) {
      console.error('Fix JSON error:', error)
      console.error('Error details:', { error, input: input.substring(0, 200) + '...' })
      toast.error('Failed to fix JSON. Check console for details.')
    } finally {
      setIsFixing(false)
    }
  }

  const getStats = useCallback((jsonString: string): JsonStats => {
    if (!jsonString) {
      return { size: 0, lines: 0, keys: 0, arrays: 0, objects: 0, depth: 0 }
    }

    try {
      const parsed = JSON.parse(jsonString)
      const size = new Blob([jsonString]).size
      const lines = jsonString.split('\n').length

      const countElements = (obj: unknown, currentDepth = 0): { keys: number, arrays: number, objects: number, maxDepth: number } => {
        let keys = 0
        let arrays = 0
        let objects = 0
        let maxDepth = currentDepth

        if (Array.isArray(obj)) {
          arrays++
          obj.forEach(item => {
            const result = countElements(item, currentDepth + 1)
            keys += result.keys
            arrays += result.arrays
            objects += result.objects
            maxDepth = Math.max(maxDepth, result.maxDepth)
          })
        } else if (obj !== null && typeof obj === 'object') {
          objects++
          Object.keys(obj as Record<string, unknown>).forEach(key => {
            keys++
            const result = countElements((obj as Record<string, unknown>)[key], currentDepth + 1)
            keys += result.keys
            arrays += result.arrays
            objects += result.objects
            maxDepth = Math.max(maxDepth, result.maxDepth)
          })
        }

        return { keys, arrays, objects, maxDepth }
      }

      const counts = countElements(parsed)
      
      return {
        size,
        lines,
        keys: counts.keys,
        arrays: counts.arrays,
        objects: counts.objects,
        depth: counts.maxDepth
      }
    } catch {
      return { size: 0, lines: 0, keys: 0, arrays: 0, objects: 0, depth: 0 }
    }
  }, [])

  const loadSample = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001"
      }
    }
    setInput(JSON.stringify(sampleJson, null, 2))
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setErrors([])
    setIsValid(null)
    setDescription('')
    setValidationResult(null)
    setSchemaInfo(null)
    setConvertedOutput('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const downloadJson = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setInput(content)
    }
    reader.readAsText(file)
  }

  const describeJson = async () => {
    if (!output) return

    setIsDescribing(true)
    try {
      const { data, error } = await supabase.functions.invoke('describe-json', {
        body: { 
          json: output,
          "tool": "JSON Formatter, Validator and Fixer",
          "action": "describe_json"
        }
      })

      if (error) throw error

      if (data?.description) {
        setDescription(data.description)
        setShowDescription(true)
      }
    } catch (error) {
      toast.error('Failed to describe JSON')
      console.error('Describe JSON error:', error)
    } finally {
      setIsDescribing(false)
    }
  }

  const runEnterpriseValidation = async () => {
    if (!output) return

    try {
      const validator = new JsonEnterpriseValidator()
      const result = await validator.validateWithSchema(output)
      setValidationResult(result)
      
      // Generate simple schema info for display
      setSchemaInfo({
        id: 'auto-generated',
        name: 'Generated Schema',
        description: 'Auto-generated schema from JSON structure',
        version: '1.0.0',
        tags: ['auto-generated', 'validation'],
        schema: {},
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      toast.success('Enterprise validation completed!')
    } catch (error) {
      toast.error('Validation failed')
      console.error('Validation error:', error)
    }
  }

  const convertToFormat = async () => {
    if (!output) return

    try {
      const validator = new JsonEnterpriseValidator()
      let converted = ''

      switch (convertFormat) {
        case 'yaml':
          converted = await validator.convertFormat(output, 'yaml')
          break
        case 'xml':
          converted = await validator.convertFormat(output, 'xml')
          break
        case 'csv':
          converted = await validator.convertFormat(output, 'csv')
          break
        case 'toml':
          converted = await validator.convertFormat(output, 'toml')
          break
        default:
          converted = output
      }

      setConvertedOutput(converted)
      toast.success(`Converted to ${convertFormat.toUpperCase()}!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (convertFormat === 'csv' && errorMessage.includes('array of objects')) {
        toast.error('CSV conversion requires an array of objects. Example: [{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]')
      } else {
        toast.error(`Failed to convert to ${convertFormat.toUpperCase()}: ${errorMessage}`)
      }
      console.error('Conversion error:', error)
    }
  }

  const formatJson = useCallback(() => {
    const validation = validateJson(input)
    
    // First priority: format valid input
    if (validation.isValid && validation.parsed !== null) {
      try {
        const formatted = applyFormatting(JSON.stringify(validation.parsed))
        setOutput(formatted)
        return
      } catch (error) {
        console.error('Formatting error:', error)
      }
    }
    
    // Second priority: format existing output (even if input is invalid)
    if (output) {
      try {
        const formatted = applyFormatting(output)
        setOutput(formatted)
        return
      } catch (error) {
        console.error('Output formatting error:', error)
      }
    }
    
    // Last resort: if we have invalid input and no output, show a helpful message
    if (input && !output) {
      toast.error('Cannot format invalid JSON. Use "Fix" first or paste valid JSON.')
    }
  }, [input, validateJson, applyFormatting, output])

  const processData = async (action: 'format' | 'fix') => {
    if (action === 'format') {
      formatJson()
    } else {
      // Fix requires input
      if (!input.trim()) {
        toast.error('Please enter JSON to fix.')
        return
      }
      fixJson()
    }
  }

  const copyOutput = () => {
    copyToClipboard(output)
  }

  const downloadOutput = () => {
    downloadJson()
  }

  const renderTableView = () => {
    try {
      const parsed = JSON.parse(output)
      
      // Enhanced table rendering for different data structures
      if (Array.isArray(parsed)) {
        return renderArrayTable(parsed)
      } else if (typeof parsed === 'object' && parsed !== null) {
        return renderObjectTable(parsed)
      } else {
        return (
          <div className="p-4 text-center text-gray-500">
            <div className="mb-2">📊 Table View</div>
            <div className="text-sm">This data type is best viewed in Text or Code mode</div>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
              {typeof parsed}: {String(parsed)}
            </div>
          </div>
        )
      }
    } catch (e) {
      return (
        <div className="p-4 text-center text-red-500">
          <div className="mb-2">❌ Unable to render table view</div>
          <div className="text-sm">Please ensure your JSON is valid first</div>
        </div>
      )
    }
  }

  const renderArrayTable = (data: unknown[]) => {
    if (data.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="mb-2">📋 Empty Array</div>
          <div className="text-sm">This array contains no items to display</div>
        </div>
      )
    }

    // Check if it's an array of objects (traditional table view)
    const hasObjects = data.some(item => typeof item === 'object' && item !== null && !Array.isArray(item))
    
    if (hasObjects) {
      // Collect all possible keys from all objects
      const allKeys = new Set<string>()
      data.forEach(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          Object.keys(item).forEach(key => allKeys.add(key))
        }
      })
      const headers = Array.from(allKeys)

      return (
        <div className="overflow-auto">
          <div className="mb-2 text-sm text-gray-600 px-2">
            📊 Array of Objects • {data.length} items • {headers.length} columns
          </div>
          <table className="w-full text-xs border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-green-50 to-green-100">
                <th className="border border-gray-300 p-2 text-left font-medium bg-green-100">#</th>
                {headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 p-2 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 1000).map((row, i) => (
                <tr key={i} className="hover:bg-green-50">
                  <td className="border border-gray-300 p-2 bg-gray-50 text-gray-600 font-mono">
                    {i}
                  </td>
                  {headers.map((header, j) => (
                    <td key={j} className="border border-gray-300 p-2 max-w-xs">
                      {renderCellValue(row[header], header)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 1000 && (
            <div className="text-center p-4 text-gray-500 bg-yellow-50 border border-yellow-200 rounded-b">
              ⚠️ Showing first 1,000 rows of {data.length} total (performance limit)
            </div>
          )}
        </div>
      )
    } else {
      // Array of primitives or mixed types
      return (
        <div className="overflow-auto">
          <div className="mb-2 text-sm text-gray-600 px-2">
            📋 Array of Values • {data.length} items
          </div>
          <table className="w-full text-xs border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                <th className="border border-gray-300 p-2 text-left font-medium bg-blue-100">Index</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Type</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 1000).map((item, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="border border-gray-300 p-2 bg-gray-50 text-gray-600 font-mono">
                    {i}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {Array.isArray(item) ? 'array' : typeof item}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 max-w-md">
                    {renderCellValue(item, `item_${i}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 1000 && (
            <div className="text-center p-4 text-gray-500 bg-yellow-50 border border-yellow-200 rounded-b">
              ⚠️ Showing first 1,000 items of {data.length} total
            </div>
          )}
        </div>
      )
    }
  }

  const renderObjectTable = (data: Record<string, unknown>) => {
    const entries = Object.entries(data)
    
    return (
      <div className="overflow-auto">
        <div className="mb-2 text-sm text-gray-600 px-2">
          🗂️ Object Properties • {entries.length} key-value pairs
        </div>
        <table className="w-full text-xs border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
              <th className="border border-gray-300 p-2 text-left font-medium bg-purple-100">Key</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Type</th>
              <th className="border border-gray-300 p-2 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], i) => (
              <tr key={i} className="hover:bg-purple-50">
                <td className="border border-gray-300 p-2 bg-gray-50 font-mono font-medium">
                  {key}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                    {Array.isArray(value) ? 'array' : typeof value}
                  </span>
                </td>
                <td className="border border-gray-300 p-2 max-w-md">
                  {renderCellValue(value, key)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCellValue = (value: unknown, key: string) => {
    if (value === null) {
      return <span className="text-gray-400 italic">null</span>
    }
    if (value === undefined) {
      return <span className="text-gray-400 italic">undefined</span>
    }
    if (typeof value === 'boolean') {
      return (
        <span className={`font-mono ${value ? 'text-green-600' : 'text-red-600'}`}>
          {String(value)}
        </span>
      )
    }
    if (typeof value === 'number') {
      return <span className="font-mono text-blue-600">{value}</span>
    }
    if (typeof value === 'string') {
      // Truncate very long strings but show them nicely
      const truncated = value.length > 200 ? value.substring(0, 200) + '...' : value
      return (
        <div className="font-mono text-gray-800">
          {value.length > 200 && (
            <div className="text-xs text-gray-500 mb-1">
              String ({value.length} chars) - showing first 200:
            </div>
          )}
          <div className="whitespace-pre-wrap break-words">{truncated}</div>
        </div>
      )
    }
    if (Array.isArray(value)) {
      return (
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Array ({value.length} items):
          </div>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
            {minifyOutput 
              ? JSON.stringify(value)
              : JSON.stringify(value, null, Math.min(indentSize, 2))
            }
          </div>
        </div>
      )
    }
    if (typeof value === 'object') {
      const keyCount = Object.keys(value).length
      return (
        <div>
          <div className="text-xs text-gray-500 mb-1">
            Object ({keyCount} keys):
          </div>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
            {minifyOutput 
              ? JSON.stringify(value)
              : JSON.stringify(value, null, Math.min(indentSize, 2))
            }
          </div>
        </div>
      )
    }
    return <span className="text-gray-600">{String(value)}</span>
  }

  const stats = useMemo(() => getStats(output), [output, getStats])

  // Computed button states
  const canFormat = useMemo(() => {
    const validation = validateJson(input)
    const hasValidInput = validation.isValid && validation.parsed !== null
    const hasValidOutput = output && output.trim()
    return hasValidInput || hasValidOutput
  }, [input, output, validateJson])

  React.useEffect(() => {
    if (input.trim()) {
      const validation = validateJson(input)
      
      // Mark input as changed if it's different from last fixed input
      if (input !== lastFixedInput) {
        setHasInputChanged(true)
      }
      
      if (validation.isValid) {
        formatJson()
      } else {
        // Only clear output if we haven't recently fixed this input with AI
        // This prevents clearing AI-fixed results when input is still invalid
        if (input !== lastFixedInput) {
          setOutput('')
        }
      }
    } else {
      setOutput('')
      setIsValid(null)
      setHasInputChanged(true)
    }
  }, [input, formatJson, lastFixedInput, validateJson])

  // Handle escape key to exit fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editorMode === 'fullscreen') {
        setEditorMode('normal')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editorMode])

  // Handle formatting option changes - re-format existing output when options change
  useEffect(() => {
    if (output && isValid === true) {
      formatJson()
    }
  }, [sortKeys, minifyOutput, indentSize, formatJson, output, isValid])

  // Reusable Format Button with integrated options
  const FormatButton = ({ size = "sm", className = "", disabled = false }: { size?: "sm" | "default", className?: string, disabled?: boolean }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size={size}
            className={`${className} relative`}
            disabled={disabled}
            variant="default"
          >
            <Wrench className="h-3 w-3 mr-1" />
            Format
            <Settings className="h-3 w-3 ml-1 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Formatting Options</h4>
              <div className="space-y-3">
                {/* Indent Size */}
                <div className="space-y-1">
                  <Label htmlFor="indent-size-popover" className="text-xs">Indent Size</Label>
                  <Select value={indentSize.toString()} onValueChange={(value) => setIndentSize(parseInt(value))}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort Keys */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sort-keys-popover"
                    checked={sortKeys}
                    onCheckedChange={setSortKeys}
                  />
                  <Label htmlFor="sort-keys-popover" className="text-xs">Sort Keys Alphabetically</Label>
                </div>
                
                {/* Minify */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="minify-popover"
                    checked={minifyOutput}
                    onCheckedChange={setMinifyOutput}
                  />
                  <Label htmlFor="minify-popover" className="text-xs">Minify Output</Label>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <Button 
              onClick={() => {
                processData('format')
                toast.success('JSON formatted successfully!')
              }}
              disabled={!canFormat}
              size="sm"
              className="w-full"
            >
              Apply Formatting
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
      {/* Controls Bar */}
      <div className="mb-6 bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">View Mode:</Label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('text')}
                className="h-8 px-3 text-xs"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Text
              </Button>
              <Button
                variant={viewMode === 'code' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('code')}
                className="h-8 px-3 text-xs"
              >
                <Monitor className="h-3 w-3 mr-1" />
                Code
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-3 text-xs"
              >
                <Table className="h-3 w-3 mr-1" />
                Table
              </Button>
            </div>
          </div>

          {/* Editor Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={editorMode === 'fullscreen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditorMode(editorMode === 'fullscreen' ? 'normal' : 'fullscreen')}
              className="h-8 px-3 text-xs"
            >
              {editorMode === 'fullscreen' ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".json,.txt,.xml,.yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs cursor-pointer" asChild>
                <span>
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </span>
              </Button>
            </Label>
            <FormatButton size="sm" className="h-8 px-3 text-xs" disabled={!canFormat} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => processData('fix')} 
                    disabled={isFixing || !input.trim()}
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    {isFixing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                    Fix
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>Automatically fix common JSON errors and structure issues.</p>
                    <p>Local fixes include:</p>
                    <ul className="list-disc pl-4">
                      <li>Trailing commas</li>
                      <li>Unquoted keys</li>
                      <li>Single quotes</li>
                      <li>Missing colons</li>
                      <li>Concatenated strings</li>
                      <li>Function calls</li>
                      <li>Boolean values as strings</li>
                      <li>Numeric values as strings</li>
                      <li>Escaped quotes</li>
                      <li>Missing commas between objects/arrays</li>
                      <li>Python-style True/False/None</li>
                    </ul>
                    <p>If local fixes fail, AI-powered repair will be used.</p>
                    <p>Rate limit: 5 requests per minute.</p>
                    <p>Usage count: {fixRequestCount}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className={`${editorMode === 'fullscreen' ? 'fixed inset-0 z-50 bg-white p-6' : 'mb-6'}`}>
        {/* Controls bar - visible in fullscreen mode */}
        {editorMode === 'fullscreen' && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">JSON Formatter - Fullscreen Mode</h2>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <Button
                  variant={viewMode === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('text')}
                  className="h-7 px-3 text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Text
                </Button>
                <Button
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                  className="h-7 px-3 text-xs"
                >
                  <Code className="h-3 w-3 mr-1" />
                  Code
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-7 px-3 text-xs"
                >
                  <Table className="h-3 w-3 mr-1" />
                  Table
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".json,.txt,.xml,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fullscreen-file-upload"
                />
                <Button 
                  onClick={() => document.getElementById('fullscreen-file-upload')?.click()}
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
                <FormatButton size="sm" className="h-8 px-3 text-xs" disabled={!canFormat} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={() => processData('fix')} 
                        disabled={isFixing || !input.trim()}
                        size="sm"
                        className="h-8 px-3 text-xs"
                      >
                        {isFixing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Zap className="h-3 w-3 mr-1" />}
                        Fix
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p>Automatically fix common JSON errors and structure issues.</p>
                        <p>Local fixes include:</p>
                        <ul className="list-disc pl-4">
                          <li>Trailing commas</li>
                          <li>Unquoted keys</li>
                          <li>Single quotes</li>
                          <li>Missing colons</li>
                          <li>Concatenated strings</li>
                          <li>Function calls</li>
                          <li>Boolean values as strings</li>
                          <li>Numeric values as strings</li>
                          <li>Escaped quotes</li>
                          <li>Missing commas between objects/arrays</li>
                          <li>Python-style True/False/None</li>
                        </ul>
                        <p>If local fixes fail, AI-powered repair will be used.</p>
                        <p>Rate limit: 5 requests per minute.</p>
                        <p>Usage count: {fixRequestCount}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Exit Fullscreen */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Press Esc to exit</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditorMode('normal')}
                className="h-8 px-4"
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
          </div>
        )}

        <PanelGroup direction="horizontal" onLayout={setPanelSizes}>
          {/* Input Panel */}
          <Panel defaultSize={50} minSize={30}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      Input
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">Paste JSON, XML, or broken text here</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isValid === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {isValid === false && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <div className="h-full bg-blue-50/30 border-2 border-blue-200/50 rounded-b-lg">
                  {viewMode === 'code' ? (
                    <CodeEditor
                      value={input}
                      language="json"
                      placeholder="Paste your JSON, XML, or broken data here..."
                      onChange={(evn) => setInput(evn.target.value)}
                      padding={15}
                      data-color-mode="light"
                      style={{
                        fontSize: 13,
                        backgroundColor: 'transparent',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        minHeight: editorMode === 'fullscreen' ? 'calc(100vh - 200px)' : '500px',
                        height: '100%',
                        lineHeight: 1.5,
                      }}
                    />
                  ) : (
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Paste your JSON, XML, or broken data here..."
                      className={`w-full border-0 bg-transparent resize-none focus:ring-0 font-mono text-sm ${
                        editorMode === 'fullscreen' ? 'min-h-[calc(100vh-200px)]' : 'min-h-[500px]'
                      } h-full`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Panel>

          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

          {/* Output Panel */}
          <Panel defaultSize={50} minSize={30}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Output
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">Formatted JSON output</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {output && (
                      <>
                        <Button onClick={copyOutput} size="sm" variant="outline" className="h-8 px-3 text-xs">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button onClick={downloadOutput} size="sm" variant="outline" className="h-8 px-3 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <div className="h-full bg-green-50/30 border-2 border-green-200/50 rounded-b-lg">
                  {viewMode === 'code' ? (
                    <CodeEditor
                      value={output}
                      language="json"
                      placeholder="Formatted output will appear here..."
                      data-color-mode="light"
                      readOnly
                      style={{
                        fontSize: 13,
                        backgroundColor: 'transparent',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        minHeight: editorMode === 'fullscreen' ? 'calc(100vh - 200px)' : '500px',
                        height: '100%',
                        lineHeight: 1.5,
                      }}
                    />
                  ) : viewMode === 'table' && output ? (
                    <div className="h-full overflow-auto p-4">
                      {renderTableView()}
                    </div>
                  ) : (
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="Formatted output will appear here..."
                      className={`w-full border-0 bg-transparent resize-none focus:ring-0 font-mono text-sm ${
                        editorMode === 'fullscreen' ? 'min-h-[calc(100vh-200px)]' : 'min-h-[500px]'
                      } h-full`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Panel>
        </PanelGroup>
      </div>

      {/* Status Messages */}
      {input && (
        <div className="mb-6">
          {isValid === true ? (
            <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">✓ Valid JSON - Auto-formatted in output panel</span>
            </div>
          ) : isValid === false ? (
            <div className="flex items-center space-x-2 text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
              <XCircle className="h-5 w-5" />
              <div>
                <div className="font-medium">⚠ Invalid JSON detected</div>
                <div className="text-sm text-orange-600 mt-1">
                  Use the &quot;Fix&quot; button to automatically repair syntax errors and structural issues.
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Advanced Features Section */}
      <div className="mb-6">
        {/* Statistics */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Statistics
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">JSON data statistics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{stats.size} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span>{stats.lines}</span>
                </div>
                <div className="flex justify-between">
                  <span>Keys:</span>
                  <span>{stats.keys}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Objects:</span>
                  <span>{stats.objects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrays:</span>
                  <span>{stats.arrays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Depth:</span>
                  <span>{stats.depth}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Enterprise Validation
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">Validate JSON against enterprise standards</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runEnterpriseValidation} disabled={!output} className="w-full">
              <Wrench className="h-4 w-4 mr-2" />
              Run Validation
            </Button>
            
            {validationResult && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Enterprise Validation</span>
                </div>
                <div className="space-y-2 text-xs">
                  {/* Score Breakdown */}
                  {validationResult.scoreBreakdown && (
                    <div className="mt-3 space-y-3">
                      {/* Score Overview */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              validationResult.scoreBreakdown.finalScore >= 90 ? 'bg-green-500' :
                              validationResult.scoreBreakdown.finalScore >= 80 ? 'bg-blue-500' :
                              validationResult.scoreBreakdown.finalScore >= 70 ? 'bg-yellow-500' :
                              validationResult.scoreBreakdown.finalScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-semibold text-sm text-gray-800">Quality Score</span>
                          </div>
                          <Badge variant={validationResult.scoreBreakdown.finalScore >= 80 ? "default" : validationResult.scoreBreakdown.finalScore >= 60 ? "outline" : "destructive"} className="font-bold text-base">
                            {validationResult.scoreBreakdown.finalScore}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">{validationResult.scoreBreakdown.summary}</p>
                        
                        {/* Calculation Methodology */}
                        <div className="text-xs bg-white/60 rounded p-2 border border-blue-100">
                          <div className="font-medium text-blue-800 mb-1">Score Components:</div>
                          <div className="text-blue-700 space-y-0.5">
                            <div>• Syntax & Validation (25% weight)</div>
                            <div>• Security Assessment (25% weight)</div>
                            <div>• Data Quality Analysis (30% weight)</div>
                            <div>• Structure & Best Practices (20% weight)</div>
                            <div className="text-blue-600 mt-1">Plus excellence bonuses for perfect scores</div>
                          </div>
                        </div>
                      </div>

                      {/* Critical Issues (if any) */}
                      {validationResult.scoreBreakdown.deductions.filter(d => d.severity === 'critical').length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-sm text-red-800">Critical Issues</span>
                          </div>
                          <div className="space-y-1">
                            {validationResult.scoreBreakdown.deductions
                              .filter(d => d.severity === 'critical')
                              .map((deduction, i) => (
                                <div key={i} className="flex items-start justify-between text-xs">
                                  <span className="text-red-700 flex-1 mr-2">{deduction.reason}</span>
                                  <span className="font-medium text-red-800 whitespace-nowrap">-{deduction.impact}pts</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Main Issues */}
                      {(validationResult.scoreBreakdown.deductions.filter(d => d.severity === 'high').length > 0 ||
                        validationResult.scoreBreakdown.deductions.filter(d => d.severity === 'medium').length > 0) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold text-sm text-amber-800">Issues to Address</span>
                          </div>
                          <div className="space-y-1">
                            {validationResult.scoreBreakdown.deductions
                              .filter(d => d.severity === 'high' || d.severity === 'medium')
                              .sort((a, b) => b.impact - a.impact)
                              .slice(0, 5)
                              .map((deduction, i) => (
                                <div key={i} className="flex items-start justify-between text-xs">
                                  <span className="text-amber-700 flex-1 mr-2">{deduction.reason}</span>
                                  <span className="font-medium text-amber-800 whitespace-nowrap">-{deduction.impact}pts</span>
                                </div>
                              ))}
                            {validationResult.scoreBreakdown.deductions.filter(d => d.severity === 'high' || d.severity === 'medium').length > 5 && (
                              <div className="text-xs text-amber-600 font-medium">
                                +{validationResult.scoreBreakdown.deductions.filter(d => d.severity === 'high' || d.severity === 'medium').length - 5} more issues...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Positive Aspects */}
                      {validationResult.scoreBreakdown.bonuses.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-sm text-green-800">Excellence Bonuses</span>
                          </div>
                          <div className="space-y-1">
                            {validationResult.scoreBreakdown.bonuses.map((bonus, i) => (
                              <div key={i} className="flex items-start justify-between text-xs">
                                <span className="text-green-700 flex-1 mr-2">{bonus.reason}</span>
                                <span className="font-medium text-green-800 whitespace-nowrap">+{bonus.impact}pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-sm text-blue-800">Recommendations</span>
                          </div>
                          <div className="space-y-1">
                            {validationResult.recommendations.slice(0, 4).map((rec, i) => (
                              <div key={i} className="flex items-start space-x-2 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                                <span className="text-blue-700">{rec}</span>
                              </div>
                            ))}
                            {validationResult.recommendations.length > 4 && (
                              <div className="text-xs text-blue-600 font-medium pl-3.5">
                                +{validationResult.recommendations.length - 4} more suggestions...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="font-semibold text-gray-800">{validationResult.scoreBreakdown.deductions.length}</div>
                          <div className="text-gray-600">Issues Found</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="font-semibold text-gray-800">{validationResult.scoreBreakdown.bonuses.length}</div>
                          <div className="text-gray-600">Excellence Bonuses</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Format Conversion */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Format Conversion
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">Convert JSON to other formats</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="convert-format">Target Format</Label>
              <Select value={convertFormat} onValueChange={(value: 'yaml' | 'xml' | 'csv' | 'toml') => setConvertFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="toml">TOML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={convertToFormat} disabled={!output} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Convert Format
            </Button>
            
            {convertedOutput && (
              <div className="space-y-2">
                <Label>Converted Output</Label>
                <Textarea
                  value={convertedOutput}
                  readOnly
                  className="min-h-[120px] font-mono text-xs bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(convertedOutput)}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Converted
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description Dialog */}
      <Dialog open={showDescription} onOpenChange={setShowDescription}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-600" />
              AI Analysis
            </DialogTitle>
            <DialogDescription>
              AI-generated description and analysis of your JSON data
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}