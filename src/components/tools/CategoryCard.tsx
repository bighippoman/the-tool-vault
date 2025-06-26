"use client";

import Link from 'next/link';
import { CategoryInfo } from '@/types/tool';
import { 
  Code, Palette, LineChart, BarChart3, Calculator, 
  Wrench, Heart, GraduationCap, MessageCircle
} from 'lucide-react';

interface CategoryCardProps {
  category: CategoryInfo;
  count?: number;
}

const getCategoryIcon = (id: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    development: <Code className="h-6 w-6" />,
    design: <Palette className="h-6 w-6" />,
    productivity: <LineChart className="h-6 w-6" />,
    marketing: <BarChart3 className="h-6 w-6" />,
    finance: <Calculator className="h-6 w-6" />,
    chatbots: <MessageCircle className="h-6 w-6" />,
    utility: <Wrench className="h-6 w-6" />,
    health: <Heart className="h-6 w-6" />,
    education: <GraduationCap className="h-6 w-6" />,
  };
  
  return icons[id] || <Wrench className="h-6 w-6" />;
};

const CategoryCard = ({ category, count }: CategoryCardProps) => {
  return (
    <Link href={`/category/${category.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 h-full">
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="p-3 rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${category.color}15`, color: category.color }}
          >
            {getCategoryIcon(category.id)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors mb-1">
              {category.name}
            </h3>
            {count !== undefined && (
              <p className="text-sm text-gray-500 font-medium">
                {count} {count === 1 ? 'tool' : 'tools'}
              </p>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
