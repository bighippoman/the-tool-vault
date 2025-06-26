
import { Tool } from '@/types/tool';
import ToolCard from './ToolCard';

interface ToolsGridProps {
  tools: Tool[];
  columns?: 2 | 3 | 4;
}

const ToolsGrid = ({ tools }: ToolsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

export default ToolsGrid;
