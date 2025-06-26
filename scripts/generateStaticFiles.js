
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This script will be called during build to generate static HTML files
async function generateStaticFiles() {
  try {
    // Import our generator functions
    const { generateStaticHtmlPages, generateSimpleSitemap } = await import('../src/utils/staticHtmlGenerator.ts');
    
    const outputDir = join(__dirname, '../dist');
    
    // Generate static HTML pages
    const pages = generateStaticHtmlPages();
    
    console.log(`Generating ${pages.length} static HTML pages...`);
    
    pages.forEach(page => {
      const filePath = join(outputDir, page.path === '/' ? 'index.html' : `${page.path}/index.html`);
      const dir = dirname(filePath);
      
      // Create directory if it doesn't exist
      mkdirSync(dir, { recursive: true });
      
      // Write static HTML file
      writeFileSync(filePath, page.html);
      console.log(`Generated: ${filePath}`);
    });
    
    // Generate sitemap
    const sitemap = generateSimpleSitemap();
    writeFileSync(join(outputDir, 'sitemap.xml'), sitemap);
    console.log('Generated: sitemap.xml');
    
    console.log('✅ Static files generation complete!');
    
  } catch (error) {
    console.error('❌ Error generating static files:', error);
    process.exit(1);
  }
}

generateStaticFiles();
