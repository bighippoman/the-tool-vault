import type { Metadata } from 'next';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactFAQ from '@/components/contact/ContactFAQ';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with NeuralStock.ai',
  description: 'Have questions about our AI-powered tools? Need support or want to suggest a new feature? Contact the NeuralStock.ai team - we\'d love to hear from you!',
  keywords: ['contact', 'support', 'help', 'feedback', 'questions', 'NeuralStock support', 'AI tools support'],
  openGraph: {
    title: 'Contact Us | NeuralStock.ai',
    description: 'Have questions about our AI-powered tools? Contact the NeuralStock.ai team - we\'d love to hear from you!',
    url: 'https://neuralstock.ai/contact',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact NeuralStock.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | NeuralStock.ai',
    description: 'Have questions about our AI-powered tools? Contact us!',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuralstock.ai/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ContactHero />
      <div className="container py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ContactForm />
            </div>
            <div className="space-y-8">
              <ContactInfo />
              <ContactFAQ />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
