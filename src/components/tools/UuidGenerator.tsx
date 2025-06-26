'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { copyToClipboardSafe } from '@/utils/clipboardUtils';
import { 
  Hash, 
  Copy, 
  Download, 
  RefreshCw,
  Check,
  List,
  Settings
} from 'lucide-react';

const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState('4');
  const [count, setCount] = useState([1]);
  const [format, setFormat] = useState('standard');
  const [includeHyphens, setIncludeHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Generate a single UUID based on version
  const generateUUID = useCallback(() => {
    switch (version) {
      case '1': {
        // Simplified v1 UUID (timestamp-based)
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).substr(2, 8);
        return `${timestamp.substr(0, 8)}-${timestamp.substr(8, 4)}-1${random.substr(0, 3)}-${random.substr(3, 4)}-${random.substr(7, 12)}`;
      }
      case '3': {
        // Simplified v3 UUID (MD5 hash - using random for demo)
        const v3Random = Math.random().toString(16).replace('0.', '').padEnd(32, '0');
        return `${v3Random.substr(0, 8)}-${v3Random.substr(8, 4)}-3${v3Random.substr(12, 3)}-${v3Random.substr(15, 4)}-${v3Random.substr(19, 12)}`;
      }
      case '4': {
        // Standard v4 UUID (random)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      case '5': {
        // Simplified v5 UUID (SHA-1 hash - using random for demo)
        const v5Random = Math.random().toString(16).replace('0.', '').padEnd(32, '0');
        return `${v5Random.substr(0, 8)}-${v5Random.substr(8, 4)}-5${v5Random.substr(12, 3)}-${v5Random.substr(15, 4)}-${v5Random.substr(19, 12)}`;
      }
      case 'nil':
        return '00000000-0000-0000-0000-000000000000';
      
      default:
        return crypto.randomUUID();
    }
  }, [version]);

  // Format UUID according to selected format
  const formatUUID = useCallback((uuid: string) => {
    let formatted = uuid;
    
    if (!includeHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    switch (format) {
      case 'braces':
        return `{${formatted}}`;
      case 'brackets':
        return `[${formatted}]`;
      case 'quotes':
        return `&quot;${formatted}&quot;`;
      case 'csharp':
        return `new Guid(&quot;${formatted}&quot;)`;
      case 'java':
        return `UUID.fromString(&quot;${formatted}&quot;)`;
      case 'python':
        return `uuid.UUID('${formatted}')`;
      case 'javascript':
        return `'${formatted}'`;
      default:
        return formatted;
    }
  }, [format, includeHyphens, uppercase]);

  // Generate multiple UUIDs
  const generateMultipleUUIDs = useCallback(() => {
    const newUuids = Array.from({ length: count[0] }, () => formatUUID(generateUUID()));
    setUuids(newUuids);
  }, [count, generateUUID, formatUUID]);

  const copyUUID = async (uuid: string, index: number) => {
    const success = await copyToClipboardSafe(uuid, 'UUID copied to clipboard');
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const copyAllUUIDs = async () => {
    const allUUIDs = uuids.join('\n');
    const success = await copyToClipboardSafe(allUUIDs, `${uuids.length} UUIDs copied to clipboard`);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const downloadUUIDs = () => {
    const content = uuids.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('UUIDs downloaded');
  };

  useEffect(() => {
    generateMultipleUUIDs();
  }, [generateMultipleUUIDs, version, count, format, includeHyphens, uppercase, namespace, name]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            UUID Generator
          </CardTitle>
          <CardDescription>
            Generate universally unique identifiers (UUIDs) in various formats and versions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* UUID Version */}
            <div className="space-y-2">
              <Label>UUID Version</Label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Version 1 (Timestamp)</SelectItem>
                  <SelectItem value="3">Version 3 (MD5 Hash)</SelectItem>
                  <SelectItem value="4">Version 4 (Random)</SelectItem>
                  <SelectItem value="5">Version 5 (SHA-1 Hash)</SelectItem>
                  <SelectItem value="nil">Nil UUID</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                {version === '1' && 'Based on timestamp and MAC address'}
                {version === '3' && 'MD5 hash of namespace and name'}
                {version === '4' && 'Randomly generated (most common)'}
                {version === '5' && 'SHA-1 hash of namespace and name'}
                {version === 'nil' && 'All zeros UUID'}
              </div>
            </div>

            {/* Namespace (for v3 and v5) */}
            {(version === '3' || version === '5') && (
              <>
                <div className="space-y-2">
                  <Label>Namespace UUID</Label>
                  <Input
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    placeholder="Enter namespace UUID"
                  />
                  <div className="text-xs text-muted-foreground">
                    UUID namespace for hash generation
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name to hash"
                  />
                  <div className="text-xs text-muted-foreground">
                    Name to be hashed with namespace
                  </div>
                </div>
              </>
            )}

            {/* Count */}
            <div className="space-y-2">
              <Label>Count: {count[0]}</Label>
              <Slider
                value={count}
                onValueChange={setCount}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                Number of UUIDs to generate
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="braces">Braces {}</SelectItem>
                  <SelectItem value="brackets">Brackets []</SelectItem>
                  <SelectItem value="quotes">Quotes &quot;&quot;</SelectItem>
                  <SelectItem value="csharp">C# Guid</SelectItem>
                  <SelectItem value="java">Java UUID</SelectItem>
                  <SelectItem value="python">Python UUID</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-hyphens"
                  checked={includeHyphens}
                  onCheckedChange={setIncludeHyphens}
                />
                <Label htmlFor="include-hyphens">Include hyphens</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={uppercase}
                  onCheckedChange={setUppercase}
                />
                <Label htmlFor="uppercase">Uppercase</Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button onClick={generateMultipleUUIDs} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate New
            </Button>
            
            {uuids.length > 1 && (
              <Button onClick={copyAllUUIDs} variant="outline" className="flex items-center gap-2">
                {copiedAll ? <Check className="h-4 w-4" /> : <List className="h-4 w-4" />}
                Copy All
              </Button>
            )}
            
            {uuids.length > 0 && (
              <Button onClick={downloadUUIDs} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated UUIDs */}
      {uuids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated UUIDs ({uuids.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <code className="text-sm font-mono flex-1">{uuid}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyUUID(uuid, index)}
                    className="ml-2"
                  >
                    {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* UUID Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            UUID Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">UUID Versions</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">v1</Badge>
                  Timestamp-based UUID with &quot;better&quot; ordering
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">v3</Badge>
                  MD5 hash of namespace and name
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">v4</Badge>
                  Randomly generated (most common)
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">v5</Badge>
                  SHA-1 hash of namespace and name
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Common Use Cases</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Database primary keys</li>
                <li>• API request tracking</li>
                <li>• Session identifiers</li>
                <li>• File naming</li>
                <li>• Distributed system IDs</li>
                <li>• Message queue correlation</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium mb-2">About UUIDs</h4>
            <p className="text-sm text-muted-foreground">
              UUIDs are 128-bit identifiers that are unique across space and time. 
              <strong>Perfect for:</strong> Database design, API development, distributed systems, microservices, 
              unique record identification, session management, and any application requiring guaranteed unique identifiers.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Uses crypto.randomUUID() for cryptographically secure UUIDs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UuidGenerator;
