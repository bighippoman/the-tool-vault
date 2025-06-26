'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';
import SimpleCaptcha from '@/components/auth/SimpleCaptcha';
import PasswordInput from '@/components/auth/PasswordInput';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// AI GUIDANCE: This component handles the sign-in form logic
// To modify sign-in validation, update the handleSignIn function
// To change the form layout, modify the JSX structure below
// To add new sign-in methods (Google, etc.), add buttons in the CardContent section

interface SignInFormProps {
  isLoading: boolean;
  onSignIn: (email: string, password: string, captchaValid: boolean) => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({ isLoading, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSignIn(email, password, captchaValid);
    } catch {
      // Reset captcha on failed attempts
      setResetCaptcha(prev => !prev);
    }
  };

  const handleGithubSignIn = async () => {
    setGithubLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch {
      toast.error('Failed to sign in with GitHub');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sign In
        </CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        {/* GitHub Sign-In Button */}
        <Button 
          type="button"
          variant="outline" 
          className="w-full mb-4" 
          onClick={handleGithubSignIn}
          disabled={isLoading || githubLoading}
        >
          <Github className="w-4 h-4 mr-2" />
          {githubLoading ? 'Signing in with GitHub...' : 'Sign in with GitHub'}
        </Button>

        <div className="relative mb-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-muted-foreground">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AI GUIDANCE: Email input - standard email validation applied */}
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* AI GUIDANCE: Password input - uses PasswordInput component for visibility toggle */}
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <PasswordInput
              id="signin-password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          {/* AI GUIDANCE: Captcha input */}
          <div className="space-y-2">
            <SimpleCaptcha 
              onValidationChange={(valid) => setCaptchaValid(valid)} 
              reset={resetCaptcha} 
            />
          </div>

          {/* AI GUIDANCE: Submit button - disabled when loading */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
            disabled={isLoading || !captchaValid}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
