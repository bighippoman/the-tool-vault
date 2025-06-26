
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Cookie, Settings, Shield, BarChart3, Megaphone, Wrench } from 'lucide-react';
import { CookieManager, CookiePreferences, COOKIE_DEFINITIONS, CookieCategory } from '@/lib/cookieManager';

const getCategoryIcon = (category: CookieCategory) => {
  switch (category) {
    case 'essential':
      return <Shield className="w-5 h-5 text-green-600" />;
    case 'analytics':
      return <BarChart3 className="w-5 h-5 text-blue-600" />;
    case 'marketing':
      return <Megaphone className="w-5 h-5 text-purple-600" />;
    case 'functional':
      return <Wrench className="w-5 h-5 text-orange-600" />;
  }
};

const getCategoryDescription = (category: CookieCategory) => {
  switch (category) {
    case 'essential':
      return 'These cookies are necessary for the website to function and cannot be switched off.';
    case 'analytics':
      return 'These cookies help us understand how visitors interact with our AI tools.';
    case 'marketing':
      return 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.';
    case 'functional':
      return 'These cookies enable enhanced functionality and personalization for our AI tools.';
  }
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    console.log('CookieConsent useEffect triggered');
    const hasConsent = CookieManager.hasConsent();
    console.log('Cookie consent check in useEffect:', hasConsent);
    
    if (hasConsent) {
      console.log('User has consent, hiding banner');
      setShowBanner(false);
      const currentPrefs = CookieManager.getPreferences();
      console.log('Loading preferences:', currentPrefs);
      setPreferences(currentPrefs);
    } else {
      console.log('User has no consent, showing banner');
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    console.log('Accept all clicked');
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    CookieManager.setConsent(true);
    CookieManager.setPreferences(allAccepted);
    setPreferences(allAccepted);
    setShowBanner(false);
    console.log('All cookies accepted, banner should be hidden');
  };

  const handleAcceptEssential = () => {
    console.log('Accept essential clicked');
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    CookieManager.setConsent(true);
    CookieManager.setPreferences(essentialOnly);
    setPreferences(essentialOnly);
    setShowBanner(false);
    console.log('Essential cookies accepted, banner should be hidden');
  };

  const handleSavePreferences = () => {
    console.log('Save preferences clicked with:', preferences);
    CookieManager.setConsent(true);
    CookieManager.setPreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
    console.log('Preferences saved:', preferences);
  };

  const updatePreference = (category: CookieCategory, value: boolean) => {
    console.log('Updating preference:', category, 'to', value);
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => {
      const newPrefs = {
        ...prev,
        [category]: value
      };
      console.log('New preferences state:', newPrefs);
      return newPrefs;
    });
  };

  const activeCookies = CookieManager.getActiveCookies();
  const cookiesByCategory = COOKIE_DEFINITIONS.reduce((acc, cookie) => {
    if (!acc[cookie.category]) acc[cookie.category] = [];
    acc[cookie.category].push(cookie);
    return acc;
  }, {} as Record<CookieCategory, typeof COOKIE_DEFINITIONS>);

  const hasConsent = CookieManager.hasConsent();

  console.log('Rendering CookieConsent - showBanner:', showBanner, 'hasConsent:', hasConsent);

  if (!isClientMounted) {
    return null;
  }

  return (
    <>
      {/* Cookie Settings Icon */}
      {hasConsent && !showBanner && (
        <button 
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 left-4 z-40 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Cookie Settings"
        >
          <Cookie className="w-5 h-5 text-blue-600" />
        </button>
      )}

      {/* Cookie Settings Dialog */}
      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cookie Settings
              </DialogTitle>
              <DialogDescription>
                Manage your cookie preferences and see which cookies are currently active on your device.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Current Settings Summary */}
              <div>
                <h4 className="font-semibold mb-3">Current Settings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(preferences).map(([category, enabled]) => (
                    <div key={category} className="text-center p-3 bg-gray-50 rounded">
                      {getCategoryIcon(category as CookieCategory)}
                      <div className="text-sm font-medium capitalize mt-2">{category}</div>
                      <Badge variant={enabled ? "default" : "secondary"} className="mt-1">
                        {enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Active Cookies ({activeCookies.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeCookies.map(cookie => (
                    <div key={cookie.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{cookie.name}</span>
                      <Badge variant="outline" className="text-xs">{cookie.duration}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cookie Categories */}
              {Object.entries(cookiesByCategory).map(([category, cookies]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category as CookieCategory)}
                      <div>
                        <h4 className="font-semibold capitalize">
                          {category} Cookies
                          {category === 'essential' && (
                            <Badge variant="secondary" className="ml-2">Required</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {getCategoryDescription(category as CookieCategory)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[category as CookieCategory]}
                      onCheckedChange={(checked) => {
                        console.log('Switch toggled for', category, 'to', checked);
                        updatePreference(category as CookieCategory, checked);
                      }}
                      disabled={category === 'essential'}
                      aria-label={`Toggle ${category} cookies`}
                    />
                  </div>
                  
                  <div className="ml-8 space-y-2 mb-4">
                    {cookies.map(cookie => (
                      <div key={cookie.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{cookie.name}</div>
                          <div className="text-xs text-gray-600">{cookie.description}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">{cookie.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSavePreferences} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Save Preferences
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    We use AI-enhanced cookies
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We use cookies to improve your experience with our AI tools, analyze usage patterns, and provide personalized features. 
                    You can choose which cookies to accept.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleAcceptAll} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Accept All
                    </Button>
                    <Button variant="outline" onClick={handleAcceptEssential}>
                      Essential Only
                    </Button>
                    <Dialog open={showSettings} onOpenChange={setShowSettings}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Customize
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Cookie Preferences
                          </DialogTitle>
                          <DialogDescription>
                            Choose which types of cookies you want to allow. Essential cookies are required for the site to function.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Active Cookies Summary */}
                          <div>
                            <h4 className="font-semibold mb-3">Currently Active Cookies ({activeCookies.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {activeCookies.map(cookie => (
                                <div key={cookie.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm font-medium">{cookie.name}</span>
                                  <Badge variant="outline" className="text-xs">{cookie.duration}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Cookie Categories */}
                          {Object.entries(cookiesByCategory).map(([category, cookies]) => (
                            <div key={category}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {getCategoryIcon(category as CookieCategory)}
                                  <div>
                                    <h4 className="font-semibold capitalize">
                                      {category} Cookies
                                      {category === 'essential' && (
                                        <Badge variant="secondary" className="ml-2">Required</Badge>
                                      )}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {getCategoryDescription(category as CookieCategory)}
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  checked={preferences[category as CookieCategory]}
                                  onCheckedChange={(checked) => {
                                    console.log('Banner switch toggled for', category, 'to', checked);
                                    updatePreference(category as CookieCategory, checked);
                                  }}
                                  disabled={category === 'essential'}
                                  aria-label={`Toggle ${category} cookies`}
                                />
                              </div>
                              
                              <div className="ml-8 space-y-2 mb-4">
                                {cookies.map(cookie => (
                                  <div key={cookie.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                      <div className="font-medium text-sm">{cookie.name}</div>
                                      <div className="text-xs text-gray-600">{cookie.description}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{cookie.duration}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          <div className="flex gap-3 pt-4">
                            <Button onClick={handleSavePreferences} className="bg-gradient-to-r from-blue-600 to-purple-600">
                              Save Preferences
                            </Button>
                            <Button variant="outline" onClick={() => setShowSettings(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
