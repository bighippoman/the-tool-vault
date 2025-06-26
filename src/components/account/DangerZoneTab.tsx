'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface DangerZoneTabProps {
  user: User;
  signOut: () => void;
}

const DangerZoneTab = ({ user, signOut }: DangerZoneTabProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const isOAuthUser = user?.app_metadata?.provider && user.app_metadata.provider !== 'email';
  const oauthProvider = user?.app_metadata?.provider;

  // Get OAuth provider revoke URL
  const getOAuthRevokeUrl = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'github':
        return 'https://github.com/settings/applications';
      case 'google':
        return 'https://myaccount.google.com/permissions';
      case 'discord':
        return 'https://discord.com/settings/authorized-apps';
      case 'twitter':
        return 'https://twitter.com/settings/connected_apps';
      default:
        return null;
    }
  };

  const revokeUrl = oauthProvider ? getOAuthRevokeUrl(oauthProvider) : null;

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }

    setDeleteLoading(true);

    try {
      console.log('Starting account deletion process...');
      
      // Check if this is an OAuth user before deletion
      const isOAuthUser = user?.app_metadata?.provider && user.app_metadata.provider !== 'email';
      const oauthProvider = user?.app_metadata?.provider;
      
      console.log('User auth info:', {
        isOAuthUser,
        provider: oauthProvider,
        metadata: user?.app_metadata
      });

      // Call the edge function to delete the account
      const { data, error } = await supabase.functions.invoke('delete-user-account');

      console.log('Delete function response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Failed to delete account');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to delete account');
      }

      // Show success message first
      toast.success('Account successfully deleted!');
      
      // Show OAuth-specific guidance if needed
      if (data.isOAuthUser && data.additionalSteps) {
        console.log('Showing OAuth guidance:', data.additionalSteps);
        
        // Show the guidance immediately after success
        setTimeout(() => {
          toast.info(`⚠️ Important: ${data.additionalSteps.message}`, {
            duration: 15000, // Show for 15 seconds
            action: {
              label: 'Got it',
              onClick: () => {}
            }
          });
        }, 1000);
        
        // Also show an alert dialog for better visibility
        setTimeout(() => {
          alert(`IMPORTANT: Since you signed up with ${data.oauthProvider}, you need to revoke access in your ${data.oauthProvider} account settings to prevent automatic account re-creation.\n\n${data.additionalSteps.instructions}`);
        }, 2000);
      }
      
      // Sign out and redirect after a delay
      setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('Sign out error:', signOutError);
        }
        
        // Force redirect to home page
        window.location.href = '/';
      }, isOAuthUser ? 5000 : 2000); // Longer delay for OAuth users to read the message
      
    } catch (error: unknown) {
      console.error('Account deletion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account. Please try again or contact support.';
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
      setConfirmationText('');
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible and dangerous actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Sign Out</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign out of your account on this device.
            </p>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2 text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account and remove your data from our servers.
            </p>
            
            {isOAuthUser && revokeUrl && (
              <Alert className="mb-4 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <strong className="text-amber-800">Important:</strong> Since you signed up with {oauthProvider}, you&apos;ll need to revoke app access to prevent automatic re-creation.
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(revokeUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open {oauthProvider} Settings
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account Permanently</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Permanently Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will PERMANENTLY DELETE your entire account including:
                    <br />
                    <br />
                    • Your profile and authentication
                    <br />
                    • All saved work and tool usage history
                    <br />
                    • Generated images and content
                    <br />
                    • Newsletter subscription
                    <br />
                    <br />
                    <strong>This action cannot be undone. You will not be able to log back in with this account.</strong>
                    {isOAuthUser && (
                      <>
                        <br />
                        <br />
                        <strong className="text-amber-700">
                          ⚠️ IMPORTANT: Since you signed up with {oauthProvider}, you must also revoke access in your {oauthProvider} account settings to prevent the account from being automatically re-created when you next sign in.
                        </strong>
                        {revokeUrl && (
                          <div className="mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => window.open(revokeUrl, '_blank')}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open {oauthProvider} Settings Now
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    <br />
                    <br />
                    To confirm, please type <strong>DELETE</strong> in the field below:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmationText('')}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={confirmationText !== 'DELETE' || deleteLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteLoading ? 'Deleting Account...' : 'Permanently Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneTab;
