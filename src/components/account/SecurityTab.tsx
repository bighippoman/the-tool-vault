'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface SecurityTabProps {
  user: User;
}

const SecurityTab = ({ user }: SecurityTabProps) => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Get authentication methods
  const getAuthMethods = () => {
    if (!user) return [];
    
    const methods = [];
    
    // Check for email authentication
    if (user.email && !user.app_metadata?.provider) {
      methods.push('Email/Password');
    }
    
    // Check for OAuth providers
    const providers = user.app_metadata?.providers || [];
    if (user.app_metadata?.provider && !providers.includes(user.app_metadata.provider)) {
      providers.push(user.app_metadata.provider);
    }
    
    providers.forEach((provider: string) => {
      const capitalizedProvider = provider.charAt(0).toUpperCase() + provider.slice(1);
      methods.push(capitalizedProvider);
    });
    
    return methods.length > 0 ? methods : ['Email/Password'];
  };

  // Check if user can change password (has email auth method)
  const canChangePassword = () => {
    const authMethods = getAuthMethods();
    
    // If user has email confirmed, they can change password
    if (user.email_confirmed_at) return true;
    
    // If no OAuth provider is set, assume email/password
    if (!user.app_metadata?.provider) return true;
    
    // If they have email/password method alongside OAuth
    return authMethods.includes('Email/Password');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const authMethods = getAuthMethods();
  const passwordChangeAllowed = canChangePassword();

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Manage your password and security preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!passwordChangeAllowed ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                You&apos;re signed in with {authMethods.filter(m => m !== 'Email/Password').join(', ')}. 
                Password changes must be done through your OAuth provider(s).
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {authMethods.length > 1 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have multiple sign-in methods. Changing your password will only affect email/password authentication.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button type="submit" disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
