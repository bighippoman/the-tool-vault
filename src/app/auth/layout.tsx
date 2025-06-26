import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Sign Up - NeuralStock.ai',
  description: 'Sign in to your NeuralStock.ai account or create a new account to save your work, access premium features, and sync your tools across devices.',
  keywords: ['sign in', 'sign up', 'login', 'register', 'account', 'NeuralStock account', 'user authentication'],
  openGraph: {
    title: 'Sign In | Sign Up | NeuralStock.ai',
    description: 'Sign in to your NeuralStock.ai account or create a new account to access premium features.',
    url: 'https://neuralstock.ai/auth',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuralStock.ai Authentication',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In | Sign Up | NeuralStock.ai',
    description: 'Sign in to your account or create a new one to access premium features.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuralstock.ai/auth',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
