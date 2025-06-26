'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Copy, Check, Eye, Edit, Download, Upload } from 'lucide-react';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Editor\n\nStart typing your **markdown** here!\n\n## Features\n- Live preview\n- Easy formatting\n- Export options\n\n> This is a blockquote\n\n```javascript\nconsole.log("Hello, World!");\n```');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const handleCopy = () => {
    if (!markdown) return;
    
    navigator.clipboard.writeText(markdown)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast.success('Markdown copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const handleDownload = () => {
    if (!markdown) return;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Markdown file downloaded');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
    e.target.value = '';
    toast.success(`File "${file.name}" loaded`);
  };

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (md: string) => {
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n$/gim, '<br />')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/```([^`]*)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br />');
  };

  return (
    <div className="markdown-editor-container space-y-4 sm:space-y-6">
      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <label>
            <Button variant="ghost" size="sm" asChild className="btn-mobile-friendly">
              <div>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-1">Upload</span>
                <input 
                  type="file" 
                  accept=".md,.txt" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </div>
            </Button>
          </label>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="btn-mobile-friendly">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline sm:ml-1">Download</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="btn-mobile-friendly">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline sm:ml-1">{isCopied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="text-sm">
            <Edit className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-sm">
            <Eye className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Markdown Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[400px] sm:min-h-[500px] resize-none text-sm sm:text-base font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="min-h-[400px] sm:min-h-[500px] p-4 bg-secondary/30 rounded-lg text-sm sm:text-base overflow-auto"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                style={{
                  lineHeight: '1.6',
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Markdown Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <div><code># Heading 1</code></div>
              <div><code>## Heading 2</code></div>
              <div><code>**Bold text**</code></div>
              <div><code>*Italic text*</code></div>
            </div>
            <div className="space-y-1">
              <div><code>[Link](url)</code></div>
              <div><code>![Image](url)</code></div>
              <div><code>`Code`</code></div>
              <div><code>- List item</code></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarkdownEditor;
