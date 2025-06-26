import { Zap, Database } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
          <h1 className="text-3xl font-bold">React 19 JSON Streaming Demo</h1>
        </div>
        <p className="text-muted-foreground">
          🚀 Streaming JSON data with React 19&apos;s <code className="bg-muted px-1 rounded">use()</code> hook...
        </p>
      </div>

      {/* Features skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted p-4 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-background rounded mx-auto mb-2" />
            <div className="h-5 bg-background rounded mb-2" />
            <div className="h-4 bg-background rounded" />
          </div>
        ))}
      </div>

      {/* Streaming cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                <div className="h-5 bg-muted rounded w-16 animate-pulse" />
              </div>
              <div className="h-4 bg-muted rounded w-48 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
              </div>
              <div className="h-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Database className="w-5 h-5 animate-spin" />
          <span>Fetching fresh JSON data from APIs...</span>
        </div>
      </div>
    </div>
  )
}
