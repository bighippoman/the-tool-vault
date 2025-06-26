"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert subscription into database
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        // Handle duplicate email error specifically
        if (error.code === '23505' && error.message.includes('email')) {
          toast.error('This email is already subscribed to our newsletter!');
        } else {
          console.error('Subscription error:', error);
          toast.error('Failed to subscribe. Please try again.');
        }
      } else {
        toast.success('Thank you for subscribing!', {
          description: 'You\'ll now receive updates about new tools and features.',
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
          <p className="mt-4 text-primary-foreground/90">
            Subscribe to our newsletter to get notified about new tools, features and updates.
          </p>
          
          <form 
            onSubmit={handleSubmit} 
            className="mt-8 sm:flex sm:max-w-md sm:mx-auto"
          >
            <div className="min-w-0 flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="block w-full rounded-md border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white focus:border-white focus-visible:ring-1 focus-visible:ring-white"
              />
            </div>
            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <Button 
                type="submit"
                disabled={isSubmitting || !email.trim()}
                variant="secondary"
                className="w-full"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
          
          <p className="mt-3 text-sm text-primary-foreground/70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
