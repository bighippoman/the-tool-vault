import type { Metadata } from 'next';
import ToolsGrid from '@/components/tools/ToolsGrid'; // Assuming path
import { implementedTools as tools } from '@/data/tools'; // Corrected import

export const metadata: Metadata = {
  title: 'All AI-Powered Tools - Browse 1000+ Free Productivity Tools',
  description: 'Browse our complete collection of 1000+ free AI-powered tools for developers, designers, marketers, and creators. Find the perfect tool to boost your productivity.',
  keywords: ['AI tools', 'productivity tools', 'free tools', 'developer tools', 'design tools', 'marketing tools', 'all tools', 'tool directory'],
  openGraph: {
    title: 'All AI-Powered Tools | NeuralStock.ai',
    description: 'Browse our complete collection of 1000+ free AI-powered tools for developers, designers, marketers, and creators.',
    url: 'https://neuralstock.ai/tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'All AI-Powered Tools - NeuralStock.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All AI-Powered Tools | NeuralStock.ai',
    description: 'Browse our complete collection of 1000+ free AI-powered tools.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuralstock.ai/tools',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolsPage() {
  return (
    <div className="flex flex-col flex-grow w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 space-y-3 sm:space-y-4 lg:space-y-6 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover {tools.length} AI-powered tools to boost your productivity
        </p>
      </div>
      <ToolsGrid tools={tools} />
    </div>
  );
}
