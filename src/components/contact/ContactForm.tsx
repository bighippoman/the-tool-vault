'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  // Honeypot field - should remain empty
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Input length limits
  const MAX_NAME_LENGTH = 100;
  const MAX_EMAIL_LENGTH = 254;
  const MAX_SUBJECT_LENGTH = 200;
  const MAX_MESSAGE_LENGTH = 2000;

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot.trim() !== '') {
      console.log('Honeypot triggered - potential bot submission');
      toast({
        title: "Error",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Validate input lengths
    if (formData.name.length > MAX_NAME_LENGTH) {
      toast({
        title: "Name too long",
        description: `Name must be ${MAX_NAME_LENGTH} characters or less.`,
        variant: "destructive",
      });
      return;
    }

    if (formData.email.length > MAX_EMAIL_LENGTH) {
      toast({
        title: "Email too long",
        description: `Email must be ${MAX_EMAIL_LENGTH} characters or less.`,
        variant: "destructive",
      });
      return;
    }

    if (formData.subject.length > MAX_SUBJECT_LENGTH) {
      toast({
        title: "Subject too long",
        description: `Subject must be ${MAX_SUBJECT_LENGTH} characters or less.`,
        variant: "destructive",
      });
      return;
    }

    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`,
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Handle rate limiting error
        if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
          toast({
            title: "Too many requests",
            description: "Please wait a few minutes before sending another message.",
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(error.message);
      }

      console.log('Email sent successfully:', data);
      
      toast({
        title: "Message sent successfully!",
        description: "We&apos;ll get back to you as soon as possible.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly at hello@neuralstock.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Enforce character limits
    let maxLength;
    switch (name) {
      case 'name':
        maxLength = MAX_NAME_LENGTH;
        break;
      case 'email':
        maxLength = MAX_EMAIL_LENGTH;
        break;
      case 'subject':
        maxLength = MAX_SUBJECT_LENGTH;
        break;
      case 'message':
        maxLength = MAX_MESSAGE_LENGTH;
        break;
      default:
        maxLength = Infinity;
    }
    
    if (value.length <= maxLength) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we&apos;ll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users */}
          <div style={{ display: 'none' }}>
            <label htmlFor="website">Website (do not fill)</label>
            <input
              id="website"
              name="website"
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name * 
                <span className="text-xs text-muted-foreground ml-1">
                  ({formData.name.length}/{MAX_NAME_LENGTH})
                </span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full"
                maxLength={MAX_NAME_LENGTH}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email * 
                <span className="text-xs text-muted-foreground ml-1">
                  ({formData.email.length}/{MAX_EMAIL_LENGTH})
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full"
                maxLength={MAX_EMAIL_LENGTH}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject * 
              <span className="text-xs text-muted-foreground ml-1">
                ({formData.subject.length}/{MAX_SUBJECT_LENGTH})
              </span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What can we help you with?"
              className="w-full"
              maxLength={MAX_SUBJECT_LENGTH}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">
              Message * 
              <span className="text-xs text-muted-foreground ml-1">
                ({formData.message.length}/{MAX_MESSAGE_LENGTH})
              </span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Please describe your question or feedback in detail..."
              className="w-full min-h-[120px]"
              maxLength={MAX_MESSAGE_LENGTH}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
