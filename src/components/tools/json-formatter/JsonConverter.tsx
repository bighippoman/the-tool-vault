'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface JsonConverterProps {
  jsonData: unknown;
}

const JsonConverter = ({ jsonData }: JsonConverterProps) => {
  const [format, setFormat] = useState('csv');
  const [output, setOutput] = useState('');

  const convertToCSV = (data: unknown): string => {
    if (!Array.isArray(data)) {
      if (typeof data === 'object' && data !== null) {
        data = [data];
      } else {
        return '';
      }
    }
    
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0] as Record<string, unknown>);
    const csvHeaders = headers.join(',');
    
    const csvRows = (data as Record<string, unknown>[]).map((row: Record<string, unknown>) => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value !== null && value !== undefined ? value : '';
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const convertToXML = (data: unknown, rootName: string = 'root'): string => {
    const jsonToXml = (obj: unknown, name: string): string => {
      if (Array.isArray(obj)) {
        return obj.map((item, index) => jsonToXml(item, `${name}_${index}`)).join('');
      }
      
      if (typeof obj === 'object' && obj !== null) {
        const content = Object.keys(obj)
          .map(key => jsonToXml(obj[key], key))
          .join('');
        return `<${name}>${content}</${name}>`;
      }
      
      return `<${name}>${obj}</${name}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(data, rootName)}`;
  };

  const convertToYAML = (data: unknown, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    
    if (Array.isArray(data)) {
      return data.map(item => `${spaces}- ${convertToYAML(item, indent + 1).trim()}`).join('\n');
    }
    
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data)
        .map(key => {
          const value = data[key];
          if (typeof value === 'object' && value !== null) {
            return `${spaces}${key}:\n${convertToYAML(value, indent + 1)}`;
          }
          return `${spaces}${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
        })
        .join('\n');
    }
    
    return typeof data === 'string' ? `"${data}"` : String(data);
  };

  const handleConvert = () => {
    try {
      let converted = '';
      
      switch (format) {
        case 'csv':
          converted = convertToCSV(jsonData);
          break;
        case 'xml':
          converted = convertToXML(jsonData);
          break;
        case 'yaml':
          converted = convertToYAML(jsonData);
          break;
        default:
          converted = 'Format not supported';
      }
      
      setOutput(converted);
      toast.success(`Converted to ${format.toUpperCase()}`);
    } catch (error) {
      setOutput(`Error converting to ${format}: ${(error as Error).message}`);
      toast.error('Conversion failed');
    }
  };

  const downloadConverted = () => {
    if (!output) return;
    
    const extensions: Record<string, string> = {
      csv: 'csv',
      xml: 'xml', 
      yaml: 'yml'
    };
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extensions[format] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
            <SelectItem value="yaml">YAML</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleConvert}>Convert</Button>
        {output && (
          <Button variant="outline" onClick={downloadConverted}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </div>
      
      {output && (
        <Textarea
          value={output}
          readOnly
          className="min-h-[200px] font-mono text-sm bg-secondary/30"
        />
      )}
    </div>
  );
};

export default JsonConverter;
