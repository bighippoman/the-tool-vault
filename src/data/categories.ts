
import { CategoryInfo } from '../types/tool';

export const categories: CategoryInfo[] = [
  {
    id: 'development',
    name: 'Development',
    description: 'Tools for developers, programmers, and coders',
    color: '#3b82f6',
    bgClass: 'bg-tool-dev/10',
    iconClass: 'text-tool-dev',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Tools for designers, artists, and creatives',
    color: '#ec4899',
    bgClass: 'bg-tool-design/10',
    iconClass: 'text-tool-design',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Tools to help you get more done',
    color: '#10b981',
    bgClass: 'bg-tool-productivity/10',
    iconClass: 'text-tool-productivity',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Tools for digital marketers and SEO professionals',
    color: '#f59e0b',
    bgClass: 'bg-tool-marketing/10',
    iconClass: 'text-tool-marketing',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial calculators and tools',
    color: '#6366f1',
    bgClass: 'bg-tool-finance/10',
    iconClass: 'text-tool-finance',
  },
  {
    id: 'chatbots',
    name: 'Chatbots',
    description: 'AI-powered chatbots and conversation tools',
    color: '#8b5cf6',
    bgClass: 'bg-tool-chatbots/10',
    iconClass: 'text-tool-chatbots',
  },
  {
    id: 'utility',
    name: 'Utility',
    description: 'General utility tools for everyday use',
    color: '#64748b',
    bgClass: 'bg-tool-utility/10',
    iconClass: 'text-tool-utility',
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Health and wellness calculators and tools',
    color: '#ef4444',
    bgClass: 'bg-tool-health/10',
    iconClass: 'text-tool-health',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational tools and learning resources',
    color: '#8b5cf6',
    bgClass: 'bg-tool-education/10',
    iconClass: 'text-tool-education',
  }
];

export const getAllCategories = (): CategoryInfo[] => {
  return categories;
};

export const getCategoryInfo = (categoryId: string): CategoryInfo => {
  return categories.find(category => category.id === categoryId) || categories[5]; // default to utility
};
