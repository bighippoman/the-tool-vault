
import { CategoryInfo } from '@/types/tool';

interface CategoryHeaderProps {
  category: CategoryInfo;
  totalTools: number;
}

const CategoryHeader = ({ category, totalTools }: CategoryHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.bgClass} mb-4`}>
        <div className={`text-2xl ${category.iconClass}`}>
          🔧
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{category.name} Tools</h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
        {category.description}
      </p>
      
      <div className="text-sm text-muted-foreground">
        {totalTools} tool{totalTools !== 1 ? 's' : ''} available
      </div>
    </div>
  );
};

export default CategoryHeader;
