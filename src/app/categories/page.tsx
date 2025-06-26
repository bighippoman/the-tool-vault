import type { Metadata } from 'next';
import CategoryCard from '@/components/tools/CategoryCard'; // Assuming path
import { categories } from '@/data/categories'; // Assuming path

export const metadata: Metadata = {
  title: 'Tool Categories - Browse AI Tools by Category',
  description: 'Explore our organized collection of AI-powered tools across multiple categories including development, design, marketing, finance, and productivity tools.',
  keywords: ['tool categories', 'AI tool categories', 'developer tools', 'design tools', 'marketing tools', 'productivity categories', 'browse tools'],
  openGraph: {
    title: 'Tool Categories | NeuralStock.ai',
    description: 'Explore our organized collection of AI-powered tools across multiple categories.',
    url: 'https://neuralstock.ai/categories',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tool Categories - NeuralStock.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tool Categories | NeuralStock.ai',
    description: 'Explore our organized collection of AI-powered tools across multiple categories.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuralstock.ai/categories',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CategoriesPage() {
  return (
    <div className="flex flex-col flex-grow w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 space-y-3 sm:space-y-4 lg:space-y-6 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Browse by Category
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover tools organized by category to find exactly what you need
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
