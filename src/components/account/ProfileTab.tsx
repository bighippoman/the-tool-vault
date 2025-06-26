'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface ProfileTabProps {
  user: User;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  });
  const [originalProfile, setOriginalProfile] = useState({
    full_name: '',
    email: '',
  });

  // Load user profile data
  useEffect(() => {
    if (user) {
      const profileData = {
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
      };
      setProfile(profileData);
      setOriginalProfile(profileData);
    }
  }, [user]);

  // Check if profile has been modified
  const hasProfileChanges = profile.full_name !== originalProfile.full_name;

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasProfileChanges) {
      toast.info('No changes to save');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
        }
      });

      if (error) throw error;

      // Update original profile to reflect saved state
      setOriginalProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const authMethods = getAuthMethods();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Authentication Methods</Label>
            <div className="space-y-2">
              {authMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{method}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              You can sign in using any of these methods
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || !hasProfileChanges}
            className={hasProfileChanges ? 'bg-primary' : ''}
          >
            {loading ? 'Updating...' : hasProfileChanges ? 'Save Changes' : 'No Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
