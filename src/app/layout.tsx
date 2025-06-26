import type { Metadata } from 'next';
import './globals.css'; // Import global styles
import { ClientProviders } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/layout/CookieConsent'; // Assuming this path
import ScrollToTop from '@/components/navigation/ScrollToTop';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: {
    default: 'NeuralStock.ai - Free Tools for Everyone',
    template: '%s | NeuralStock.ai'
  },
  description: 'Discover hundreds of free tool tools for developers, designers, marketers, and creators. From code generators to design tools, boost your productivity with NeuralStock.ai.',
  keywords: ['AI tools', 'productivity tools', 'developer tools', 'design tools', 'marketing tools', 'AI-powered', 'automation', 'NeuralStock'],
  authors: [{ name: 'NeuralStock.ai Team' }],
  creator: 'NeuralStock.ai',
  publisher: 'NeuralStock.ai',
  icons: {
    icon: '/neuralstock-logo.png',
    shortcut: '/neuralstock-logo.png',
    apple: '/neuralstock-logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getCanonicalUrl(),
    siteName: 'NeuralStock.ai',
    title: 'NeuralStock.ai - Free Tools for Everyone',
    description: 'Discover hundreds of free tools for developers, designers, marketers, and creators. Boost your productivity with cutting-edge AI technology.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuralStock.ai - Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuralStock.ai - Free Tools for Everyone',
    description: 'Discover hundreds of free tools for developers, designers, marketers, and creators.',
    images: ['/og-image.png'],
    creator: '@neuralstock',
  },
  alternates: {
    canonical: getCanonicalUrl(),
  },
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full flex flex-col min-h-screen" suppressHydrationWarning>
        <ClientProviders>
          <ScrollToTop />
          <Header />
          <main className="flex-grow w-full" role="main" aria-label="Main content">
            {children}
          </main>
          <Footer />
          <CookieConsent /> {/* Assuming this path and component name */}
        </ClientProviders>
      </body>
    </html>
  );
}
