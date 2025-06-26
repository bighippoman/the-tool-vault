import { use, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Database, Globe, Zap } from 'lucide-react'
import { requireAuthorizedUser } from '@/lib/auth-server'

// Sample API endpoints to demonstrate streaming
const apiEndpoints = [
  {
    name: 'JSONPlaceholder Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Sample blog posts data',
    limit: 3
  },
  {
    name: 'JSONPlaceholder Users', 
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Sample user profiles',
    limit: 2
  },
  {
    name: 'HTTP Status Codes',
    url: 'https://httpstat.us/200',
    description: 'HTTP status testing',
    limit: 1
  }
]

// Server-side async function using use() hook
async function fetchJsonData(url: string, limit?: number) {
  try {
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'User-Agent': 'Tool-Vault-React19-Demo'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    const limitedData = limit && Array.isArray(data) ? data.slice(0, limit) : data
    
    return {
      success: true,
      data: limitedData,
      size: JSON.stringify(limitedData).length,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      size: 0
    }
  }
}

// Component that uses use() to stream JSON data
function JsonStreamCard({ endpoint }: { endpoint: typeof apiEndpoints[0] }) {
  // 🔥 React 19 use() hook - streams data server-side!
  const result = use(fetchJsonData(endpoint.url, endpoint.limit))
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {endpoint.name}
          </CardTitle>
          {result.success ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {result.status}
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Error
            </Badge>
          )}
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {result.success ? (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Size: {result.size} bytes</span>
              <span>Items: {Array.isArray(result.data) ? result.data.length : 1}</span>
            </div>
            
            <div className="bg-muted p-3 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
            
            {result.headers && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Response Headers
                </summary>
                <pre className="mt-2 bg-muted p-2 rounded">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </details>
            )}
          </>
        ) : (
          <div className="bg-destructive/10 p-3 rounded-lg">
            <p className="text-destructive text-sm">
              <strong>Error:</strong> {result.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Loading fallback for Suspense
function JsonStreamSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
        </div>
        <div className="h-4 bg-muted rounded w-48 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}

// Main page component
export default async function React19JsonStreamPage() {
  await requireAuthorizedUser()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">React 19 JSON Streaming Demo</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Showcasing React 19&apos;s new <code className="bg-muted px-1 rounded">use()</code> hook 
          for streaming JSON data directly in Server Components. No useEffect, no loading states, 
          no client-side hydration — just pure async data streaming! 🚀
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
          <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">Server-Side</h3>
          <p className="text-sm text-green-600 dark:text-green-400">Rendered on server, streamed to client</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Zero JavaScript</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">No client-side fetch or useEffect</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Real-time</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400">Fresh data on every page load</p>
        </div>
      </div>

      {/* Streaming JSON Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {apiEndpoints.map((endpoint, index) => (
          <Suspense key={endpoint.url} fallback={<JsonStreamSkeleton />}>
            <JsonStreamCard endpoint={endpoint} />
          </Suspense>
        ))}
      </div>

      {/* Code Example */}
      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          How This Works (React 19 use() Hook)
        </h2>
        <pre className="text-sm overflow-x-auto bg-background p-4 rounded border">
{`import { use } from 'react'

function JsonStreamCard({ endpoint }) {
  // 🔥 React 19 use() hook - streams data server-side!
  const result = use(fetchJsonData(endpoint.url))
  
  return (
    <div>
      {result.success ? (
        <pre>{JSON.stringify(result.data, null, 2)}</pre>
      ) : (
        <p>Error: {result.error}</p>
      )}
    </div>
  )
}

// No useEffect, no loading states, no client hydration!`}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">✅ Server Components Only</Badge>
          <Badge variant="outline">✅ Fresh Data Every Load</Badge>
          <Badge variant="outline">✅ Zero Client JS for Data</Badge>
          <Badge variant="outline">✅ Built-in Error Handling</Badge>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'React 19 JSON Streaming Demo | Tool Vault',
    description: 'Experience React 19\'s revolutionary use() hook for streaming JSON data in Server Components. No useEffect, no loading states, just pure async streaming!',
    keywords: ['React 19', 'use() hook', 'Server Components', 'JSON streaming', 'Next.js 15', 'async data'],
  }
}
