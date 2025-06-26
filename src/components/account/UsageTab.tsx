
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface UsageTabProps {
  user: User;
}

const UsageTab = ({ user }: UsageTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>
          View your tool usage and activity history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Account Created</h3>
              <p className="text-2xl font-bold text-primary">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Last Sign In</h3>
              <p className="text-2xl font-bold text-primary">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Email Verified</h3>
              <p className="text-2xl font-bold text-primary">
                {user.email_confirmed_at ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Detailed usage analytics are coming soon. This will include tool usage counts, generated content history, and more.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageTab;
