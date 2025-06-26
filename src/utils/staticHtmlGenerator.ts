import { categories } from '@/data/categories';
import { getAllTools } from '@/data/tools';
import { getPageMeta } from '@/utils/metaUtils';
import { generateCategorySchema, generateToolSchema, generateBreadcrumbSchema } from '@/utils/schemaUtils';

interface StaticPage {
  path: string;
  html: string;
}

// Generate static HTML snippets for key pages that crawlers will see
export const generateStaticHtmlPages = (): StaticPage[] => {
  const pages: StaticPage[] = [];
  const tools = getAllTools();

  // Homepage
  const homeMeta = getPageMeta('home');
  pages.push({
    path: '/',
    html: generatePageHtml({
      title: homeMeta.title,
      description: homeMeta.description,
      canonical: 'https://neuralstock.ai',
      schema: [],
      content: `
        <h1>NeuralStock.ai - 1000+ Free AI-Powered Online Tools</h1>
        <p>Discover our comprehensive collection of AI-powered tools for developers, designers, and marketers. All tools run in your browser with no software installation required.</p>
        <section>
          <h2>Featured Categories</h2>
          ${categories.slice(0, 6).map(cat => `
            <div>
              <h3>${cat.name}</h3>
              <p>${cat.description}</p>
              <a href="/category/${cat.id}">View ${cat.name} Tools</a>
            </div>
          `).join('')}
        </section>
      `
    })
  });

  // Category pages - fix the filter to use array properly
  categories.forEach(category => {
    const categoryTools = tools.filter(tool => tool.category === category.id);
    const meta = getPageMeta('category', { category });
    const categorySchema = generateCategorySchema(category.name, category.description, categoryTools);
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://neuralstock.ai' },
      { name: 'Categories', url: 'https://neuralstock.ai/categories' },
      { name: category.name, url: `https://neuralstock.ai/category/${category.id}` }
    ]);

    pages.push({
      path: `/category/${category.id}`,
      html: generatePageHtml({
        title: meta.title,
        description: meta.description,
        canonical: `https://neuralstock.ai/category/${category.id}`,
        schema: [categorySchema, breadcrumbSchema],
        content: `
          <h1>${category.name} Tools</h1>
          <p>${category.description}</p>
          <p>${categoryTools.length} tool${categoryTools.length !== 1 ? 's' : ''} available</p>
          <section>
            <h2>Available ${category.name} Tools</h2>
            ${categoryTools.slice(0, 12).map(tool => `
              <div>
                <h3><a href="/tool/${tool.id}">${tool.name}</a></h3>
                <p>${tool.description}</p>
              </div>
            `).join('')}
          </section>
        `
      })
    });
  });

  // Tool pages (top 100 most important ones)
  const topTools = tools.slice(0, 100);
  topTools.forEach(tool => {
    const category = categories.find(cat => cat.id === tool.category);
    const meta = getPageMeta('tool', { tool, category });
    const toolSchema = generateToolSchema(tool.id, tool.name, tool.description);
    const breadcrumbs = [
      { name: 'Home', url: 'https://neuralstock.ai' },
      { name: 'Categories', url: 'https://neuralstock.ai/categories' }
    ];
    
    if (category) {
      breadcrumbs.push({ 
        name: category.name, 
        url: `https://neuralstock.ai/category/${category.id}` 
      });
    }
    
    breadcrumbs.push({ 
      name: tool.name, 
      url: `https://neuralstock.ai/tool/${tool.id}` 
    });
    
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    pages.push({
      path: `/tool/${tool.id}`,
      html: generatePageHtml({
        title: meta.title,
        description: meta.description,
        canonical: `https://neuralstock.ai/tool/${tool.id}`,
        schema: [toolSchema, breadcrumbSchema],
        content: `
          <h1>${tool.name}</h1>
          <p>${tool.description}</p>
          ${category ? `<p>Category: <a href="/category/${category.id}">${category.name}</a></p>` : ''}
          <section>
            <h2>About ${tool.name}</h2>
            <p>This ${tool.name.toLowerCase()} tool helps you process and transform your data efficiently. All processing happens in your browser for privacy and speed.</p>
          </section>
        `
      })
    });
  });

  return pages;
};

interface PageHtmlOptions {
  title: string;
  description: string;
  canonical: string;
  schema: unknown[];
  content: string;
}

const generatePageHtml = ({ title, description, canonical, schema, content }: PageHtmlOptions): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n  ')}
</head>
<body>
  <header>
    <nav>
      <a href="/">NeuralStock.ai</a>
      <a href="/tools">Tools</a>
      <a href="/categories">Categories</a>
    </nav>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>&copy; 2024 NeuralStock.ai - Free AI-Powered Online Tools</p>
  </footer>
</body>
</html>`;
};

// Generate a robots.txt friendly sitemap
export const generateSimpleSitemap = (): string => {
  const tools = getAllTools();
  const baseUrl = 'https://neuralstock.ai';
  
  const urls = [
    baseUrl,
    `${baseUrl}/tools`,
    `${baseUrl}/categories`,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    ...categories.map(cat => `${baseUrl}/category/${cat.id}`),
    ...tools.map(tool => `${baseUrl}/tool/${tool.id}`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl ? '1.0' : url.includes('/tool/') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;
};
