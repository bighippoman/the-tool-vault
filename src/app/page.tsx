import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeaturedTools from '@/components/home/FeaturedTools';
import CategoriesSection from '@/components/home/Categories';
import NewTools from '@/components/home/NewTools';
import Newsletter from '@/components/home/Newsletter';
import ConfirmationToast from '@/components/auth/ConfirmationToast';

export const metadata: Metadata = {
  title: 'AI-Powered Tools for Developers, Designers & Creators',
  description: 'Discover 1000+ free AI-powered tools to boost your productivity. From code generators and design tools to marketing utilities and calculators - all in one place.',
  keywords: ['AI tools', 'free tools', 'productivity', 'developer tools', 'design tools', 'marketing tools', 'code generator', 'calculators'],
  openGraph: {
    title: 'NeuralStock.ai - AI-Powered Tools for Everyone',
    description: 'Discover 1000+ free AI-powered tools to boost your productivity. From code generators and design tools to marketing utilities.',
    url: 'https://neuralstock.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuralStock.ai - AI-Powered Tools',
      },
    ],
  },
  alternates: {
    canonical: 'https://neuralstock.ai',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col flex-grow w-full px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4 lg:space-y-6 overflow-x-hidden">
      <ConfirmationToast />
      <Hero />
      <FeaturedTools />
      <CategoriesSection />
      <NewTools />
      <Newsletter />
    </div>
  );
}
