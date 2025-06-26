import { use, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, FileText, Lightbulb, Zap, Code, BarChart3, Users, CheckCircle, XCircle, Database, FileCode } from 'lucide-react'
import Link from 'next/link'
import { requireAuthorizedUser } from '@/lib/auth-server'

// Server-side JSON schema generation using React 19 use() hook
async function generateJsonSchema(jsonInput: string): Promise<{
  success: boolean
  schema?: Record<string, unknown>
  error?: string
  stats?: {
    properties: number
    required: number
    types: string[]
    depth: number
  }
}> {
  try {
    if (!jsonInput.trim()) {
      return { success: false, error: 'JSON input is required' }
    }

    const parsed = JSON.parse(jsonInput)
    
    // Generate schema from parsed JSON
    const schema = generateSchemaFromValue(parsed, 'object')
    
    // Calculate stats
    const stats = calculateStats(schema)
    
    // Simulate async processing (in real app, this could be AI-powered)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      success: true,
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        ...schema
      },
      stats
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    }
  }
}

function generateSchemaFromValue(value: unknown, parentType?: string): Record<string, unknown> {
  if (value === null) return { type: 'null' }
  
  const type = typeof value
  
  switch (type) {
    case 'string':
      return { type: 'string' }
    case 'number':
      return { type: Number.isInteger(value as number) ? 'integer' : 'number' }
    case 'boolean':
      return { type: 'boolean' }
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return { type: 'array', items: {} }
        }
        // Get schema for first item (could be enhanced to merge all item types)
        const itemSchema = generateSchemaFromValue(value[0])
        return {
          type: 'array',
          items: itemSchema
        }
      } else {
        const properties: Record<string, unknown> = {}
        const required: string[] = []
        
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
          properties[key] = generateSchemaFromValue(val)
          required.push(key)
        }
        
        return {
          properties,
          required,
          additionalProperties: false
        }
      }
    default:
      return { type: 'string' }
  }
}

function calculateStats(schema: Record<string, unknown>): {
  properties: number
  required: number
  types: string[]
  depth: number
} {
  const types = new Set<string>()
  let properties = 0
  let required = 0
  let maxDepth = 0
  
  function traverse(obj: Record<string, unknown>, depth = 0) {
    maxDepth = Math.max(maxDepth, depth)
    
    if (obj.type && typeof obj.type === 'string') {
      types.add(obj.type)
    }
    
    if (obj.properties && typeof obj.properties === 'object') {
      const props = obj.properties as Record<string, unknown>
      properties += Object.keys(props).length
      for (const prop of Object.values(props)) {
        if (prop && typeof prop === 'object') {
          traverse(prop as Record<string, unknown>, depth + 1)
        }
      }
    }
    
    if (obj.required && Array.isArray(obj.required)) {
      required += obj.required.length
    }
    
    if (obj.items && typeof obj.items === 'object') {
      traverse(obj.items as Record<string, unknown>, depth + 1)
    }
  }
  
  traverse(schema)
  
  return {
    properties,
    required,
    types: Array.from(types),
    depth: maxDepth
  }
}

// Sample JSON examples
const sampleJsons = [
  {
    name: 'User Profile',
    json: `{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "roles": ["admin", "user"],
  "profile": {
    "age": 30,
    "city": "New York"
  }
}`
  },
  {
    name: 'Product Catalog',
    json: `{
  "products": [
    {
      "id": "p001",
      "name": "Laptop",
      "price": 999.99,
      "inStock": true,
      "tags": ["electronics", "computers"]
    }
  ],
  "total": 1,
  "currency": "USD"
}`
  }
]

// Component using React 19 use() hook
function JsonSchemaResult({ jsonInput }: { jsonInput: string }) {
  // React 19 use() hook - generates schema server-side!
  const result = use(generateJsonSchema(jsonInput))
  
  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Schema Generation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{result.error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            Schema Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.stats?.properties}</div>
              <div className="text-sm text-muted-foreground">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.stats?.required}</div>
              <div className="text-sm text-muted-foreground">Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{result.stats?.depth}</div>
              <div className="text-sm text-muted-foreground">Max Depth</div>
            </div>
            <div className="text-center">
              <div className="flex flex-wrap gap-1 justify-center">
                {result.stats?.types.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Schema */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              Generated JSON Schema
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(result.schema, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton
function SchemaGenerationSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-64 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  )
}

// Main page component (Server Component)
export default async function JsonSchemaGeneratorPage({
  searchParams
}: {
  searchParams: Promise<{ json?: string }>
}) {
  await requireAuthorizedUser()
  const params = await searchParams
  const jsonInput = params.json || ''

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">JSON Schema Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Powered by React 19&apos;s <code className="bg-muted px-1 rounded">use()</code> hook 
          for instant server-side schema generation. Paste your JSON and get a valid schema instantly! 
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JSON Input</CardTitle>
              <CardDescription>
                Paste your JSON data below to generate a schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  💡 <strong>How to use:</strong> Add your JSON data to the URL like this:
                </p>
                <code className="text-xs">
                  /tool/json-schema-generator?json={`{"name":"John","age":30}`}
                </code>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleJsons.map((sample, index) => (
                    <a
                      key={index}
                      href={`/tool/json-schema-generator?json=${encodeURIComponent(sample.json)}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      {sample.name}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div>
          {jsonInput ? (
            <Suspense fallback={<SchemaGenerationSkeleton />}>
              <JsonSchemaResult jsonInput={jsonInput} />
            </Suspense>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileCode className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Generate</h3>
                <p className="text-muted-foreground">
                  Enter JSON data to see the magic of React 19&apos;s use() hook in action!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* React 19 Features */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          React 19 Features in Action
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Server-Side use() Hook</h3>
            <p className="text-sm text-muted-foreground">Schema generation happens on the server with React 19&apos;s use() hook</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Streaming Suspense</h3>
            <p className="text-sm text-muted-foreground">Progressive loading with built-in Suspense boundaries</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Zero Client JS</h3>
            <p className="text-sm text-muted-foreground">Schema analysis runs entirely on the server</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'JSON Schema Generator | React 19 use() Hook Demo',
    description: 'Generate JSON schemas instantly using React 19&apos;s revolutionary use() hook. Server-side schema generation with zero client JavaScript.',
    keywords: ['JSON schema', 'React 19', 'use() hook', 'server components', 'schema generator'],
  }
}
