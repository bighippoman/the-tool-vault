import { notFound } from 'next/navigation';
import { categories } from '@/data/categories';
import { implementedTools } from '@/data/tools';
import ToolsGrid from '@/components/tools/ToolsGrid';

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  
  // Find the category
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    notFound();
  }
  
  // Filter tools by category
  const categoryTools = implementedTools.filter(tool => tool.category === categoryId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg ${category.bgClass}`}>
            <div className={`w-6 h-6 ${category.iconClass}`}>
              {/* You can add category-specific icons here */}
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {category.description}
            </p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''} available
        </div>
      </div>
      
      {categoryTools.length > 0 ? (
        <ToolsGrid tools={categoryTools} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no tools available in the {category.name} category yet.
          </p>
        </div>
      )}
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.id,
  }));
}

// Generate metadata for each category page
export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${category.name} Tools - Tool Vault`,
    description: category.description,
  };
}
