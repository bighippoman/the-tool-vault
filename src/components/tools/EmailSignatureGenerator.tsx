'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThemeObject {
  id: 'modern' | 'classic' | 'minimal' | 'creative';
  name: string;
  preview: string;
}

interface SignatureData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  photo: string;
  includePhoto: boolean;
  includeSocial: boolean;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  theme: 'modern' | 'classic' | 'minimal' | 'creative';
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
}

const EmailSignatureGenerator = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: 'John Smith',
    title: 'Marketing Director',
    company: 'Acme Corporation',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    website: 'www.acme.com',
    address: '123 Business St, City, State 12345',
    photo: '',
    includePhoto: false,
    includeSocial: true,
    linkedin: 'linkedin.com/in/johnsmith',
    twitter: '@johnsmith',
    facebook: 'facebook.com/johnsmith',
    instagram: '@johnsmith',
    theme: 'modern',
    fontFamily: 'Arial, sans-serif',
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff'
  });

  const [activePreview, setActivePreview] = useState<'email' | 'html' | 'outlook'>('email');
  const { toast } = useToast();

  const themes: ThemeObject[] = [
    { id: 'modern', name: 'Modern', preview: 'Clean lines with accent colors' },
    { id: 'classic', name: 'Classic', preview: 'Traditional professional layout' },
    { id: 'minimal', name: 'Minimal', preview: 'Simple and elegant design' },
    { id: 'creative', name: 'Creative', preview: 'Bold and artistic approach' }
  ];

  const fontOptions = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Verdana, sans-serif',
    'Calibri, sans-serif'
  ];

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'modern':
        return {
          containerStyle: 'border-left: 4px solid ' + signatureData.primaryColor + '; padding-left: 16px;',
          nameStyle: `color: ${signatureData.primaryColor}; font-size: 20px; font-weight: bold; margin-bottom: 4px;`,
          titleStyle: 'color: #666; font-weight: 500; margin-bottom: 12px;',
          separatorStyle: `border-top: 2px solid ${signatureData.primaryColor}; padding-top: 8px;`,
          photoStyle: 'border-radius: 8px;'
        };
      case 'classic':
        return {
          containerStyle: 'border: 1px solid #ddd; padding: 16px;',
          nameStyle: `color: ${signatureData.primaryColor}; font-size: 18px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase;`,
          titleStyle: 'color: #333; font-weight: normal; margin-bottom: 12px; font-style: italic;',
          separatorStyle: 'border-top: 1px solid #ddd; padding-top: 8px; margin-top: 8px;',
          photoStyle: 'border-radius: 4px; border: 2px solid #ddd;'
        };
      case 'minimal':
        return {
          containerStyle: 'padding: 8px;',
          nameStyle: `color: ${signatureData.primaryColor}; font-size: 16px; font-weight: 600; margin-bottom: 2px;`,
          titleStyle: 'color: #888; font-weight: 300; margin-bottom: 8px; font-size: 14px;',
          separatorStyle: 'padding-top: 4px;',
          photoStyle: 'border-radius: 50%;'
        };
      case 'creative':
        return {
          containerStyle: `background: linear-gradient(135deg, ${signatureData.backgroundColor} 0%, ${signatureData.primaryColor}20 100%); padding: 20px; border-radius: 12px;`,
          nameStyle: `color: ${signatureData.primaryColor}; font-size: 22px; font-weight: bold; margin-bottom: 6px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);`,
          titleStyle: 'color: #555; font-weight: 500; margin-bottom: 12px; font-size: 16px;',
          separatorStyle: `border-top: 3px solid ${signatureData.primaryColor}; padding-top: 12px; margin-top: 8px;`,
          photoStyle: 'border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2);'
        };
      default:
        return {
          containerStyle: '',
          nameStyle: `color: ${signatureData.primaryColor}; font-size: 18px; font-weight: bold; margin-bottom: 4px;`,
          titleStyle: 'color: #666; font-weight: 500; margin-bottom: 8px;',
          separatorStyle: `border-top: 2px solid ${signatureData.primaryColor}; padding-top: 8px;`,
          photoStyle: 'border-radius: 8px;'
        };
    }
  };

  const generateSignatureHTML = () => {
    const themeStyles = getThemeStyles(signatureData.theme);
    
    const socialLinks = signatureData.includeSocial ? `
      <div style="margin-top: 10px;">
        ${signatureData.linkedin ? `<a href="https://${signatureData.linkedin}" style="margin-right: 10px; text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/24/174/174857.png" alt="LinkedIn" style="width: 20px; height: 20px;"></a>` : ''}
        ${signatureData.twitter ? `<a href="https://twitter.com/${signatureData.twitter.replace('@', '')}" style="margin-right: 10px; text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" style="width: 20px; height: 20px;"></a>` : ''}
        ${signatureData.facebook ? `<a href="https://${signatureData.facebook}" style="margin-right: 10px; text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="width: 20px; height: 20px;"></a>` : ''}
        ${signatureData.instagram ? `<a href="https://instagram.com/${signatureData.instagram.replace('@', '')}" style="text-decoration: none;"><img src="https://cdn-icons-png.flaticon.com/24/733/733558.png" alt="Instagram" style="width: 20px; height: 20px;"></a>` : ''}
      </div>
    ` : '';

    return `
      <table cellpadding="0" cellspacing="0" style="font-family: ${signatureData.fontFamily}; font-size: 14px; color: #333; background-color: ${signatureData.backgroundColor};">
        <tr>
          ${signatureData.includePhoto && signatureData.photo ? `
            <td style="padding-right: 20px; vertical-align: top;">
              <img src="${signatureData.photo}" alt="${signatureData.name}" style="width: 80px; height: 80px; ${themeStyles.photoStyle} object-fit: cover;">
            </td>
          ` : ''}
          <td style="vertical-align: top; ${themeStyles.containerStyle}">
            <div style="${themeStyles.nameStyle}">
              ${signatureData.name}
            </div>
            <div style="${themeStyles.titleStyle}">
              ${signatureData.title}${signatureData.company ? ` | ${signatureData.company}` : ''}
            </div>
            <div style="${themeStyles.separatorStyle}">
              ${signatureData.email ? `<div style="margin-bottom: 4px;"><strong>📧</strong> <a href="mailto:${signatureData.email}" style="color: ${signatureData.primaryColor}; text-decoration: none;">${signatureData.email}</a></div>` : ''}
              ${signatureData.phone ? `<div style="margin-bottom: 4px;"><strong>📞</strong> <a href="tel:${signatureData.phone}" style="color: #333; text-decoration: none;">${signatureData.phone}</a></div>` : ''}
              ${signatureData.website ? `<div style="margin-bottom: 4px;"><strong>🌐</strong> <a href="https://${signatureData.website}" style="color: ${signatureData.primaryColor}; text-decoration: none;">${signatureData.website}</a></div>` : ''}
              ${signatureData.address ? `<div style="margin-bottom: 4px;"><strong>📍</strong> ${signatureData.address}</div>` : ''}
            </div>
            ${socialLinks}
          </td>
        </tr>
      </table>
    `;
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Email signature copied to clipboard",
    });
  };

  const downloadHTML = () => {
    const html = generateSignatureHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Email signature HTML file downloaded",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Email Signature Generator</h1>
        <p className="text-muted-foreground">Create stunning, responsive email signatures that make a lasting impression</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={signatureData.name}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={signatureData.title}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Marketing Director"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={signatureData.company}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signatureData.email}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={signatureData.phone}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={signatureData.website}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="www.company.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={signatureData.address}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Business St, City, State 12345"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-photo"
                        checked={signatureData.includePhoto}
                        onCheckedChange={(checked) => setSignatureData(prev => ({ ...prev, includePhoto: checked }))}
                      />
                      <Label htmlFor="include-photo">Include Profile Photo</Label>
                    </div>
                    {signatureData.includePhoto && (
                      <Input
                        placeholder="Photo URL (e.g., https://example.com/photo.jpg)"
                        value={signatureData.photo}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, photo: e.target.value }))}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Design Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Template Theme</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {themes.map((theme) => (
                        <Button
                          key={theme.id}
                          variant={signatureData.theme === theme.id ? "default" : "outline"}
                          className={`h-auto p-3 text-left ${
                            signatureData.theme === theme.id 
                              ? "text-white" 
                              : "text-foreground hover:text-white"
                          }`}
                          onClick={() => setSignatureData(prev => ({ ...prev, theme: theme.id }))}
                        >
                          <div>
                            <div className="font-medium">{theme.name}</div>
                            <div className={`text-xs ${
                              signatureData.theme === theme.id 
                                ? "text-white/80" 
                                : "text-muted-foreground"
                            }`}>
                              {theme.preview}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <select
                      id="font-family"
                      className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                      value={signatureData.fontFamily}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, fontFamily: e.target.value }))}
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>
                          {font.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={signatureData.primaryColor}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="h-12 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="background-color">Background Color</Label>
                      <Input
                        id="background-color"
                        type="color"
                        value={signatureData.backgroundColor}
                        onChange={(e) => setSignatureData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="h-12 mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="include-social"
                      checked={signatureData.includeSocial}
                      onCheckedChange={(checked) => setSignatureData(prev => ({ ...prev, includeSocial: checked }))}
                    />
                    <Label htmlFor="include-social">Include Social Media Icons</Label>
                  </div>

                  {signatureData.includeSocial && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={signatureData.linkedin}
                          onChange={(e) => setSignatureData(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter/X Handle</Label>
                        <Input
                          id="twitter"
                          value={signatureData.twitter}
                          onChange={(e) => setSignatureData(prev => ({ ...prev, twitter: e.target.value }))}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook Profile</Label>
                        <Input
                          id="facebook"
                          value={signatureData.facebook}
                          onChange={(e) => setSignatureData(prev => ({ ...prev, facebook: e.target.value }))}
                          placeholder="facebook.com/username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram Handle</Label>
                        <Input
                          id="instagram"
                          value={signatureData.instagram}
                          onChange={(e) => setSignatureData(prev => ({ ...prev, instagram: e.target.value }))}
                          placeholder="@username"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activePreview === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePreview('email')}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant={activePreview === 'html' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePreview('html')}
                  >
                    HTML
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activePreview === 'email' ? (
                <div 
                  className="border rounded-lg p-4 bg-white"
                  dangerouslySetInnerHTML={{ __html: generateSignatureHTML() }}
                />
              ) : (
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-auto max-h-96">
                    <code>{generateSignatureHTML()}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => copyToClipboard(generateSignatureHTML())}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy HTML
            </Button>
            <Button 
              onClick={downloadHTML}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Installation Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📧 Gmail</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Copy the HTML code above</li>
                  <li>Go to Gmail Settings → General → Signature</li>
                  <li>Paste the HTML and save</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">📮 Outlook</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Open Outlook → File → Options → Mail → Signatures</li>
                  <li>Create new signature and paste HTML</li>
                  <li>Set as default for new messages</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">📱 Mobile Setup</h4>
                <p className="text-muted-foreground">Copy the signature text (without HTML) to your mobile email app settings.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailSignatureGenerator;
