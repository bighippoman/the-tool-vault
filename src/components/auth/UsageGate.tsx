'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';

interface UsageGateProps {
  usageData: { usage?: number } | null;
}

const UsageGate: React.FC<UsageGateProps> = () => {

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <CardTitle>Usage Limit Reached</CardTitle>
        <CardDescription>
          You&apos;ve reached your usage limit for this tool. Please try again later or upgrade your plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Free Account Benefits:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Unlimited access to all tools</li>
            <li>• Save your work for later</li>
            <li>• Export and share your results</li>
            <li>• No usage limits</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth">Create Free Account</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth">Already have an account? Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageGate;
