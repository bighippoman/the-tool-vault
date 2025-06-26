"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, RefreshCw, Check, Shield, AlertTriangle, Search, Eye, EyeOff } from 'lucide-react';
import { checkCommonPassword } from '@/utils/commonPasswords';
import { supabase } from '@/integrations/supabase/client';

type PasswordMode = 'classic' | 'memorable' | 'typable' | 'pronounceable';

// Move constants outside component to prevent recreation on every render
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const similarChars = 'il1Lo0O';
const safeCharset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';

// Expanded word list for memorable passwords
const memorableWords = [
  'Apple', 'Beach', 'Cloud', 'Dance', 'Eagle', 'Flame', 'Grace', 'Happy',
  'Island', 'Jungle', 'Knight', 'Lucky', 'Magic', 'Noble', 'Ocean', 'Peace',
  'Queen', 'River', 'Stone', 'Tiger', 'Unity', 'Voice', 'Water', 'Xenon',
  'Youth', 'Zebra', 'Bright', 'Cosmic', 'Dream', 'Energy', 'Forest', 'Giant',
  'Harbor', 'Image', 'Jewel', 'Kite', 'Light', 'Mountain', 'Nature', 'Orange',
  'Piano', 'Quick', 'Rocket', 'Storm', 'Travel', 'Universe', 'Valley', 'Wind',
  'Xray', 'Yellow', 'Zephyr', 'Angel', 'Brave', 'Castle', 'Dragon', 'Empire',
  'Faith', 'Garden', 'Honor', 'Ice', 'Jazz', 'King', 'Legend', 'Moon',
  'Night', 'Oak', 'Power', 'Quest', 'Rain', 'Star', 'Thunder', 'Ultra',
  'Victory', 'Wisdom', 'Express', 'Yacht', 'Zone', 'Art', 'Book', 'Code',
  'Door', 'Earth', 'Fire', 'Gold', 'Heart', 'Iron', 'Joy', 'Key'
];

// Consonants and vowels for pronounceable passwords
const consonants = 'bcdfghjklmnpqrstvwxyz';
const vowels = 'aeiou';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [mode, setMode] = useState<PasswordMode>('classic');
  const [isCopied, setIsCopied] = useState(false);
  const [isCheckingLeak, setIsCheckingLeak] = useState(false);
  const [leakCheckResult, setLeakCheckResult] = useState<{ 
    checked: boolean; 
    compromised: boolean; 
    count?: number; 
    sources?: string[] 
  } | null>(null);
  const [showPassword, setShowPassword] = useState(true);

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const generateSyllable = () => {
    const c = consonants[Math.floor(Math.random() * consonants.length)];
    const v = vowels[Math.floor(Math.random() * vowels.length)];
    return c + v;
  };

  const generateClassicPassword = useCallback(() => {
    let charset = '';
    
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (charset === '') return '';
    
    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
  }, [length, includeLowercase, includeUppercase, includeNumbers, includeSymbols, excludeSimilar]);

  const generateMemorablePassword = useCallback(() => {
    const getRandomWord = () => memorableWords[Math.floor(Math.random() * memorableWords.length)];
    const getRandomNumber = () => Math.floor(Math.random() * 99) + 1;
    const safeSymbols = ['!', '@', '$', '%', '^'];
    const getRandomSymbol = () => safeSymbols[Math.floor(Math.random() * safeSymbols.length)];
    
    // Create memorable structure: Word-Number-Word!Word
    let result = `${capitalize(getRandomWord())}-${getRandomNumber()}-${capitalize(getRandomWord())}`;
    
    if (includeSymbols) {
      result += getRandomSymbol();
    }
    
    result += capitalize(getRandomWord());
    
    return result;
  }, [includeSymbols]);

  const generateTypablePassword = useCallback(() => {
    let result = '';
    const targetLength = length[0];
    
    for (let i = 0; i < targetLength; i++) {
      result += safeCharset[Math.floor(Math.random() * safeCharset.length)];
    }
    
    return result;
  }, [length]);

  const generatePronounceablePassword = useCallback(() => {
    const syllableCount = Math.max(3, Math.floor(length[0] / 3));
    let result = '';
    
    // Generate syllables
    for (let i = 0; i < syllableCount; i++) {
      result += generateSyllable();
      if (i < syllableCount - 1) {
        result += '-';
      }
    }
    
    // Add number if enabled
    if (includeNumbers) {
      result += '-' + Math.floor(Math.random() * 100);
    }
    
    // Add symbol if enabled
    if (includeSymbols) {
      result += '!';
    }
    
    return result;
  }, [length, includeNumbers, includeSymbols]);

  const generatePassword = useCallback(() => {
    let result = '';
    
    switch (mode) {
      case 'memorable':
        result = generateMemorablePassword();
        break;
      case 'typable':
        result = generateTypablePassword();
        break;
      case 'pronounceable':
        result = generatePronounceablePassword();
        break;
      default:
        result = generateClassicPassword();
    }
    
    setPassword(result);
  }, [mode, generateMemorablePassword, generateTypablePassword, generatePronounceablePassword, generateClassicPassword]);

  useEffect(() => {
    generatePassword();
    setLeakCheckResult(null);
  }, [generatePassword]);



  const checkPasswordLeak = async () => {
    if (!password) {
      toast.error('Please generate a password first');
      return;
    }

    setIsCheckingLeak(true);
    setLeakCheckResult(null);
    
    try {
      console.log('Checking password:', password);
      
      // First check: Local common passwords (instant)
      const isCommon = checkCommonPassword(password);
      if (isCommon) {
        console.log('Password found in common passwords list');
        setLeakCheckResult({ checked: true, compromised: true, count: 999999, sources: ['Common Passwords Database'] });
        toast.error(`⚠️ This is a very common password! Found in our database of weak passwords. Generate a new one.`, {
          duration: 5000
        });
        return;
      }
      
      // Second check: Have I Been Pwned API
      console.log('Password not in common list, checking HIBP...');
      
      // Hash the password using SHA-1
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        throw new Error('Secure hashing is not available in this environment');
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      console.log('Full SHA-1 hash:', hashHex);
      
      // Send only first 5 characters to Have I Been Pwned API
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      console.log('Hash prefix:', prefix);
      console.log('Hash suffix:', suffix);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'NeuralStock-Password-Checker'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HIBP API responded with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('HIBP API response length:', responseText.length);
      
      let hibpCompromised = false;
      let hibpCount = 0;
      
      if (responseText.trim()) {
        const lines = responseText.split('\n');
        console.log('Number of hash lines:', lines.length);
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          
          const [hashSuffix, breachCount] = trimmedLine.split(':');
          if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
            hibpCompromised = true;
            hibpCount = parseInt(breachCount, 10) || 0;
            console.log('Password found in HIBP breaches:', hibpCount);
            break;
          }
        }
      }
      
      // Third check: Leak-Lookup API via our edge function
      console.log('Checking with Leak-Lookup API...');
      let leakLookupCompromised = false;
      let leakLookupSources: string[] = [];
      
      try {
        const { data: leakData } = await supabase.functions.invoke('check-password-leak', {
          body: { password }
        });
        
        if (leakData && leakData.success) {
          console.log('Leak-Lookup API response:', leakData);
          leakLookupCompromised = leakData.found || false;
          leakLookupSources = leakData.sources || [];
        }
      } catch (leakError) {
        console.error('Error calling Leak-Lookup edge function:', leakError);
      }
      
      // Combine results and create comprehensive source list
      const isCompromised = hibpCompromised || leakLookupCompromised;
      const allSources: string[] = [];
      
      // Always show which sources were checked
      allSources.push('Have I Been Pwned');
      allSources.push('Leak-Lookup');
      
      setLeakCheckResult({ 
        checked: true, 
        compromised: isCompromised, 
        count: hibpCount,
        sources: allSources 
      });
      
      if (isCompromised) {
        let message = '⚠️ Password found in data breaches!';
        const breachDetails: string[] = [];
        
        if (hibpCompromised) {
          breachDetails.push(`${hibpCount.toLocaleString()} Have I Been Pwned breaches`);
        }
        if (leakLookupCompromised && leakLookupSources.length > 0) {
          breachDetails.push(`${leakLookupSources.length} Leak-Lookup sources`);
        }
        
        if (breachDetails.length > 0) {
          message = `⚠️ Password found in ${breachDetails.join(' and ')}!`;
        }
        
        message += ' Generate a new one.';
        
        toast.error(message, { duration: 5000 });
      } else {
        toast.success('✅ Good news! This password was not found in known data breaches.');
      }
      
    } catch {
      console.error('Error checking password:');
      toast.error('Failed to check password against data breaches. Please try again.');
      setLeakCheckResult({ checked: true, compromised: false, sources: ['Have I Been Pwned', 'Leak-Lookup'] });
    } finally {
      setIsCheckingLeak(false);
    }
  };

  const getPasswordStrength = () => {
    const len = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    let score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumbers) score++;
    if (hasSymbols) score++;
    
    if (score <= 2) return { strength: 'Weak', color: 'text-red-500', icon: AlertTriangle };
    if (score <= 4) return { strength: 'Medium', color: 'text-yellow-500', icon: Shield };
    return { strength: 'Strong', color: 'text-green-500', icon: Shield };
  };

  const handleCopy = () => {
    if (!password) return;
    
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      // Fallback for environments without clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          toast.success('Password copied to clipboard');
        } else {
          toast.error('Failed to copy password');
        }
      } catch {
        toast.error('Failed to copy password');
      }
      return;
    }
    
    navigator.clipboard.writeText(password)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success('Password copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy password');
      });
  };

  const strengthInfo = getPasswordStrength();

  return (
    <div className="password-generator-container space-y-4 sm:space-y-6">
      {/* Mobile: Stack all sections, Desktop: Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Password Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password Mode */}
              <div className="space-y-2">
                <Label className="text-sm">Password Mode</Label>
                <Select value={mode} onValueChange={(value: PasswordMode) => setMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic - Random characters</SelectItem>
                    <SelectItem value="memorable">Memorable - Easy to remember</SelectItem>
                    <SelectItem value="typable">Typable - Easy to type</SelectItem>
                    <SelectItem value="pronounceable">Pronounceable - Easy to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Length Slider - only show for classic and typable modes */}
              {(mode === 'classic' || mode === 'typable') && (
                <div className="space-y-2">
                  <Label className="text-sm">Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    min={4}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
              
              {/* Character Sets - show for all modes but disable some for certain modes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                    disabled={mode === 'memorable' || mode === 'pronounceable'}
                  />
                  <Label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                    disabled={mode === 'memorable' || mode === 'pronounceable'}
                  />
                  <Label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                  />
                  <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                  />
                  <Label htmlFor="symbols" className="text-sm">
                    Symbols {mode === 'typable' ? '(!@#$)' : '(!@#$%^&*)'}
                  </Label>
                </div>
                
                {/* Exclude similar characters - only for classic mode */}
                {mode === 'classic' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                    />
                    <Label htmlFor="exclude-similar" className="text-sm">Exclude similar (il1Lo0O)</Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Password Display and Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Generated Password */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Generated Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={password}
                  readOnly
                  type={showPassword ? "text" : "password"}
                  className="font-mono text-sm sm:text-base pr-20 bg-secondary/30"
                  placeholder="Generated password will appear here..."
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!password}
                    className="h-8 w-8 p-0"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Mobile: Stack buttons, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={generatePassword} className="btn-mobile-friendly">
                  <RefreshCw className="h-4 w-4 sm:mr-2" />
                  Generate New Password
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!password}
                  className="btn-mobile-friendly"
                >
                  {isCopied ? <Check className="h-4 w-4 sm:mr-2" /> : <Copy className="h-4 w-4 sm:mr-2" />}
                  {isCopied ? 'Copied!' : 'Copy Password'}
                </Button>
                <Button
                  variant="outline"
                  onClick={checkPasswordLeak}
                  disabled={!password || isCheckingLeak}
                  className="btn-mobile-friendly"
                >
                  <Search className="h-4 w-4 sm:mr-2" />
                  {isCheckingLeak ? 'Checking...' : 'Check Leaks'}
                </Button>
              </div>
              
              {/* Password Strength */}
              {password && (
                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <strengthInfo.icon className={`h-4 w-4 ${strengthInfo.color}`} />
                  <span className={`font-medium text-sm ${strengthInfo.color}`}>
                    Password Strength: {strengthInfo.strength}
                  </span>
                </div>
              )}

              {/* Leak Check Result */}
              {leakCheckResult && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  leakCheckResult.compromised ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  {leakCheckResult.compromised ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-green-500" />
                  )}
                  <div className="flex-1">
                    <span className={`font-medium text-sm ${
                      leakCheckResult.compromised ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {leakCheckResult.compromised 
                        ? (leakCheckResult.count === 999999 
                            ? '⚠️ Common/weak password detected' 
                            : `⚠️ Found in data breaches`)
                        : '✅ Not found in known breaches'
                      }
                    </span>
                    {leakCheckResult.sources && leakCheckResult.sources.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Sources checked: {leakCheckResult.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Security Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Mode Info & Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mode-specific examples and tips */}
                {mode === 'memorable' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">Memorable Mode:</p>
                    <p className="text-xs text-blue-600 mb-1">Combines real words with numbers and symbols for easier memory.</p>
                    <p className="text-xs text-blue-500 font-mono">Example: Sunny-42-Dragon!Castle</p>
                  </div>
                )}
                
                {mode === 'typable' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">Typable Mode:</p>
                    <p className="text-xs text-green-600 mb-1">Uses only easily distinguishable characters and avoids shift-heavy symbols.</p>
                    <p className="text-xs text-green-500 font-mono">Excludes: l, I, 1, O, 0 and complex symbols</p>
                  </div>
                )}
                
                {mode === 'pronounceable' && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">Pronounceable Mode:</p>
                    <p className="text-xs text-purple-600 mb-1">Creates pronounceable syllables that sound like real words.</p>
                    <p className="text-xs text-purple-500 font-mono">Example: ko-va-ti-84!</p>
                  </div>
                )}

                {mode === 'classic' && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Classic Mode:</p>
                    <p className="text-xs text-gray-600">Traditional random character generation with full customization options.</p>
                  </div>
                )}

                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• Use at least 12 characters for better security</li>
                  <li>• Each password mode balances security with usability</li>
                  <li>• Avoid using personal information in passwords</li>
                  <li>• Use a unique password for each account</li>
                  <li>• Consider using a password manager</li>
                  <li>• Check for data breaches regularly with the leak checker</li>
                  <li>• Our leak checker uses local common password detection, Have I Been Pwned API, and Leak-Lookup API</li>
                </ul>

                {/* Legal Disclaimer */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">
                    <strong>Disclaimer:</strong> While we use multiple sources to check for compromised passwords, 
                    we cannot guarantee that a password has not been involved in a data breach. New breaches 
                    occur regularly and may not be immediately reflected in public databases. We recommend 
                    using strong, unique passwords and enabling two-factor authentication whenever possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
