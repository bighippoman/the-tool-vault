"use client";

import { useEffect, useState, memo, ComponentType, Suspense } from 'react';
import { Tool } from '@/types/tool';
import { ToolComponents } from '@/components/tools/ToolComponentsMap';
import { notFound } from 'next/navigation';

const LoadingSpinner = () => (
  <div className="flex flex-col space-y-6 p-6 max-w-4xl mx-auto">
    {/* Tool Header Skeleton */}
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
    </div>
    
    {/* Tool Interface Skeleton */}
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    
    {/* Loading text */}
    <div className="text-center">
      <p className="text-gray-500 text-sm">Loading tool interface...</p>
    </div>
    
    {/* Noscript fallback */}
    <noscript>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mt-4">
        <strong className="font-semibold">JavaScript Required:</strong>
        <p className="mt-1">This tool requires JavaScript to function properly. Please enable JavaScript in your browser to use this tool.</p>
      </div>
    </noscript>
  </div>
);

interface ToolPageClientProps {
  tool: Tool | null | undefined;
}

const ToolPageClient = memo(({ tool }: ToolPageClientProps) => {
  const [SpecificToolComponent, setSpecificToolComponent] = useState<ComponentType<{ tool: Tool }> | null>(null);

  useEffect(() => {
    if (tool && ToolComponents[tool.id]) {
      setSpecificToolComponent(() => ToolComponents[tool.id]);
    } else if (tool) {
      // Tool data exists, but no component mapping found
      const MissingComponent = () => (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">UI Missing!</strong>
          <span className="block sm:inline"> The UI component for &quot;{tool.name}&quot; is not yet available.</span>
        </div>
      );
      MissingComponent.displayName = 'MissingComponent';
      setSpecificToolComponent(() => MissingComponent);
    }
  }, [tool]);

  // Initial check if tool data is still being resolved by the parent server component (should ideally not happen if parent awaits)
  // Or if tool was not found by parent.
  if (tool === undefined) { // Should ideally be handled by parent, but as a safeguard
    return (
      <div className="flex flex-col flex-grow items-center justify-center">
        <p>Loading tool details...</p>
      </div>
    );
  }

  if (tool === null) {
    notFound(); // This will trigger the nearest notFound.tsx or Next.js default 404 page
    return null; // Important to return null after calling notFound
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex flex-col flex-grow w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 space-y-6">
        {SpecificToolComponent ? <SpecificToolComponent tool={tool} /> : <LoadingSpinner />}
      </div>
    </Suspense>
  );
});

ToolPageClient.displayName = 'ToolPageClient';

export default ToolPageClient;
