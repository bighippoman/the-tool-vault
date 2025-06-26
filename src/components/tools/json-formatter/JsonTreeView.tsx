'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface JsonTreeViewProps {
  data: unknown;
}

const JsonTreeView = ({ data }: JsonTreeViewProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (currentPath: string) => {
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(currentPath)) {
      newCollapsed.delete(currentPath);
    } else {
      newCollapsed.add(currentPath);
    }
    setCollapsed(newCollapsed);
  };

  const copyPath = (jsonPath: string) => {
    navigator.clipboard.writeText(jsonPath);
    toast.success(`Path copied: ${jsonPath}`);
  };

  const renderValue = (value: unknown, currentPath: string, key?: string): JSX.Element => {
    const fullPath = key ? `${currentPath}.${key}` : currentPath;
    
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    
    if (typeof value === 'string') {
      return <span className="text-green-600 dark:text-green-400">&quot;{value}&quot;</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }
    
    if (Array.isArray(value)) {
      const isCollapsed = collapsed.has(fullPath);
      return (
        <div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => toggleCollapse(fullPath)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <span className="text-gray-700">[{value.length}]</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
              onClick={() => copyPath(fullPath)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          {!isCollapsed && (
            <div className="ml-4 border-l border-gray-200 pl-2">
              {value.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-gray-500 min-w-[20px]">{index}:</span>
                  {renderValue(item, `${fullPath}[${index}]`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const isCollapsed = collapsed.has(fullPath);
      return (
        <div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => toggleCollapse(fullPath)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <span className="text-gray-700">{`{${keys.length}}`}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
              onClick={() => copyPath(fullPath)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          {!isCollapsed && (
            <div className="ml-4 border-l border-gray-200 pl-2">
              {keys.map(objKey => (
                <div key={objKey} className="flex gap-2">
                  <span className="text-blue-800 font-medium">&quot;{objKey}&quot;:</span>
                  {renderValue(value[objKey], fullPath, objKey)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm">
      {renderValue(data, '$')}
    </div>
  );
};

export default JsonTreeView;
