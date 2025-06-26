import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { CategoryInfo } from '@/types/tool';

interface ToolBreadcrumbProps {
  category?: CategoryInfo;
  toolName: string;
}

const ToolBreadcrumb = ({ category, toolName }: ToolBreadcrumbProps) => {
  return (
    <div className="tool-breadcrumb">
      {/* Mobile: Simplified back button, Desktop: Full breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-sm">
          <Link href="/tools" className="flex items-center text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to tools</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        
        {/* Desktop breadcrumb trail */}
        <div className="hidden sm:flex items-center gap-2">
          <Separator orientation="vertical" className="h-4" />
          <Link 
            href={`/category/${category?.id}`} 
            className="text-sm text-muted-foreground hover:text-primary truncate max-w-[150px] lg:max-w-none"
          >
            {category?.name}
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm truncate max-w-[200px] lg:max-w-none">{toolName}</span>
        </div>
        
        {/* Mobile: Show category as badge */}
        <div className="sm:hidden">
          {category && (
            <Badge variant="outline" className="text-xs">
              {category.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolBreadcrumb;
