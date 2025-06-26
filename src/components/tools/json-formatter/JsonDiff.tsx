'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

interface JsonDiffProps {
  originalJson: string;
}

interface DiffItem {
  type: 'added' | 'removed' | 'changed' | 'type_change' | 'error';
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
  message?: string;
}

const JsonDiff = ({ originalJson }: JsonDiffProps) => {
  const [compareJson, setCompareJson] = useState('');
  const [diff, setDiff] = useState<DiffItem[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const generateDiff = () => {
    try {
      const original = JSON.parse(originalJson);
      const compare = JSON.parse(compareJson);
      const differences = findDifferences(original, compare);
      setDiff(differences);
      setShowDiff(true);
    } catch {
      setDiff([{ type: 'error', path: '', message: 'Invalid JSON in one or both inputs' }]);
      setShowDiff(true);
    }
  };

  const findDifferences = (obj1: unknown, obj2: unknown, path: string = ''): DiffItem[] => {
    const diffs: DiffItem[] = [];
    
    if (typeof obj1 !== typeof obj2) {
      diffs.push({
        type: 'type_change',
        path,
        oldValue: typeof obj1,
        newValue: typeof obj2,
      });
      return diffs;
    }
    
    if (obj1 === obj2) return diffs;
    
    if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
      diffs.push({
        type: 'changed',
        path,
        oldValue: obj1,
        newValue: obj2,
      });
      return diffs;
    }
    
    const allKeys = new Set([...Object.keys(obj1 as Record<string, unknown>), ...Object.keys(obj2 as Record<string, unknown>)]);
    
    for (const key of Array.from(allKeys)) {
      const currentPath = path ? `${path}.${key}` : key;
      const obj1Record = obj1 as Record<string, unknown>;
      const obj2Record = obj2 as Record<string, unknown>;
      
      if (!(key in obj1Record)) {
        diffs.push({
          type: 'added',
          path: currentPath,
          newValue: obj2Record[key],
        });
      } else if (!(key in obj2Record)) {
        diffs.push({
          type: 'removed',
          path: currentPath,
          oldValue: obj1Record[key],
        });
      } else {
        diffs.push(...findDifferences(obj1Record[key], obj2Record[key], currentPath));
      }
    }
    
    return diffs;
  };

  const getDiffColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-600 bg-green-50';
      case 'removed': return 'text-red-600 bg-red-50';
      case 'changed': return 'text-blue-600 bg-blue-50';
      case 'type_change': return 'text-purple-600 bg-purple-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium">Compare with another JSON:</h4>
        <Textarea
          placeholder="Paste JSON to compare..."
          value={compareJson}
          onChange={(e) => setCompareJson(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
        <Button onClick={generateDiff} disabled={!compareJson.trim()}>
          <GitCompare className="h-4 w-4 mr-2" />
          Compare
        </Button>
      </div>
      
      {showDiff && (
        <div className="border rounded-lg p-4 bg-secondary/30">
          <h4 className="font-medium mb-3">Differences:</h4>
          {diff.length === 0 ? (
            <p className="text-green-600">JSONs are identical!</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {diff.map((difference, index) => (
                <div key={index} className={`p-2 rounded text-sm ${getDiffColor(difference.type)}`}>
                  <div className="font-medium">
                    {difference.type === 'added' && '+ Added'}
                    {difference.type === 'removed' && '- Removed'}
                    {difference.type === 'changed' && '~ Changed'}
                    {difference.type === 'type_change' && '⚠ Type Changed'}
                    {difference.type === 'error' && '❌ Error'}
                  </div>
                  <div className="font-mono">{difference.path}</div>
                  {difference.type === 'changed' && (
                    <div>
                      <div>From: {JSON.stringify(difference.oldValue)}</div>
                      <div>To: {JSON.stringify(difference.newValue)}</div>
                    </div>
                  )}
                  {difference.type === 'type_change' && (
                    <div>
                      <div>From: {String(difference.oldValue)}</div>
                      <div>To: {String(difference.newValue)}</div>
                    </div>
                  )}
                  {(difference.type === 'added' || difference.type === 'removed') && (
                    <div>Value: {JSON.stringify(difference.type === 'added' ? difference.newValue : difference.oldValue)}</div>
                  )}
                  {difference.type === 'error' && (
                    <div>{difference.message}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JsonDiff;
