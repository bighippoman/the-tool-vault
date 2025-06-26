import { use, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Zap, Globe, Server, Database, AlertTriangle } from 'lucide-react'
import { requireAuthorizedUser } from '@/lib/auth-server'

// API endpoints to monitor
const apiEndpoints = [
  {
    name: 'JSONPlaceholder API',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    description: 'Fake REST API for testing',
    type: 'REST API'
  },
  {
    name: 'HTTP Status API',
    url: 'https://httpstat.us/200',
    description: 'HTTP status code testing',
    type: 'Status API'
  },
  {
    name: 'Github API',
    url: 'https://api.github.com/zen',
    description: 'GitHub REST API v3',
    type: 'Public API'
  },
  {
    name: 'Cat Facts API',
    url: 'https://catfact.ninja/fact',
    description: 'Random cat facts',
    type: 'Fun API'
  },
  {
    name: 'UUID Generator',
    url: 'https://httpbin.org/uuid',
    description: 'UUID generation service',
    type: 'Utility API'
  },
  {
    name: 'IP Info API',
    url: 'https://httpbin.org/ip',
    description: 'IP address information',
    type: 'Info API'
  }
]

// Server-side API health check using React 19 use() hook
async function checkApiHealth(url: string): Promise<{
  url: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime: number
  statusCode?: number
  error?: string
  lastChecked: string
}> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'User-Agent': 'Tool-Vault-API-Monitor'
      }
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    let status: 'healthy' | 'degraded' | 'down'
    
    if (response.ok) {
      status = responseTime < 1000 ? 'healthy' : 'degraded'
    } else {
      status = 'down'
    }
    
    return {
      url,
      status,
      responseTime,
      statusCode: response.status,
      lastChecked: new Date().toISOString()
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return {
      url,
      status: 'down',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastChecked: new Date().toISOString()
    }
  }
}

// Component that uses use() to check API health
function ApiHealthCard({ endpoint }: { endpoint: typeof apiEndpoints[0] }) {
  // 🔥 React 19 use() hook - checks API health server-side!
  const health = use(checkApiHealth(endpoint.url))
  
  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }
  
  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {endpoint.name}
          </CardTitle>
          {getStatusIcon()}
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{endpoint.type}</Badge>
          <Badge className={getStatusColor()}>
            {health.status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Response Time</div>
            <div className="font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {health.responseTime}ms
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Status Code</div>
            <div className="font-semibold">
              {health.statusCode || 'N/A'}
            </div>
          </div>
        </div>
        
        {health.error && (
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>Error:</strong> {health.error}
            </p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton for Suspense
function ApiHealthSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-4 bg-muted rounded w-48 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-muted rounded w-20 animate-pulse" />
          <div className="h-5 bg-muted rounded w-16 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Server-side summary calculation
async function calculateOverallHealth(): Promise<{
  total: number
  healthy: number
  degraded: number
  down: number
  avgResponseTime: number
}> {
  // Get all health checks
  const healthChecks = await Promise.all(
    apiEndpoints.map(endpoint => checkApiHealth(endpoint.url))
  )
  
  const healthy = healthChecks.filter(h => h.status === 'healthy').length
  const degraded = healthChecks.filter(h => h.status === 'degraded').length
  const down = healthChecks.filter(h => h.status === 'down').length
  const avgResponseTime = Math.round(
    healthChecks.reduce((sum, h) => sum + h.responseTime, 0) / healthChecks.length
  )
  
  return {
    total: healthChecks.length,
    healthy,
    degraded,
    down,
    avgResponseTime
  }
}

// Summary component using use() hook
function HealthSummary() {
  // 🔥 React 19 use() hook - calculates summary server-side!
  const summary = use(calculateOverallHealth())
  
  const overallStatus = summary.down > 0 ? 'Issues Detected' : 
                       summary.degraded > 0 ? 'Degraded Performance' : 
                       'All Systems Operational'
  
  const statusColor = summary.down > 0 ? 'text-red-600' : 
                     summary.degraded > 0 ? 'text-yellow-600' : 
                     'text-green-600'
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-6 h-6" />
          System Status Overview
        </CardTitle>
        <CardDescription>
          Real-time API health monitoring powered by React 19&apos;s use() hook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${statusColor}`}>
              {overallStatus}
            </div>
            <div className="text-sm text-muted-foreground">Overall Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.healthy}</div>
            <div className="text-sm text-muted-foreground">Healthy APIs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.degraded}</div>
            <div className="text-sm text-muted-foreground">Degraded APIs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.down}</div>
            <div className="text-sm text-muted-foreground">Down APIs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.avgResponseTime}ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main page component (Server Component)
export default async function ApiStatusDashboard() {
  await requireAuthorizedUser()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">API Status Dashboard</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real-time API monitoring using React 19&apos;s <code className="bg-muted px-1 rounded">use()</code> hook.
          All health checks run server-side with zero client JavaScript! 🚀
        </p>
      </div>

      {/* Summary Section */}
      <Suspense fallback={
        <Card className="mb-8">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-64 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <HealthSummary />
      </Suspense>

      {/* API Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {apiEndpoints.map((endpoint) => (
          <Suspense key={endpoint.url} fallback={<ApiHealthSkeleton />}>
            <ApiHealthCard endpoint={endpoint} />
          </Suspense>
        ))}
      </div>

      {/* React 19 Features */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          React 19 Server Component Magic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Server-Side Health Checks</h3>
            <p className="text-sm text-muted-foreground">All API monitoring happens on the server using use() hook</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Parallel Suspense</h3>
            <p className="text-sm text-muted-foreground">Each API check streams independently with Suspense boundaries</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold">Fresh Data Always</h3>
            <p className="text-sm text-muted-foreground">Real-time status on every page load, no stale cache</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <pre className="text-sm text-muted-foreground">
{`function ApiHealthCard({ endpoint }) {
  // 🔥 React 19 use() hook
  const health = use(checkApiHealth(endpoint.url))
  
  return <div>Status: {health.status}</div>
}

// No useEffect, no loading states, no client JS!`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'API Status Dashboard | React 19 Server Components Demo',
    description: 'Real-time API monitoring dashboard built with React 19 use() hook and Server Components. Zero client JavaScript for data fetching.',
    keywords: ['API monitoring', 'React 19', 'use() hook', 'server components', 'status dashboard'],
  }
}
