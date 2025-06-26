'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface JsonSearchProps {
  jsonData: unknown;
  onHighlight: (paths: string[]) => void;
}

const JsonSearch = ({ jsonData, onHighlight }: JsonSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const searchInJson = (data: unknown, term: string, currentPath: string = '$'): string[] => {
    const matches: string[] = [];
    
    if (!data || !term) return matches;
    
    if (typeof data === 'string' && data.toLowerCase().includes(term.toLowerCase())) {
      matches.push(currentPath);
    }
    
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          matches.push(...searchInJson(item, term, `${currentPath}[${index}]`));
        });
      } else {
        Object.keys(data).forEach(key => {
          if (key.toLowerCase().includes(term.toLowerCase())) {
            matches.push(`${currentPath}.${key}`);
          }
          matches.push(...searchInJson(data[key], term, `${currentPath}.${key}`));
        });
      }
    }
    
    return matches;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const searchResults = searchInJson(jsonData, term);
      setResults(searchResults);
      onHighlight(searchResults);
    } else {
      setResults([]);
      onHighlight([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    onHighlight([]);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search in JSON..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {results.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Found {results.length} match{results.length !== 1 ? 'es' : ''}
        </div>
      )}
    </div>
  );
};

export default JsonSearch;
