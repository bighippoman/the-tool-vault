'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Info, Github } from 'lucide-react';
import SimpleCaptcha from '@/components/auth/SimpleCaptcha';
import PasswordInput from '@/components/auth/PasswordInput';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// AI GUIDANCE: This component handles the sign-up form logic
// To modify password requirements, update the validatePassword function
// To change validation messages, modify the password validation display section
// To add new sign-up fields, add them in the form section

interface SignUpFormProps {
  isLoading: boolean;
  onSignUp: (email: string, password: string, fullName: string, confirmPassword: string, captchaValid: boolean) => Promise<void>;
}

// AI GUIDANCE: Password validation rules are defined here
// Updated to follow modern UX guidelines - more flexible requirements
const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password);
  
  // Count how many criteria are met
  const criteriaCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  
  // Password is valid if it's 8+ chars AND meets at least 2 of 3 criteria
  // OR if it's 12+ chars with just letters (passphrase style)
  const isValid = minLength && (
    criteriaCount >= 2 || 
    (password.length >= 12 && hasLetter)
  );
  
  return {
    minLength,
    hasLetter,
    hasNumber,
    hasSpecial,
    criteriaCount,
    isValid
  };
};

const SignUpForm: React.FC<SignUpFormProps> = ({ isLoading, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignUp(email, password, fullName, confirmPassword, captchaValid);
  };

  const handleGithubSignUp = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
    } catch {
      toast.error('Failed to sign up with GitHub');
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription>Join NeuralStock.ai and unlock AI-powered productivity</CardDescription>
      </CardHeader>
      <CardContent>
        {/* GitHub Sign-Up Button */}
        <Button 
          type="button"
          variant="outline" 
          className="w-full mb-4" 
          onClick={handleGithubSignUp}
          disabled={isLoading}
        >
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>

        <div className="relative mb-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-xs text-muted-foreground">or continue with email</span>
          </div>
        </div>

        {/* AI GUIDANCE: Password requirements notice - modify text in Alert component */}
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Passwords must be at least 8 characters with a mix of characters for security.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AI GUIDANCE: Full name input */}
          <div className="space-y-2">
            <Label htmlFor="signup-full-name">Full Name</Label>
            <Input
              id="signup-full-name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* AI GUIDANCE: Email input - standard email validation applied */}
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* AI GUIDANCE: Password input with real-time validation display */}
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <PasswordInput
              id="signup-password"
              placeholder="Create a password"
              value={password}
              onChange={setPassword}
              required
            />
            
            {/* AI GUIDANCE: Real-time password validation display */}
            {password && (
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.minLength ? '✓' : '✗'} At least 8 characters
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.hasLetter ? '✓' : '✗'} Letter
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.hasNumber ? '✓' : '✗'} Number
                </div>
                <div className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.hasSpecial ? '✓' : '✗'} Special character
                </div>
                <div className="mt-2 text-gray-600">
                  {passwordValidation.isValid ? (
                    <span className="text-green-600 font-medium">✓ Password meets requirements</span>
                  ) : (
                    <span>
                      Need 2 of 3 criteria above, or 12+ characters with letters
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI GUIDANCE: Password confirmation with mismatch detection */}
          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm Password</Label>
            <PasswordInput
              id="signup-confirm"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* AI GUIDANCE: Captcha */}
          <div className="space-y-2">
            <SimpleCaptcha onValidationChange={(valid) => setCaptchaValid(valid)} />
          </div>

          {/* AI GUIDANCE: Submit button - disabled when loading, or password invalid */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" 
            disabled={isLoading || !passwordValidation.isValid || !captchaValid}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
