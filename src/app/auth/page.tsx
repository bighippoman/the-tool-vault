"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL parameters for errors and confirmations
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    const confirmed = searchParams.get('confirmed');

    if (confirmed === 'true') {
      toast.success('Email confirmed successfully! You can now sign in.');
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('confirmed');
      window.history.replaceState({}, '', url.toString());
      return;
    }

    if (error) {
      let errorMessage = 'An error occurred';
      
      if (message) {
        errorMessage = decodeURIComponent(message);
      } else {
        // Fallback error messages
        switch (error) {
          case 'confirmation_failed':
            errorMessage = 'Email confirmation failed. Please try again.';
            break;
          case 'oauth_error':
            errorMessage = 'OAuth authentication failed. Please try again.';
            break;
          case 'missing_code':
            errorMessage = 'Invalid confirmation link. Please request a new one.';
            break;
          default:
            errorMessage = 'Authentication error occurred. Please try again.';
        }
      }
      
      toast.error(errorMessage);
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleSignIn = async (email: string, password: string, captchaValid: boolean) => {
    if (!captchaValid) {
      toast.error('Please complete the captcha verification');
      return;
    }

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast.success('Successfully signed in!');
      router.push('/');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    confirmPassword: string, 
    captchaValid: boolean
  ) => {
    if (!captchaValid) {
      toast.error('Please complete the captcha verification');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setShowEmailSent(true);
      toast.success('Account created! Please check your email to verify your account.');
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showEmailSent) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p className="text-gray-800">
                We&apos;ve sent you a verification link. Please check your email and click the link to continue.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowEmailSent(false)}
                className="mt-4"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to NeuralStock.ai
          </h1>
          <p className="text-gray-800 mt-2">
            Sign in to access premium features and save your preferences
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <SignInForm 
                  isLoading={isLoading}
                  onSignIn={handleSignIn}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <SignUpForm 
                  isLoading={isLoading}
                  onSignUp={handleSignUp}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-gray-700 mt-6">
          By signing up, you agree to our{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/cookie-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
            Cookie Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
