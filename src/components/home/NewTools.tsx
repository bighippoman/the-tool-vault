
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ToolsGrid from '@/components/tools/ToolsGrid';
import { getNewTools } from '@/data/tools';

const NewTools = () => {
  const tools = getNewTools(3);

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-2xl">✨</span>
              New Tools
            </h2>
            <p className="text-muted-foreground mt-2">
              Fresh from our hamster R&D department
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tools">View All Tools</Link>
          </Button>
        </div>
        
        <ToolsGrid tools={tools} columns={3} />
      </div>
    </section>
  );
};

export default NewTools;
