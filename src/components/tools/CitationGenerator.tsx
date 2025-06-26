'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Plus, Trash2, Link, BookOpen, FileText, Globe, Video } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Citation {
  id: string;
  type: 'book' | 'journal' | 'website' | 'video' | 'other';
  format: 'apa' | 'mla' | 'chicago' | 'harvard';
  data: {
    authors?: string[];
    title?: string;
    journal?: string;
    publisher?: string;
    year?: string;
    pages?: string;
    url?: string;
    accessDate?: string;
    doi?: string;
    volume?: string;
    issue?: string;
    edition?: string;
    location?: string;
  };
  formatted?: string;
  formattedHtml?: string;
}

const CitationGenerator = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [currentCitation, setCurrentCitation] = useState<Partial<Citation>>({
    type: 'book',
    format: 'apa',
    data: {}
  });
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatAuthors = (authors: string[], format: string): string => {
    if (!authors || authors.length === 0) return '';
    
    const cleanAuthors = authors.filter(author => author.trim());
    if (cleanAuthors.length === 0) return '';

    switch (format) {
      case 'apa': {
        if (cleanAuthors.length === 1) {
          const nameParts = cleanAuthors[0].split(' ');
          const lastName = nameParts[nameParts.length - 1];
          const firstInitials = nameParts.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ');
          return `${lastName}, ${firstInitials}`;
        } else if (cleanAuthors.length === 2) {
          const author1 = cleanAuthors[0].split(' ');
          const lastName1 = author1[author1.length - 1];
          const firstInitials1 = author1.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ');
          
          const author2 = cleanAuthors[1].split(' ');
          const lastName2 = author2[author2.length - 1];
          const firstInitials2 = author2.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ');
          
          return `${lastName1}, ${firstInitials1}, & ${lastName2}, ${firstInitials2}`;
        } else if (cleanAuthors.length <= 20) {
          const formattedAuthors = cleanAuthors.map(author => {
            const nameParts = author.split(' ');
            const lastName = nameParts[nameParts.length - 1];
            const firstInitials = nameParts.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ');
            return `${lastName}, ${firstInitials}`;
          });
          const lastAuthor = formattedAuthors.pop();
          return `${formattedAuthors.join(', ')}, & ${lastAuthor}`;
        } else {
          const first19 = cleanAuthors.slice(0, 19).map(author => {
            const nameParts = author.split(' ');
            const lastName = nameParts[nameParts.length - 1];
            const firstInitials = nameParts.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ');
            return `${lastName}, ${firstInitials}`;
          });
          const lastAuthor = cleanAuthors[cleanAuthors.length - 1].split(' ');
          const lastAuthorFormatted = `${lastAuthor[lastAuthor.length - 1]}, ${lastAuthor.slice(0, -1).map(name => name.charAt(0).toUpperCase() + '.').join(' ')}`;
          return `${first19.join(', ')}, ... ${lastAuthorFormatted}`;
        }
      } 
      case 'mla': {
        if (cleanAuthors.length === 1) {
          const nameParts = cleanAuthors[0].split(' ');
          if (nameParts.length >= 2) {
            const lastName = nameParts[nameParts.length - 1];
            const firstName = nameParts.slice(0, -1).join(' ');
            return `${lastName}, ${firstName}`;
          }
          return cleanAuthors[0];
        } else if (cleanAuthors.length === 2) {
          const nameParts1 = cleanAuthors[0].split(' ');
          const lastName1 = nameParts1[nameParts1.length - 1];
          const firstName1 = nameParts1.slice(0, -1).join(' ');
          return `${lastName1}, ${firstName1}, and ${cleanAuthors[1]}`;
        } else {
          const nameParts1 = cleanAuthors[0].split(' ');
          const lastName1 = nameParts1[nameParts1.length - 1];
          const firstName1 = nameParts1.slice(0, -1).join(' ');
          return `${lastName1}, ${firstName1}, et al.`;
        }
      } 
      case 'chicago': {
        if (cleanAuthors.length === 1) {
          return cleanAuthors[0];
        } else if (cleanAuthors.length === 2) {
          return `${cleanAuthors[0]} and ${cleanAuthors[1]}`;
        } else if (cleanAuthors.length === 3) {
          return `${cleanAuthors[0]}, ${cleanAuthors[1]}, and ${cleanAuthors[2]}`;
        } else {
          return `${cleanAuthors[0]} et al.`;
        }
      } 
      case 'harvard': {
        if (cleanAuthors.length === 1) {
          return cleanAuthors[0];
        } else if (cleanAuthors.length === 2) {
          return `${cleanAuthors[0]} and ${cleanAuthors[1]}`;
        } else {
          return `${cleanAuthors[0]} et al.`;
        }
      } 
      default:
        return cleanAuthors.join(', ');
    }
  };

  const generateCitation = (citation: Citation): { text: string; html: string } => {
    const { type, format, data } = citation;
    const { authors, title, journal, publisher, year, pages, url, accessDate, doi, volume, issue, edition, location } = data;

    const formattedAuthors = formatAuthors(authors || [], format);
    const currentYear = new Date().getFullYear().toString();
    const citationYear = year || currentYear;

    let textCitation = '';
    let htmlCitation = '';

    switch (format) {
      case 'apa': {
        switch (type) {
          case 'book': {
            let apaBookText = '';
            let apaBookHtml = '';
            if (formattedAuthors) {
              apaBookText += `${formattedAuthors} `;
              apaBookHtml += `${formattedAuthors} `;
            }
            apaBookText += `(${citationYear}). `;
            apaBookHtml += `(${citationYear}). `;
            if (title) {
              apaBookText += `${title}`;
              apaBookHtml += `<em>${title}</em>`;
            }
            if (edition) {
              apaBookText += ` (${edition} ed.)`;
              apaBookHtml += ` (${edition} ed.)`;
            }
            apaBookText += '. ';
            apaBookHtml += '. ';
            if (publisher) {
              apaBookText += `${publisher}.`;
              apaBookHtml += `${publisher}.`;
            }
            textCitation = apaBookText;
            htmlCitation = apaBookHtml;
            break;
          } 
          case 'journal': {
            let apaJournalText = '';
            let apaJournalHtml = '';
            if (formattedAuthors) {
              apaJournalText += `${formattedAuthors} `;
              apaJournalHtml += `${formattedAuthors} `;
            }
            apaJournalText += `(${citationYear}). `;
            apaJournalHtml += `(${citationYear}). `;
            if (title) {
              apaJournalText += `${title}. `;
              apaJournalHtml += `${title}. `;
            }
            if (journal) {
              apaJournalText += `${journal}`;
              apaJournalHtml += `<em>${journal}</em>`;
            }
            if (volume) {
              apaJournalText += `, ${volume}`;
              apaJournalHtml += `, <em>${volume}</em>`;
            }
            if (issue) {
              apaJournalText += `(${issue})`;
              apaJournalHtml += `(${issue})`;
            }
            if (pages) {
              apaJournalText += `, ${pages}`;
              apaJournalHtml += `, ${pages}`;
            }
            apaJournalText += '.';
            apaJournalHtml += '.';
            if (doi) {
              apaJournalText += ` https://doi.org/${doi}`;
              apaJournalHtml += ` https://doi.org/${doi}`;
            } else if (url) {
              apaJournalText += ` ${url}`;
              apaJournalHtml += ` ${url}`;
            }
            textCitation = apaJournalText;
            htmlCitation = apaJournalHtml;
            break;
          } 
          case 'website': {
            let apaWebsiteText = '';
            let apaWebsiteHtml = '';
            if (formattedAuthors) {
              apaWebsiteText += `${formattedAuthors} `;
              apaWebsiteHtml += `${formattedAuthors} `;
            }
            apaWebsiteText += `(${citationYear}). `;
            apaWebsiteHtml += `(${citationYear}). `;
            if (title) {
              apaWebsiteText += `${title}. `;
              apaWebsiteHtml += `<em>${title}</em>. `;
            }
            if (publisher) {
              apaWebsiteText += `${publisher}. `;
              apaWebsiteHtml += `${publisher}. `;
            }
            if (url) {
              apaWebsiteText += `${url}`;
              apaWebsiteHtml += `${url}`;
            }
            textCitation = apaWebsiteText;
            htmlCitation = apaWebsiteHtml;
            break;
          } 
          default:
            textCitation = 'Citation format not supported for this source type.';
            htmlCitation = 'Citation format not supported for this source type.';
        }
        break;
      } 
      case 'mla': {
        switch (type) {
          case 'book': {
            let mlaBookText = '';
            let mlaBookHtml = '';
            if (formattedAuthors) {
              mlaBookText += `${formattedAuthors}. `;
              mlaBookHtml += `${formattedAuthors}. `;
            }
            if (title) {
              mlaBookText += `${title}. `;
              mlaBookHtml += `<em>${title}</em>. `;
            }
            if (publisher) {
              mlaBookText += `${publisher}, `;
              mlaBookHtml += `${publisher}, `;
            }
            mlaBookText += `${citationYear}.`;
            mlaBookHtml += `${citationYear}.`;
            textCitation = mlaBookText;
            htmlCitation = mlaBookHtml;
            break;
          } 
          case 'journal': {
            let mlaJournalText = '';
            let mlaJournalHtml = '';
            if (formattedAuthors) {
              mlaJournalText += `${formattedAuthors}. `;
              mlaJournalHtml += `${formattedAuthors}. `;
            }
            if (title) {
              mlaJournalText += `"${title}." `;
              mlaJournalHtml += `"${title}." `;
            }
            if (journal) {
              mlaJournalText += `${journal}`;
              mlaJournalHtml += `<em>${journal}</em>`;
            }
            if (volume) {
              mlaJournalText += `, vol. ${volume}`;
              mlaJournalHtml += `, vol. ${volume}`;
            }
            if (issue) {
              mlaJournalText += `, no. ${issue}`;
              mlaJournalHtml += `, no. ${issue}`;
            }
            mlaJournalText += ` (${citationYear})`;
            mlaJournalHtml += ` (${citationYear})`;
            if (pages) {
              mlaJournalText += `, pp. ${pages}`;
              mlaJournalHtml += `, pp. ${pages}`;
            }
            mlaJournalText += '.';
            mlaJournalHtml += '.';
            if (url) {
              mlaJournalText += ` Web. ${accessDate || new Date().toLocaleDateString()}.`;
              mlaJournalHtml += ` Web. ${accessDate || new Date().toLocaleDateString()}.`;
            }
            textCitation = mlaJournalText;
            htmlCitation = mlaJournalHtml;
            break;
          } 
          case 'website': {
            let mlaWebsiteText = '';
            let mlaWebsiteHtml = '';
            if (formattedAuthors) {
              mlaWebsiteText += `${formattedAuthors}. `;
              mlaWebsiteHtml += `${formattedAuthors}. `;
            }
            if (title) {
              mlaWebsiteText += `"${title}." `;
              mlaWebsiteHtml += `"${title}." `;
            }
            if (publisher) {
              mlaWebsiteText += `${publisher}, `;
              mlaWebsiteHtml += `<em>${publisher}</em>, `;
            }
            mlaWebsiteText += `${citationYear}`;
            mlaWebsiteHtml += `${citationYear}`;
            if (url) {
              mlaWebsiteText += `, ${url}`;
              mlaWebsiteHtml += `, ${url}`;
            }
            mlaWebsiteText += `. Web. ${accessDate || new Date().toLocaleDateString()}.`;
            mlaWebsiteHtml += `. Web. ${accessDate || new Date().toLocaleDateString()}.`;
            textCitation = mlaWebsiteText;
            htmlCitation = mlaWebsiteHtml;
            break;
          } 
          default:
            textCitation = 'Citation format not supported for this source type.';
            htmlCitation = 'Citation format not supported for this source type.';
        }
        break;
      } 
      case 'chicago': {
        switch (type) {
          case 'book': {
            let chicagoBookText = '';
            let chicagoBookHtml = '';
            if (formattedAuthors) {
              chicagoBookText += `${formattedAuthors}. `;
              chicagoBookHtml += `${formattedAuthors}. `;
            }
            if (title) {
              chicagoBookText += `${title}. `;
              chicagoBookHtml += `<em>${title}</em>. `;
            }
            if (location) {
              chicagoBookText += `${location}: `;
              chicagoBookHtml += `${location}: `;
            }
            if (publisher) {
              chicagoBookText += `${publisher}, `;
              chicagoBookHtml += `${publisher}, `;
            }
            chicagoBookText += `${citationYear}.`;
            chicagoBookHtml += `${citationYear}.`;
            textCitation = chicagoBookText;
            htmlCitation = chicagoBookHtml;
            break;
          } 
          case 'journal': {
            let chicagoJournalText = '';
            let chicagoJournalHtml = '';
            if (formattedAuthors) {
              chicagoJournalText += `${formattedAuthors}. `;
              chicagoJournalHtml += `${formattedAuthors}. `;
            }
            if (title) {
              chicagoJournalText += `"${title}." `;
              chicagoJournalHtml += `"${title}." `;
            }
            if (journal) {
              chicagoJournalText += `${journal} `;
              chicagoJournalHtml += `<em>${journal}</em> `;
            }
            if (volume) {
              chicagoJournalText += `${volume}`;
              chicagoJournalHtml += `${volume}`;
            }
            if (issue) {
              chicagoJournalText += `, no. ${issue}`;
              chicagoJournalHtml += `, no. ${issue}`;
            }
            chicagoJournalText += ` (${citationYear})`;
            chicagoJournalHtml += ` (${citationYear})`;
            if (pages) {
              chicagoJournalText += `: ${pages}`;
              chicagoJournalHtml += `: ${pages}`;
            }
            chicagoJournalText += '.';
            chicagoJournalHtml += '.';
            if (doi) {
              chicagoJournalText += ` https://doi.org/${doi}.`;
              chicagoJournalHtml += ` https://doi.org/${doi}.`;
            } else if (url) {
              chicagoJournalText += ` ${url}.`;
              chicagoJournalHtml += ` ${url}.`;
            }
            textCitation = chicagoJournalText;
            htmlCitation = chicagoJournalHtml;
            break;
          }

          case 'website': {
            let chicagoWebsiteText = '';
            let chicagoWebsiteHtml = '';
            if (formattedAuthors) {
              chicagoWebsiteText += `${formattedAuthors}. `;
              chicagoWebsiteHtml += `${formattedAuthors}. `;
            }
            if (title) {
              chicagoWebsiteText += `"${title}." `;
              chicagoWebsiteHtml += `"${title}." `;
            }
            if (publisher) {
              chicagoWebsiteText += `${publisher}. `;
              chicagoWebsiteHtml += `${publisher}. `;
            }
            chicagoWebsiteText += `Accessed ${accessDate || new Date().toLocaleDateString()}. `;
            chicagoWebsiteHtml += `Accessed ${accessDate || new Date().toLocaleDateString()}. `;
            if (url) {
              chicagoWebsiteText += `${url}.`;
              chicagoWebsiteHtml += `${url}.`;
            }
            textCitation = chicagoWebsiteText;
            htmlCitation = chicagoWebsiteHtml;
            break;
          } 
          default:
            textCitation = 'Citation format not supported for this source type.';
            htmlCitation = 'Citation format not supported for this source type.';
        }
        break;
      } 
      case 'harvard': {
        switch (type) {
          case 'book': {
            let harvardBookText = '';
            let harvardBookHtml = '';
            if (formattedAuthors) {
              harvardBookText += `${formattedAuthors} `;
              harvardBookHtml += `${formattedAuthors} `;
            }
            harvardBookText += `${citationYear}`;
            harvardBookHtml += `${citationYear}`;
            if (title) {
              harvardBookText += `, ${title}`;
              harvardBookHtml += `, <em>${title}</em>`;
            }
            if (edition) {
              harvardBookText += `, ${edition} edn`;
              harvardBookHtml += `, ${edition} edn`;
            }
            if (publisher) {
              harvardBookText += `, ${publisher}`;
              harvardBookHtml += `, ${publisher}`;
            }
            if (location) {
              harvardBookText += `, ${location}`;
              harvardBookHtml += `, ${location}`;
            }
            harvardBookText += '.';
            harvardBookHtml += '.';
            textCitation = harvardBookText;
            htmlCitation = harvardBookHtml;
            break;
          } 
          case 'journal': {
            let harvardJournalText = '';
            let harvardJournalHtml = '';
            if (formattedAuthors) {
              harvardJournalText += `${formattedAuthors} `;
              harvardJournalHtml += `${formattedAuthors} `;
            }
            harvardJournalText += `${citationYear}`;
            harvardJournalHtml += `${citationYear}`;
            if (title) {
              harvardJournalText += `, '${title}'`;
              harvardJournalHtml += `, '${title}'`;
            }
            if (journal) {
              harvardJournalText += `, ${journal}`;
              harvardJournalHtml += `, <em>${journal}</em>`;
            }
            if (volume) {
              harvardJournalText += `, vol. ${volume}`;
              harvardJournalHtml += `, vol. ${volume}`;
            }
            if (issue) {
              harvardJournalText += `, no. ${issue}`;
              harvardJournalHtml += `, no. ${issue}`;
            }
            if (pages) {
              harvardJournalText += `, pp. ${pages}`;
              harvardJournalHtml += `, pp. ${pages}`;
            }
            harvardJournalText += '.';
            harvardJournalHtml += '.';
            if (doi) {
              harvardJournalText += ` Available at: https://doi.org/${doi}.`;
              harvardJournalHtml += ` Available at: https://doi.org/${doi}.`;
            } else if (url) {
              harvardJournalText += ` Available at: ${url}.`;
              harvardJournalHtml += ` Available at: ${url}.`;
            }
            textCitation = harvardJournalText;
            htmlCitation = harvardJournalHtml;
            break;
          }

          case 'website': {
            let harvardWebsiteText = '';
            let harvardWebsiteHtml = '';
            if (formattedAuthors) {
              harvardWebsiteText += `${formattedAuthors} `;
              harvardWebsiteHtml += `${formattedAuthors} `;
            }
            harvardWebsiteText += `${citationYear}`;
            harvardWebsiteHtml += `${citationYear}`;
            if (title) {
              harvardWebsiteText += `, ${title}`;
              harvardWebsiteHtml += `, <em>${title}</em>`;
            }
            if (publisher) {
              harvardWebsiteText += `, ${publisher}`;
              harvardWebsiteHtml += `, ${publisher}`;
            }
            harvardWebsiteText += `, viewed ${accessDate || new Date().toLocaleDateString()}`;
            harvardWebsiteHtml += `, viewed ${accessDate || new Date().toLocaleDateString()}`;
            if (url) {
              harvardWebsiteText += `, <${url}>`;
              harvardWebsiteHtml += `, &lt;${url}&gt;`;
            }
            harvardWebsiteText += '.';
            harvardWebsiteHtml += '.';
            textCitation = harvardWebsiteText;
            htmlCitation = harvardWebsiteHtml;
            break;
          } 
          default:
            textCitation = 'Citation format not supported for this source type.';
            htmlCitation = 'Citation format not supported for this source type.';
        }
        break;
      } 
      default:
        textCitation = 'Unsupported citation format.';
        htmlCitation = 'Unsupported citation format.';
    }

    return { text: textCitation, html: htmlCitation };
  };

  const parseUrlMetadata = async (url: string): Promise<Partial<Citation['data']>> => {
    try {
      console.log('Parsing URL with AI:', url);
      
      const { data } = await supabase.functions.invoke('extract-citation', {
        body: { url }
      });

      console.log('AI extraction result:', data);
      return data;
    } catch (error) {
      console.error('Error parsing URL with AI:', error);
      
      // Fallback: extract basic info from URL
      try {
        const urlObj = new URL(url);
        return {
          title: 'Web Page',
          publisher: urlObj.hostname,
          year: new Date().getFullYear().toString(),
          url: url,
          accessDate: new Date().toLocaleDateString()
        };
      } catch {
        return {
          title: 'Web Page',
          url: url,
          accessDate: new Date().toLocaleDateString()
        };
      }
    }
  };

  const handleUrlParse = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoadingUrl(true);
    try {
      const metadata = await parseUrlMetadata(urlInput.trim());
      
      const newCitation: Citation = {
        id: generateId(),
        type: 'website',
        format: currentCitation.format as 'apa' | 'mla' | 'chicago' | 'harvard' || 'apa',
        data: metadata
      };
      
      const formatted = generateCitation(newCitation);
      newCitation.formatted = formatted.text;
      newCitation.formattedHtml = formatted.html;
      setCitations(prev => [newCitation, ...prev]);
      setUrlInput('');
      toast.success('Citation generated from URL successfully!');
    } catch (error) {
      console.error('Failed to parse URL:', error);
      toast.error('Failed to parse URL. Please try manual entry.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleManualAdd = () => {
    if (!currentCitation.data?.title) {
      toast.error('Please enter at least a title');
      return;
    }

    const newCitation: Citation = {
      id: generateId(),
      type: currentCitation.type as Citation['type'] || 'book',
      format: currentCitation.format as Citation['format'] || 'apa',
      data: { ...currentCitation.data }
    };

    const formatted = generateCitation(newCitation);
    newCitation.formatted = formatted.text;
    newCitation.formattedHtml = formatted.html;
    setCitations(prev => [newCitation, ...prev]);
    
    // Reset form
    setCurrentCitation({
      type: currentCitation.type,
      format: currentCitation.format,
      data: {}
    });
    
    toast.success('Citation added successfully!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Citation copied to clipboard!');
    });
  };

  const exportBibliography = (format: 'txt' | 'rtf') => {
    if (citations.length === 0) {
      toast.error('No citations to export');
      return;
    }

    const content = citations.map(c => c.formatted).join('\n\n');
    const blob = new Blob([content], { type: format === 'rtf' ? 'application/rtf' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibliography.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
    toast.success('Citation deleted');
  };

  const updateCurrentCitationData = (field: string, value: string) => {
    setCurrentCitation(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  const updateCurrentCitationAuthors = (authors: string) => {
    const authorList = authors.split(',').map(a => a.trim()).filter(a => a);
    setCurrentCitation(prev => ({
      ...prev,
      data: {
        ...prev.data,
        authors: authorList
      }
    }));
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'journal': return <FileText className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Academic Citation Generator</h2>
        <p className="text-muted-foreground">
          Generate perfect citations in APA, MLA, Chicago, and Harvard formats with AI-powered URL parsing
        </p>
      </div>

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            From URL (AI-Powered)
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                AI-Powered Citation from URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citation-format">Citation Format</Label>
                <Select 
                  value={currentCitation.format || 'apa'} 
                  onValueChange={(value) => setCurrentCitation(prev => ({ ...prev, format: value as Citation['format'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apa">APA (7th Edition)</SelectItem>
                    <SelectItem value="mla">MLA (8th Edition)</SelectItem>
                    <SelectItem value="chicago">Chicago (17th Edition)</SelectItem>
                    <SelectItem value="harvard">Harvard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL (e.g., https://example.com/article)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUrlParse}
                  disabled={isLoadingUrl || !urlInput.trim()}
                >
                  {isLoadingUrl ? 'Extracting...' : 'Generate'}
                </Button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>✨ AI-Powered:</strong> Our system uses OpenAI to intelligently extract author names, publication dates, 
                  and other citation details from any webpage - even when standard metadata isn&apos;t available.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Manual Citation Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select 
                    value={currentCitation.type || 'book'} 
                    onValueChange={(value) => setCurrentCitation(prev => ({ ...prev, type: value as Citation['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="journal">Journal Article</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citation-format">Citation Format</Label>
                  <Select 
                    value={currentCitation.format || 'apa'} 
                    onValueChange={(value) => setCurrentCitation(prev => ({ ...prev, format: value as Citation['format'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apa">APA (7th Edition)</SelectItem>
                      <SelectItem value="mla">MLA (8th Edition)</SelectItem>
                      <SelectItem value="chicago">Chicago (17th Edition)</SelectItem>
                      <SelectItem value="harvard">Harvard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authors">Authors (comma-separated)</Label>
                  <Input
                    id="authors"
                    placeholder="John Smith, Jane Doe"
                    value={currentCitation.data?.authors?.join(', ') || ''}
                    onChange={(e) => updateCurrentCitationAuthors(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter title"
                    value={currentCitation.data?.title || ''}
                    onChange={(e) => updateCurrentCitationData('title', e.target.value)}
                  />
                </div>
              </div>

              {currentCitation.type === 'journal' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="journal">Journal Name</Label>
                    <Input
                      id="journal"
                      placeholder="Journal name"
                      value={currentCitation.data?.journal || ''}
                      onChange={(e) => updateCurrentCitationData('journal', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume</Label>
                    <Input
                      id="volume"
                      placeholder="Volume"
                      value={currentCitation.data?.volume || ''}
                      onChange={(e) => updateCurrentCitationData('volume', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue">Issue</Label>
                    <Input
                      id="issue"
                      placeholder="Issue"
                      value={currentCitation.data?.issue || ''}
                      onChange={(e) => updateCurrentCitationData('issue', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    placeholder="Publisher"
                    value={currentCitation.data?.publisher || ''}
                    onChange={(e) => updateCurrentCitationData('publisher', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="2024"
                    value={currentCitation.data?.year || ''}
                    onChange={(e) => updateCurrentCitationData('year', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    placeholder="1-10"
                    value={currentCitation.data?.pages || ''}
                    onChange={(e) => updateCurrentCitationData('pages', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL (if applicable)</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={currentCitation.data?.url || ''}
                    onChange={(e) => updateCurrentCitationData('url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI (if applicable)</Label>
                  <Input
                    id="doi"
                    placeholder="10.1000/123456"
                    value={currentCitation.data?.doi || ''}
                    onChange={(e) => updateCurrentCitationData('doi', e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleManualAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Citation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {citations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Citations ({citations.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportBibliography('txt')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as TXT
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportBibliography('rtf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as RTF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {citations.map((citation) => (
                <div key={citation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(citation.type)}
                      <Badge variant="outline">{citation.type}</Badge>
                      <Badge variant="secondary">{citation.format.toUpperCase()}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(citation.formatted || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCitation(citation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded text-sm">
                    <div 
                      dangerouslySetInnerHTML={{ __html: citation.formattedHtml || citation.formatted || '' }}
                      className="citation-display"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {citations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Citations Yet</h3>
            <p className="text-muted-foreground">
              Start by generating a citation from a URL or entering details manually.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CitationGenerator;
