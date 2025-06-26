
import { CategoryInfo } from '@/types/tool';
import { getToolsByCategory } from '@/data/tools';
import CategoryCard from './CategoryCard';

interface CategoriesGridProps {
  categories: CategoryInfo[];
  columns?: 2 | 3 | 4;
}

const CategoriesGrid = ({ categories, columns = 3 }: CategoriesGridProps) => {
  const getGridClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 4: 
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 3:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-6 auto-rows-fr`}>
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          count={getToolsByCategory(category.id).length} 
        />
      ))}
    </div>
  );
};

export default CategoriesGrid;
