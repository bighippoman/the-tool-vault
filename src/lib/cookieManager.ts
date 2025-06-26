export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'functional';

export interface CookieInfo {
  name: string;
  category: CookieCategory;
  description: string;
  required: boolean;
  duration: string;
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const COOKIE_DEFINITIONS: CookieInfo[] = [
  // Essential Authentication Cookies (Supabase)
  {
    name: 'sb-access-token',
    category: 'essential',
    description: 'Supabase access token for user authentication and session management',
    required: true,
    duration: '1 hour'
  },
  {
    name: 'sb-refresh-token',
    category: 'essential',
    description: 'Supabase refresh token for maintaining login sessions',
    required: true,
    duration: '30 days'
  },
  {
    name: 'sb-auth-token',
    category: 'essential',
    description: 'Supabase authentication token for secure API access',
    required: true,
    duration: 'Session'
  },
  // Essential Application Cookies
  {
    name: 'app_session',
    category: 'essential',
    description: 'Maintains your login session and authentication state',
    required: true,
    duration: 'Session'
  },
  {
    name: 'app_csrf',
    category: 'essential',
    description: 'Protects against cross-site request forgery attacks',
    required: true,
    duration: '24 hours'
  },
  {
    name: 'app_preferences',
    category: 'essential',
    description: 'Stores your cookie preferences and site settings',
    required: true,
    duration: '1 year'
  },
  // Functional Cookies
  {
    name: 'app_tool_settings',
    category: 'functional',
    description: 'Remembers your AI tool preferences and saved work',
    required: false,
    duration: '6 months'
  },
  {
    name: 'app_theme',
    category: 'functional',
    description: 'Remembers your theme preference (light/dark mode)',
    required: false,
    duration: '1 year'
  },
  {
    name: 'app_language',
    category: 'functional',
    description: 'Stores your preferred language setting',
    required: false,
    duration: '1 year'
  },
  // Analytics Cookies
  {
    name: 'app_analytics',
    category: 'analytics',
    description: 'Tracks page views and user interactions to improve our AI tools',
    required: false,
    duration: '2 years'
  },
  {
    name: 'app_user_behavior',
    category: 'analytics',
    description: 'Analyzes how you use our AI tools to enhance performance',
    required: false,
    duration: '1 year'
  },
  {
    name: '_ga',
    category: 'analytics',
    description: 'Google Analytics cookie for tracking website usage',
    required: false,
    duration: '2 years'
  },
  {
    name: '_ga_*',
    category: 'analytics',
    description: 'Google Analytics property-specific cookies',
    required: false,
    duration: '2 years'
  },
  // Marketing Cookies
  {
    name: 'app_social',
    category: 'marketing',
    description: 'Enables social media sharing and tracking',
    required: false,
    duration: '30 days'
  },
  {
    name: 'app_marketing',
    category: 'marketing',
    description: 'Used for personalized marketing and retargeting',
    required: false,
    duration: '90 days'
  },
  {
    name: '_fbp',
    category: 'marketing',
    description: 'Facebook Pixel cookie for advertising and analytics',
    required: false,
    duration: '90 days'
  }
];

export class CookieManager {
  private static CONSENT_COOKIE = 'app_consent';
  private static PREFERENCES_COOKIE = 'app_cookie_prefs';
  private static localStorage_fallback = typeof window !== 'undefined' && window.localStorage;

  // Fallback to localStorage in development environments where cookies might not work
  private static setFallbackStorage(key: string, value: string): void {
    if (this.localStorage_fallback) {
      try {
        localStorage.setItem(`cookie_fallback_${key}`, value);
        console.log('Set localStorage fallback for:', key, '=', value);
      } catch (e) {
        console.error('localStorage fallback failed:', e);
      }
    }
  }

  private static getFallbackStorage(key: string): string | null {
    if (this.localStorage_fallback) {
      try {
        const value = localStorage.getItem(`cookie_fallback_${key}`);
        console.log('Retrieved localStorage fallback for:', key, '=', value);
        return value;
      } catch (e) {
        console.error('localStorage fallback retrieval failed:', e);
        return null;
      }
    }
    return null;
  }

  static setCookie(name: string, value: string, days: number = 365): void {
    try {
      if (typeof document === 'undefined') {
        console.log('Document not available, using fallback storage');
        this.setFallbackStorage(name, value);
        return;
      }

      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      
      // Try multiple cookie formats for maximum compatibility
      const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      document.cookie = cookieString;
      
      console.log('Setting cookie:', name, '=', value);
      console.log('Cookie string:', cookieString);
      console.log('Document.cookie after setting:', document.cookie);
      
      // Also set fallback storage
      this.setFallbackStorage(name, value);
      
      // Immediate verification with slight delay to account for browser processing
      setTimeout(() => {
        const verification = this.getCookie(name);
        console.log('Delayed cookie verification for', name, ':', verification);
        if (!verification) {
          console.warn('Cookie verification failed, relying on localStorage fallback');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error setting cookie:', name, error);
      // Fallback to localStorage
      this.setFallbackStorage(name, value);
    }
  }

  static getCookie(name: string): string | null {
    try {
      if (typeof document === 'undefined') {
        console.log('Document not available (SSR), checking fallback storage');
        return this.getFallbackStorage(name);
      }
      
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      console.log('All cookies when looking for', name, ':', document.cookie);
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length, c.length);
          console.log('Found cookie:', name, '=', value);
          return value;
        }
      }
      
      console.log('Cookie not found in document.cookie, checking fallback storage for:', name);
      const fallbackValue = this.getFallbackStorage(name);
      if (fallbackValue) {
        console.log('Found fallback value for:', name, '=', fallbackValue);
        return fallbackValue;
      }
      
      console.log('Cookie not found anywhere:', name);
      return null;
    } catch (error) {
      console.error('Error getting cookie:', name, error);
      return this.getFallbackStorage(name);
    }
  }

  static deleteCookie(name: string): void {
    try {
      if (typeof document !== 'undefined') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        console.log('Deleted cookie:', name);
      }
      
      // Also remove from fallback storage
      if (this.localStorage_fallback) {
        localStorage.removeItem(`cookie_fallback_${name}`);
        console.log('Removed localStorage fallback for:', name);
      }
    } catch (error) {
      console.error('Error deleting cookie:', name, error);
    }
  }

  static hasConsent(): boolean {
    const consentValue = this.getCookie(this.CONSENT_COOKIE);
    console.log('Checking consent - cookie value:', consentValue);
    const hasConsent = consentValue === 'true';
    console.log('Has consent:', hasConsent);
    return hasConsent;
  }

  static setConsent(consent: boolean): void {
    console.log('Setting consent to:', consent);
    this.setCookie(this.CONSENT_COOKIE, consent.toString(), 365);
  }

  static getPreferences(): CookiePreferences {
    const prefs = this.getCookie(this.PREFERENCES_COOKIE);
    console.log('Getting preferences, raw cookie:', prefs);
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        console.log('Parsed preferences:', parsed);
        return parsed;
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
      }
    }
    const defaultPrefs = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    console.log('Using default preferences:', defaultPrefs);
    return defaultPrefs;
  }

  static setPreferences(preferences: CookiePreferences): void {
    console.log('Setting preferences:', preferences);
    this.setCookie(this.PREFERENCES_COOKIE, JSON.stringify(preferences), 365);
    this.applyCookiePreferences(preferences);
  }

  static applyCookiePreferences(preferences: CookiePreferences): void {
    console.log('Applying cookie preferences:', preferences);
    
    // Remove cookies for disabled categories
    COOKIE_DEFINITIONS.forEach(cookie => {
      if (!cookie.required && !preferences[cookie.category]) {
        this.deleteCookie(cookie.name);
      }
    });

    // Set essential cookies that are always needed
    if (preferences.essential) {
      this.setCookie('app_csrf', 'csrf_token_' + Date.now(), 1);
    }

    // Set functional cookies if allowed
    if (preferences.functional) {
      const theme = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) || 'light';
      this.setCookie('app_theme', theme, 365);
    }

    // Set analytics cookies if allowed
    if (preferences.analytics) {
      this.setCookie('app_analytics', 'analytics_' + Date.now(), 730);
      this.setCookie('app_user_behavior', 'behavior_' + Date.now(), 365);
    }

    // Set marketing cookies if allowed
    if (preferences.marketing) {
      this.setCookie('app_social', 'social_' + Date.now(), 30);
      this.setCookie('app_marketing', 'marketing_' + Date.now(), 90);
    }
  }

  static getActiveCookies(): CookieInfo[] {
    const preferences = this.getPreferences();
    return COOKIE_DEFINITIONS.filter(cookie => {
      return cookie.required || preferences[cookie.category];
    });
  }
}
