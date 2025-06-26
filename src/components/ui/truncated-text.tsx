import React from 'react';
import { cn } from '@/lib/utils';

interface TruncatedTextProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

/**
 * TruncatedText component for handling long text with ellipsis and optional tooltip
 * 
 * @param children - The text content to display
 * @param className - Additional CSS classes
 * @param maxWidth - Maximum width before truncation (default: 'max-w-[200px]')
 * @param showTooltip - Whether to show full text on hover (default: true)
 * @param tooltipText - Custom tooltip text (defaults to children content)
 */
export function TruncatedText({ 
  children, 
  className, 
  maxWidth = 'max-w-[200px]',
  showTooltip = true,
  tooltipText
}: TruncatedTextProps) {
  const textContent = typeof children === 'string' ? children : tooltipText || '';
  
  return (
    <span 
      className={cn('truncate', maxWidth, className)}
      title={showTooltip ? textContent : undefined}
    >
      {children}
    </span>
  );
}

// Predefined variants for common use cases
export function TruncatedEmail({ email, className }: { email: string; className?: string }) {
  return (
    <TruncatedText 
      className={cn('text-sm', className)} 
      maxWidth="max-w-[200px]"
      tooltipText={email}
    >
      {email}
    </TruncatedText>
  );
}

export function TruncatedUsername({ username, className }: { username: string; className?: string }) {
  return (
    <TruncatedText 
      className={cn('font-medium', className)} 
      maxWidth="max-w-[150px]"
      tooltipText={username}
    >
      {username}
    </TruncatedText>
  );
}

export function TruncatedTitle({ title, className }: { title: string; className?: string }) {
  return (
    <TruncatedText 
      className={cn('font-semibold', className)} 
      maxWidth="max-w-[250px]"
      tooltipText={title}
    >
      {title}
    </TruncatedText>
  );
}

export function TruncatedDescription({ description, className }: { description: string; className?: string }) {
  return (
    <TruncatedText 
      className={cn('text-muted-foreground text-sm', className)} 
      maxWidth="max-w-[300px]"
      tooltipText={description}
    >
      {description}
    </TruncatedText>
  );
}
