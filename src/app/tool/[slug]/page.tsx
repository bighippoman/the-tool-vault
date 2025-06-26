import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tool } from '@/types/tool';
import { getToolById, getAllTools } from '@/data/tools';
import { getCategoryInfo } from '@/data/categories';
import { generateToolSchema, generateBreadcrumbSchema } from '@/utils/schemaUtils';
import StructuredData from '@/components/seo/StructuredData';
import { getToolMeta } from '@/utils/metaUtils';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import ToolPageClient from './ToolPageClient';

// 🚀 PERFORMANCE: Removed ALL static tool imports - now using client-side dynamic loading only
// This eliminates 700+ kB from the initial bundle and enables true code splitting

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.id,
  }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool: Tool | undefined | null = getToolById(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }

  const category = getCategoryInfo(tool.category);
  const categoryName = category?.name || 'Tool';
  
  // Get SEO-optimized metadata
  const toolMeta = getToolMeta(tool.id);
  const seoDescription = toolMeta?.description || tool.description;
  const seoKeywords = toolMeta?.keywords || '';
  
  // Convert keywords string to array, handling both string and array inputs
  const keywordsArray = typeof seoKeywords === 'string' 
    ? seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : Array.isArray(seoKeywords) 
    ? seoKeywords
    : [seoKeywords];

  return {
    title: `${tool.name} - ${categoryName} Tool`,
    description: seoDescription,
    keywords: [
      tool.name.toLowerCase(), 
      `${categoryName.toLowerCase()} tool`, 
      'free tool', 
      'productivity', 
      'NeuralStock',
      ...keywordsArray
    ],
    openGraph: {
      title: `${tool.name} | NeuralStock.ai`,
      description: `${seoDescription} Free tool.`,
      images: ['/og-image.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | NeuralStock.ai`,
      description: `${seoDescription} Free tool.`,
      images: ['/og-image.png'],
    },
    authors: [{ name: 'NeuralStock.ai Team' }],
    creator: 'NeuralStock.ai',
    publisher: 'NeuralStock.ai',
    robots: 'index, follow',
    alternates: {
      canonical: `https://neuralstock.ai/tool/${slug}`,
    },
  };
}

// Server Component - renders tool UI server-side for optimal SEO
export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool: Tool | undefined | null = getToolById(slug);

  if (!tool) {
    notFound();
  }

  // Generate structured data for SEO
  const toolSchema = generateToolSchema(tool.id, tool.name, tool.description);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://neuralstock.ai' },
    { name: 'Tools', url: 'https://neuralstock.ai/tools' },
    { name: tool.name, url: `https://neuralstock.ai/tool/${tool.id}` }
  ]);

  return (
    <ToolPageLayout tool={tool}>
      {/* Inject JSON-LD structured data */}
      <StructuredData schema={[toolSchema, breadcrumbSchema]} />
      
      {/* Render tool UI client-side */}
      <ToolPageClient tool={tool} />
    </ToolPageLayout>
  );
}
