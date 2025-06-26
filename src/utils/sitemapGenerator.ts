
import { categories } from '@/data/categories';
import { getAllTools } from '@/data/tools';

const DOMAIN = 'https://neuralstock.ai';

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod: string;
}

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Enhanced static pages configuration with better SEO priorities
const staticPages: SitemapUrl[] = [
  {
    loc: `${DOMAIN}/`,
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/tools`,
    changefreq: 'daily',
    priority: 0.95,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/categories`,
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/about`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/contact`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/partnership`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/privacy-policy`,
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: getCurrentDate()
  },
  {
    loc: `${DOMAIN}/cookie-policy`,
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: getCurrentDate()
  }
];

export const generateSitemap = (): string => {
  const urls: SitemapUrl[] = [...staticPages];
  
  // Add category pages with higher priority
  categories.forEach(category => {
    urls.push({
      loc: `${DOMAIN}/category/${category.id}`,
      changefreq: 'weekly',
      priority: 0.85,
      lastmod: getCurrentDate()
    });
  });
  
  // Add tool pages with optimized priorities
  const tools = getAllTools();
  tools.forEach(tool => {
    // Higher priority for featured/popular tools
    const isPopular = ['json-formatter', 'password-generator', 'word-counter', 'color-converter'].includes(tool.id);
    
    urls.push({
      loc: `${DOMAIN}/tool/${tool.id}`,
      changefreq: 'monthly',
      priority: isPopular ? 0.8 : 0.7,
      lastmod: getCurrentDate()
    });
  });
  
  // Sort URLs by priority (highest first) for better SEO
  urls.sort((a, b) => b.priority - a.priority);
  
  // Generate properly formatted XML
  const urlEntries = urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Helper function to escape XML special characters
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// Enhanced logging function
export const logSitemapStats = () => {
  const tools = getAllTools();
  console.log(`📊 Sitemap Statistics:
- Total URLs: ${staticPages.length + categories.length + tools.length}
- Static Pages: ${staticPages.length}
- Categories: ${categories.length}
- Tools: ${tools.length}
- Generated: ${getCurrentDate()}
- Domain: ${DOMAIN}`);
};

export const downloadSitemap = () => {
  const sitemapContent = generateSitemap();
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Log the sitemap for easy copying
export const logSitemap = () => {
  console.log('Generated Sitemap:');
  console.log(generateSitemap());
};
