"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolsGrid from '@/components/tools/ToolsGrid';
import { getPopularTools } from '@/data/tools';

const FeaturedTools = () => {
  const tools = getPopularTools(6);

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Popular Tools
              <span className="text-lg">⚡</span>
            </h2>
            <p className="text-gray-600 mb-12">Discover our most popular tools that developers and creators can&apos;t live without</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tools">View All Tools</Link>
          </Button>
        </div>
        
        <ToolsGrid tools={tools} />
      </div>
    </section>
  );
};

export default FeaturedTools;
