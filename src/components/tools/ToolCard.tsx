"use client";

import Link from 'next/link';
import { Tool } from '@/types/tool';
import { getCategoryInfo } from '@/data/categories';
import ToolCardIcon from './ToolCardIcon';
import ToolCardHeader from './ToolCardHeader';
import ToolCardContent from './ToolCardContent';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const category = getCategoryInfo(tool.category);

  return (
    <Link href={tool.path} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 h-full">
        <div className="flex items-start gap-3">
          <ToolCardIcon category={tool.category} />
          <div className="flex-1 min-w-0">
            <ToolCardHeader 
              name={tool.name} 
              isNew={tool.isNew} 
              isPopular={tool.isPopular} 
            />
            <ToolCardContent description={tool.description} category={category} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
