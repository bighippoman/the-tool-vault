
import { Badge } from '@/components/ui/badge';
import { CategoryInfo } from '@/types/tool';

interface ToolCardContentProps {
  description: string;
  category: CategoryInfo;
}

const ToolCardContent = ({ description, category }: ToolCardContentProps) => {
  return (
    <div className="space-y-3">
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
        {description}
      </p>
      <Badge 
        variant="outline"
        className={`${category.iconClass} border-0 px-2 py-1 text-xs font-medium`}
      >
        {category.name}
      </Badge>
    </div>
  );
};

export default ToolCardContent;
