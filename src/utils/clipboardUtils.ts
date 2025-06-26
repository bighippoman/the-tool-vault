/**
 * Utilities for safely working with clipboard in Next.js environment
 * Provides fallbacks for server-side rendering and browsers with limited support
 */
import { toast } from 'sonner';

/**
 * Copy text to clipboard with browser environment checks and fallbacks
 * @param text - The text to copy to clipboard
 * @param successMessage - Optional success message to show (defaults to "Copied to clipboard")
 * @param errorMessage - Optional error message to show (defaults to "Failed to copy to clipboard")
 * @returns Promise<boolean> - Whether the copy operation was successful
 */
export async function copyToClipboardSafe(
  text: string, 
  successMessage: string = "Copied to clipboard", 
  errorMessage: string = "Failed to copy to clipboard"
): Promise<boolean> {
  // Don't attempt to copy empty text
  if (!text) return false;
  
  try {
    // Check if we're in a browser environment with Clipboard API support
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      // Modern clipboard API
      await navigator.clipboard.writeText(text);
      if (successMessage) toast.success(successMessage);
      return true;
    }
    
    // Fallback for browsers without Clipboard API or in SSR context
    if (typeof document !== 'undefined') {
      // Create temporary textarea element for copying
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Hide the element but ensure it's in the DOM
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Select and copy
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textArea);
      
      if (successful) {
        if (successMessage) toast.success(successMessage);
        return true;
      } else {
        if (errorMessage) toast.error(errorMessage);
        return false;
      }
    }
    
    // If we get here, we're in a server environment or can't access document/navigator
    // In this case, we can't copy, but we shouldn't show an error in SSR context
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }
    return false;
  } catch {
    // Only show error toast if we're in browser environment
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }
    return false;
  }
}
