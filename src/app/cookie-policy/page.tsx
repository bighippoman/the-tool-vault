import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, BarChart3, Megaphone, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy - NeuralStock.ai',
  description: 'Learn about how NeuralStock.ai uses cookies and how to manage your cookie preferences.',
};

export default function CookiePolicyPage() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'essential':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'analytics':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'marketing':
        return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'functional':
        return <Wrench className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'analytics':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'marketing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'functional':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl">
            Effective Date: June 22, 2025
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What Are Cookies?
          </h2>
          <p>
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How We Use Cookies
          </h2>
          <p>We use cookies for several purposes:</p>
          
          <div className="grid gap-6 mt-8 not-prose">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getCategoryIcon('essential')}
                <h3 className="text-xl font-semibold">Essential Cookies</h3>
                <Badge className={getCategoryColor('essential')}>Required</Badge>
              </div>
              <p className="text-gray-800">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-800">
                <li><strong>sb-access-token:</strong> Supabase access token for user authentication (1 hour)</li>
                <li><strong>sb-refresh-token:</strong> Supabase refresh token for maintaining login sessions (30 days)</li>
                <li><strong>sb-auth-token:</strong> Supabase authentication token for secure API access (Session)</li>
                <li><strong>app_session:</strong> Maintains your login session and authentication state (Session)</li>
                <li><strong>app_csrf:</strong> Protects against cross-site request forgery attacks (24 hours)</li>
                <li><strong>app_preferences:</strong> Stores your cookie preferences and site settings (1 year)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getCategoryIcon('analytics')}
                <h3 className="text-xl font-semibold">Analytics Cookies</h3>
                <Badge className={getCategoryColor('analytics')}>Optional</Badge>
              </div>
              <p className="text-gray-800">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-800">
                <li><strong>app_analytics:</strong> Tracks page views and user interactions to improve our AI tools (2 years)</li>
                <li><strong>app_user_behavior:</strong> Analyzes how you use our AI tools to enhance performance (1 year)</li>
                <li><strong>_ga:</strong> Google Analytics cookie for tracking website usage (2 years)</li>
                <li><strong>_ga_*:</strong> Google Analytics property-specific cookies (2 years)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getCategoryIcon('functional')}
                <h3 className="text-xl font-semibold">Functional Cookies</h3>
                <Badge className={getCategoryColor('functional')}>Optional</Badge>
              </div>
              <p className="text-gray-800">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-800">
                <li><strong>app_tool_settings:</strong> Remembers your AI tool preferences and saved work (6 months)</li>
                <li><strong>app_theme:</strong> Remembers your theme preference (light/dark mode) (1 year)</li>
                <li><strong>app_language:</strong> Stores your preferred language setting (1 year)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {getCategoryIcon('marketing')}
                <h3 className="text-xl font-semibold">Marketing Cookies</h3>
                <Badge className={getCategoryColor('marketing')}>Optional</Badge>
              </div>
              <p className="text-gray-800">
                These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-800">
                <li><strong>app_social:</strong> Enables social media sharing and tracking (30 days)</li>
                <li><strong>app_marketing:</strong> Used for personalized marketing and retargeting (90 days)</li>
                <li><strong>_fbp:</strong> Facebook Pixel cookie for advertising and analytics (90 days)</li>
              </ul>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Managing Your Cookie Preferences
          </h2>
          <p>
            You can control and manage cookies in several ways:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Cookie Banner:</strong> When you first visit our site, you can choose which types of cookies to accept.</li>
            <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through their settings preferences.</li>
            <li><strong>Opt-out Tools:</strong> You can use various opt-out tools provided by advertising networks.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Third-Party Cookies
          </h2>
          <p>
            Some cookies on our site are set by third-party services. These may include:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Supabase:</strong> Authentication and database services (sb-access-token, sb-refresh-token, sb-auth-token)</li>
            <li><strong>Google Analytics:</strong> Website analytics and performance tracking (_ga, _ga_*)</li>
            <li><strong>Facebook Pixel:</strong> Advertising and analytics (_fbp)</li>
            <li><strong>Social media platforms:</strong> For sharing functionality and social login</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p>
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:hello@neuralstock.ai" className="text-blue-600 hover:underline font-semibold">
              hello@neuralstock.ai
            </a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Changes to This Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Effective Date&quot; above.
          </p>
          <p>We may collect information about your computer, including your IP address, operating system and browser type, for system administration and in order to create reports. This is statistical data about our users&apos; browsing actions and patterns, and does not identify any individual.</p>
        </div>
      </div>
    </div>
  );
}
