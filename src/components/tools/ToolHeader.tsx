import { Badge } from '@/components/ui/badge';
import ToolIcon from '@/components/tools/ToolIcon';
import { Tool } from '@/types/tool';
import { CategoryInfo } from '@/types/tool';

interface ToolHeaderProps {
  tool: Tool;
  category?: CategoryInfo;
}

const ToolHeader = ({ tool, category }: ToolHeaderProps) => {
  return (
    <div className="tool-header space-y-4 sm:space-y-6">
      {/* Mobile: Stacked layout, Desktop: Side by side */}
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 lg:gap-6">
        <div className="flex-shrink-0">
          <ToolIcon 
            category={tool.category}
            className="w-12 h-12 sm:w-16 sm:h-16" 
          />
        </div>
        
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight break-words">
            {tool.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
            {tool.description}
          </p>
        </div>
      </div>
      
      {/* Tags section with proper mobile wrapping */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {category && (
          <Badge 
            variant="outline"
            className={`${category.iconClass} border-0 px-2 py-1 text-xs sm:text-sm whitespace-nowrap`}
          >
            {category.name}
          </Badge>
        )}
        {tool.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-secondary/50 text-xs sm:text-sm px-2 py-1">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ToolHeader;
