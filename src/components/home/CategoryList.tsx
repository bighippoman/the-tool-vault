import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { 
  Code, Palette, LineChart, BarChart3, Calculator, 
  Wrench, Heart, GraduationCap
} from 'lucide-react';

const getCategoryIcon = (id: string) => {
  const icons: Record<string, React.ReactNode> = {
    development: <Code className="h-4 w-4" />,
    design: <Palette className="h-4 w-4" />,
    productivity: <LineChart className="h-4 w-4" />,
    marketing: <BarChart3 className="h-4 w-4" />,
    finance: <Calculator className="h-4 w-4" />,
    utility: <Wrench className="h-4 w-4" />,
    health: <Heart className="h-4 w-4" />,
    education: <GraduationCap className="h-4 w-4" />,
  };
  
  return icons[id] || <Wrench className="h-4 w-4" />;
};

const CategoryList = () => {
  return (
    <div className="py-8 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Browse Categories</h2>
          <p className="text-muted-foreground">
            Explore our tools organized by category
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="group"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:shadow-md hover:border-primary/20 transition-all duration-200">
                <div className={`p-1.5 rounded-md ${category.bgClass} ${category.iconClass}`}>
                  {getCategoryIcon(category.id)}
                </div>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link 
            href="/categories" 
            className="text-sm text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
