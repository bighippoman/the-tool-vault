"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function ConfirmationToastContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmed = searchParams.get('confirmed');

    if (confirmed === 'true') {
      toast.success('🎉 Welcome! Your email has been confirmed and you\'re now signed in.');
      
      // Clean up URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('confirmed');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return null; // This component doesn't render anything visible
}

export default function ConfirmationToast() {
  return (
    <Suspense fallback={null}>
      <ConfirmationToastContent />
    </Suspense>
  );
}
