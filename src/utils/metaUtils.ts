interface MetaData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const updateMetaTags = (meta: MetaData) => {
  // Update title
  document.title = meta.title;

  // Update or create meta description
  updateMetaTag('name', 'description', meta.description);

  // Update keywords if provided
  if (meta.keywords) {
    updateMetaTag('name', 'keywords', meta.keywords);
  }

  // Update canonical URL if provided
  if (meta.canonical) {
    updateLinkTag('canonical', meta.canonical);
  }

  // Update Open Graph tags
  updateMetaTag('property', 'og:title', meta.ogTitle || meta.title);
  updateMetaTag('property', 'og:description', meta.ogDescription || meta.description);
  updateMetaTag('property', 'og:url', meta.canonical || window.location.href);
  
  if (meta.ogImage) {
    updateMetaTag('property', 'og:image', meta.ogImage);
  }

  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:title', meta.ogTitle || meta.title);
  updateMetaTag('name', 'twitter:description', meta.ogDescription || meta.description);
  
  if (meta.ogImage) {
    updateMetaTag('name', 'twitter:image', meta.ogImage);
  }

  // Trigger a custom event to signal meta tags have been updated (for prerendering)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('meta-tags-updated'));
  }
};

const updateMetaTag = (attribute: string, name: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.content = content;
    document.getElementsByTagName('head')[0].appendChild(element);
  }
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (element) {
    element.href = href;
  } else {
    element = document.createElement('link');
    element.rel = rel;
    element.href = href;
    document.getElementsByTagName('head')[0].appendChild(element);
  }
};

// Simple function to get tool metadata by ID
export const getToolMeta = (toolId: string) => {
  const toolMetas: Record<string, { description: string; keywords: string }> = {
    // Development Tools
    'json-formatter': {
      description: 'JSON Formatter, Validator and Fixer - Free online tool to intelligently repair, format, validate, and transform JSON data with advanced AI capabilities. Fix broken JSON, beautify formatting, and convert to multiple formats.',
      keywords: 'json formatter, json validator, json fixer, json beautifier, json repair, ai json fix, format json online, validate json, json syntax checker, json transformer'
    },
    'html-entity': {
      description: 'Convert HTML entities online with our free encoder/decoder tool. Transform special characters, symbols, and Unicode to HTML entities and vice versa instantly.',
      keywords: 'html entity encoder, html entity decoder, html entities, special characters, unicode converter, html escape, html unescape'
    },
    'base64': {
      description: 'Encode and decode Base64 data online. Convert text, files, and binary data to Base64 format for secure data transmission and storage.',
      keywords: 'base64 encoder, base64 decoder, base64 converter, data encoding, binary encoding, text encoder'
    },
    'url-encoder': {
      description: 'Encode and decode URLs for safe web transmission. Convert special characters, spaces, and symbols for proper URL formatting and HTTP requests.',
      keywords: 'url encoder, url decoder, percent encoding, uri encoding, web development, http encoding'
    },
    // Add more tools as needed...
  };
  
  return toolMetas[toolId] || null;
};

// Enhanced tool-specific SEO optimized descriptions with comprehensive coverage
const getToolSpecificMeta = (toolId: string, toolName: string, baseDescription: string) => {
  const toolMetas: Record<string, { description: string; keywords: string }> = {
    // Development Tools
    'json-formatter': {
      description: 'JSON Formatter, Validator and Fixer - Free online tool to intelligently repair, format, validate, and transform JSON data with advanced AI capabilities. Fix broken JSON, beautify formatting, and convert to multiple formats.',
      keywords: 'json formatter, json validator, json fixer, json beautifier, json repair, ai json fix, format json online, validate json, json syntax checker, json transformer'
    },
    'html-entity': {
      description: 'Convert HTML entities online with our free encoder/decoder tool. Transform special characters, symbols, and Unicode to HTML entities and vice versa instantly.',
      keywords: 'html entity encoder, html entity decoder, html entities, special characters, unicode converter, html escape, html unescape'
    },
    'base64': {
      description: 'Encode and decode Base64 data online. Convert text, files, and binary data to Base64 format for secure data transmission and storage.',
      keywords: 'base64 encoder, base64 decoder, base64 converter, data encoding, binary encoding, text encoder'
    },
    'url-encoder': {
      description: 'Encode and decode URLs for safe web transmission. Convert special characters, spaces, and symbols for proper URL formatting and HTTP requests.',
      keywords: 'url encoder, url decoder, percent encoding, uri encoding, web development, http encoding'
    },
    'case-converter': {
      description: 'Convert text case online with multiple format options. Transform text to uppercase, lowercase, title case, camelCase, snake_case, and more instantly.',
      keywords: 'case converter, text case, uppercase, lowercase, title case, camelCase, snake_case, text transformer'
    },
    'hash-generator': {
      description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hash values online. Secure hash calculator for password verification, data integrity, and cryptographic applications.',
      keywords: 'hash generator, md5 generator, sha256 generator, hash calculator, cryptographic hash, data integrity'
    },
    'regex-tester': {
      description: 'Test and debug regular expressions online with live matching. Regex tester with syntax highlighting, match groups, and common regex patterns library.',
      keywords: 'regex tester, regular expression, regex validator, pattern matching, regex debugger, regexp tester'
    },
    'css-minifier': {
      description: 'Minify and compress CSS code to reduce file size. CSS optimizer with beautification, error detection, and performance optimization for faster websites.',
      keywords: 'css minifier, css compressor, css optimizer, minify css, css beautifier, web performance'
    },
    'js-minifier': {
      description: 'Minify and beautify JavaScript code online. JS compressor with error detection, syntax validation, and code optimization for better performance.',
      keywords: 'javascript minifier, js compressor, js beautifier, minify javascript, code optimizer, web performance'
    },
    'sql-formatter': {
      description: 'Format and beautify SQL queries online with syntax highlighting. Professional SQL formatter with multiple dialect support, error detection, and query optimization.',
      keywords: 'sql formatter, sql beautifier, sql query formatter, database formatter, mysql formatter, postgresql formatter, sql syntax'
    },
    'jwt-decoder': {
      description: 'Decode and analyze JWT tokens online with detailed payload inspection. Verify JSON Web Token structure, claims, and signatures for debugging and security analysis.',
      keywords: 'jwt decoder, jwt token decoder, json web token, jwt parser, token analyzer, jwt debugger, authentication token'
    },
    'cron-generator': {
      description: 'Generate cron expressions with visual scheduler interface. Create and validate cron jobs with human-readable descriptions for task automation and scheduling.',
      keywords: 'cron generator, cron expression, cron job, task scheduler, cron syntax, automation, unix cron, scheduling'
    },
    'uuid-generator': {
      description: 'Generate UUIDs/GUIDs in multiple formats with bulk generation. Create unique identifiers in v1, v4, v5 formats with validation and format conversion tools.',
      keywords: 'uuid generator, guid generator, unique identifier, uuid v4, random uuid, bulk uuid generator'
    },
    'timestamp-converter': {
      description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for multiple time zones, formats, and batch conversion.',
      keywords: 'timestamp converter, unix timestamp, epoch converter, date converter, time converter, unix time'
    },

    // Design & Creative Tools
    'color-converter': {
      description: 'Convert colors between HEX, RGB, HSL, CMYK, and HSV formats instantly. Professional color converter tool for designers and developers with color palette generator.',
      keywords: 'color converter, hex to rgb, rgb to hex, hsl converter, color picker, color palette, design tools, css colors'
    },
    'gradient-generator': {
      description: 'Create beautiful CSS gradients with live preview. Linear, radial, and conic gradients with color picker, angle control, and CSS code export.',
      keywords: 'gradient generator, css gradient, linear gradient, radial gradient, color gradient, gradient maker'
    },
    'favicon-generator': {
      description: 'Generate favicons in multiple sizes from any image. Create PNG and ICO favicons with perfect scaling for all devices and browsers with ready-to-use HTML code.',
      keywords: 'favicon generator, png favicon, ico favicon, favicon maker, website icon, browser icon, favicon converter, multi-size favicon'
    },
    'image-compressor': {
      description: 'Compress and optimize images for web use. Reduce JPEG, PNG, WebP file sizes while maintaining quality. Batch compression with preview.',
      keywords: 'image compressor, optimize images, reduce image size, jpeg compressor, png optimizer, web images'
    },
    'ai-image-generator': {
      description: 'Generate stunning AI images from text descriptions using advanced AI models. Create artwork, photos, and graphics with artificial intelligence.',
      keywords: 'ai image generator, text to image, ai art generator, artificial intelligence images, ai artwork, generate images'
    },

    // Productivity Tools
    'word-counter': {
      description: 'Count words, characters, paragraphs, and reading time instantly. Free text analyzer tool for writers, students, and content creators with detailed statistics.',
      keywords: 'word counter, character counter, text analyzer, reading time calculator, paragraph counter, writing tools'
    },
    'markdown-editor': {
      description: 'Write and preview Markdown in real-time with live rendering. Feature-rich Markdown editor with syntax highlighting, export options, and GitHub-flavored Markdown support.',
      keywords: 'markdown editor, markdown preview, md editor, github markdown, markdown converter, live preview, documentation editor'
    },
    'diff-checker': {
      description: 'Compare two texts and highlight differences with side-by-side comparison. Advanced text diff tool with syntax highlighting, merge options, and export capabilities.',
      keywords: 'text diff, compare text, diff checker, text comparison, file diff, code diff, merge tool, text differences'
    },
    'lorem-generator': {
      description: 'Generate Lorem Ipsum placeholder text for design and development projects. Customize paragraphs, words, and formatting options.',
      keywords: 'lorem ipsum generator, placeholder text, dummy text, text generator, design placeholder, lorem ipsum'
    },
    'pdf-compressor': {
      description: 'Compress PDF files online to reduce size while maintaining quality for web upload and email sharing',
      keywords: 'pdf compressor, compress pdf, reduce pdf size, pdf optimizer, shrink pdf, pdf file size reducer'
    },

    // Marketing Tools  
    'meta-tag-generator': {
      description: 'Generate SEO-optimized meta tags, Open Graph, and Twitter Cards for maximum SEO impact',
      keywords: 'seo meta tags, open graph generator, twitter cards, seo optimizer, social media tags'
    },
    'utm-builder': {
      description: 'Build UTM tracking parameters for marketing campaigns. Track traffic sources, campaigns, and conversions with Google Analytics integration.',
      keywords: 'utm builder, utm generator, campaign tracking, google analytics, marketing attribution, utm parameters'
    },
    'qr-generator': {
      description: 'Generate QR codes for URLs, text, WiFi, contact info, and more. Customize size, colors, and logo. Download high-quality QR codes instantly.',
      keywords: 'qr code generator, qr maker, wifi qr code, vcard qr code, url qr code, qr code creator'
    },
    'email-signature-generator': {
      description: 'Create professional email signatures with contact information, social links, and branding. Responsive HTML email signatures for Gmail, Outlook, and all email clients.',
      keywords: 'email signature generator, professional email signature, html email signature, email signature design, business email signature'
    },
    'social-media-caption-generator': {
      description: 'Generate engaging social media captions for Instagram, Facebook, LinkedIn, and Twitter using AI. Smart hashtag suggestions and engagement optimization.',
      keywords: 'social media captions, instagram captions, ai caption generator, hashtag generator, social media content, engagement captions'
    },
    'email-subject-tester': {
      description: 'Test and optimize email subject lines for maximum open rates. A/B testing insights, spam score analysis, and subject line optimization recommendations.',
      keywords: 'email subject lines, email open rates, subject line tester, email marketing, a/b testing, spam score checker'
    },
    'brand-color-palette-generator': {
      description: 'Generate professional brand color palettes with AI-powered color harmony analysis. Accessibility checks, psychology insights, and export options for designers.',
      keywords: 'brand colors, color palette generator, brand identity, color harmony, color psychology, brand design, color schemes'
    },
    'content-optimizer': {
      description: 'Optimize content for SEO, readability, and engagement using AI analysis. Keyword density, readability scores, sentiment analysis, and improvement suggestions.',
      keywords: 'content optimization, seo content, readability analyzer, content analysis, ai content optimizer, seo writing, content quality'
    },

    // Utility Tools
    'password-generator': {
      description: 'Generate strong, secure passwords online. Customize length, include symbols, numbers, uppercase/lowercase letters. Create uncrackable passwords for maximum security.',
      keywords: 'password generator, strong password, secure password, random password, password creator, password maker, security'
    },
    'terms-analyzer': {
      description: 'Analyze terms of service and privacy policies with AI-powered legal document analysis. Plain-language explanations, danger flags, and accessibility insights.',
      keywords: 'terms analyzer, privacy policy analyzer, legal document analysis, terms of service, contract analysis, legal ai, document review'
    },

    // Finance Tools
    'investment-calculator': {
      description: 'Calculate investment returns with compound interest. Advanced investment calculator with charts, projections, and retirement planning tools.',
      keywords: 'investment calculator, compound interest calculator, investment returns, retirement calculator, financial planning'
    },
    'loan-calculator': {
      description: 'Calculate loan payments, interest, and amortization schedules. Mortgage, auto, and personal loan calculator with detailed payment breakdown.',
      keywords: 'loan calculator, mortgage calculator, payment calculator, amortization calculator, loan payment, interest calculator'
    },
    'mortgage-affordability-calculator': {
      description: 'Determine how much house you can afford with comprehensive affordability analysis. Factor in income, debts, down payment, and local market conditions.',
      keywords: 'mortgage affordability, home affordability calculator, house affordability, mortgage pre-approval, home buying calculator, real estate calculator'
    },
    'debt-payoff-calculator': {
      description: 'Create optimized debt payoff strategies using snowball and avalanche methods. Visual progress tracking, payment scheduling, and interest savings analysis.',
      keywords: 'debt payoff calculator, debt snowball, debt avalanche, debt elimination, debt management, financial freedom calculator'
    },
    'retirement-calculator': {
      description: 'Plan retirement with detailed projections, inflation adjustments, and multiple scenario analysis. Social Security integration and withdrawal strategy optimization.',
      keywords: 'retirement calculator, retirement planning, 401k calculator, retirement savings, pension calculator, financial independence calculator'
    },
    'budget-planner': {
      description: 'Create comprehensive budgets with 50/30/20 rule, expense tracking, and goal setting. Smart budget recommendations and spending analysis.',
      keywords: 'budget planner, budget calculator, 50/30/20 rule, expense tracker, personal budget, money management, financial budget'
    },
    'emergency-fund-calculator': {
      description: 'Calculate ideal emergency fund size based on expenses and risk factors. Savings goal planning with timeline projections and contribution strategies.',
      keywords: 'emergency fund calculator, emergency savings, financial safety net, savings calculator, emergency planning, financial security'
    },
    'salary-negotiation-calculator': {
      description: 'Calculate salary increases, benefits value, and total compensation packages for better negotiations. Market rate analysis and negotiation strategies.',
      keywords: 'salary negotiation, salary calculator, compensation calculator, raise calculator, benefits calculator, salary increase'
    },
    'break-even-analyzer': {
      description: 'Calculate break-even points, margin of safety, and profitability analysis for business planning. Scenario modeling and pricing optimization.',
      keywords: 'break even analysis, break even calculator, business planning, profit analysis, cost analysis, pricing calculator'
    },

    // Education Tools
    'math-problem-solver': {
      description: 'Solve complex mathematical equations with step-by-step solutions using AI. Algebra, calculus, geometry, and statistics problem solver with detailed explanations.',
      keywords: 'math solver, equation solver, algebra calculator, calculus solver, math problem solver, step by step math, ai math tutor'
    },
    'citation-generator': {
      description: 'Generate perfect academic citations in APA, MLA, Chicago, and Harvard formats with AI-powered source analysis',
      keywords: 'citations, apa, mla, chicago, harvard, bibliography generator, research'
    },
    'study-planner': {
      description: 'Organize study sessions, track progress, and set academic goals. Smart study planner with scheduling, reminders, and productivity tracking.',
      keywords: 'study planner, study schedule, academic planner, student organizer, study tracker, education planner'
    },
    'vocabulary-builder': {
      description: 'Build vocabulary with spaced repetition learning, etymology insights, and pronunciation guides. Interactive word games and progress tracking for language learners.',
      keywords: 'vocabulary builder, vocabulary learning, spaced repetition, word learning, language learning, vocabulary trainer, english vocabulary'
    },
    'formula-reference': {
      description: 'Comprehensive database of mathematical, physics, and chemistry formulas with interactive examples and calculations. Quick reference for students and professionals.',
      keywords: 'formula reference, math formulas, physics formulas, chemistry formulas, scientific formulas, equation reference, formula calculator'
    }
  };

  return toolMetas[toolId] || generateFallbackMeta(toolId, toolName, baseDescription);
};

// Systematic approach for better fallback meta descriptions
const generateFallbackMeta = (toolId: string, toolName: string, baseDescription: string) => {
  // Extract category-specific keywords and descriptions based on tool name patterns
  const categoryKeywords: Record<string, string[]> = {
    development: ['developer tools', 'programming', 'coding', 'web development', 'software development'],
    design: ['design tools', 'creative', 'graphics', 'ui design', 'visual design'],
    marketing: ['marketing tools', 'seo', 'digital marketing', 'social media', 'advertising'],
    productivity: ['productivity tools', 'efficiency', 'workflow', 'organization', 'time management'],
    finance: ['financial calculator', 'money management', 'financial planning', 'investment', 'budgeting'],
    utility: ['utility tools', 'converter', 'generator', 'online tools', 'web utilities'],
    education: ['educational tools', 'learning', 'study tools', 'academic', 'student resources'],
    health: ['health tools', 'wellness', 'fitness', 'medical calculator', 'health planning']
  };

  // Detect tool type and generate appropriate keywords
  const toolType = detectToolType(toolId, toolName);
  const categoryKeys = categoryKeywords[toolType] || ['online tools', 'web tools', 'free tools'];
  
  // Enhanced description based on common tool patterns
  let enhancedDescription = baseDescription;
  
  // Add value propositions based on tool type
  if (toolId.includes('calculator')) {
    enhancedDescription += ' Free online calculator with instant results and detailed analysis.';
  } else if (toolId.includes('generator')) {
    enhancedDescription += ' Generate results instantly with our free online tool.';
  } else if (toolId.includes('converter')) {
    enhancedDescription += ' Convert between formats quickly and accurately online.';
  } else if (toolId.includes('analyzer') || toolId.includes('checker')) {
    enhancedDescription += ' Analyze and get detailed insights with our advanced online tool.';
  }
  
  // Add common benefits
  enhancedDescription += ' No signup required, works in your browser.';
  
  const toolKeywords = [
    toolName.toLowerCase().replace(/[^a-z0-9\s]/g, ''),
    ...categoryKeys,
    'free online tool',
    'web tool',
    'no signup required'
  ];

  return {
    description: enhancedDescription,
    keywords: toolKeywords.join(', ')
  };
};

// Helper function to detect tool category from ID and name
const detectToolType = (toolId: string, toolName: string): string => {
  const text = `${toolId} ${toolName}`.toLowerCase();
  
  if (text.match(/calculator|finance|loan|investment|budget|salary|debt|mortgage|retirement/)) return 'finance';
  if (text.match(/json|html|css|js|sql|regex|code|dev|api|jwt|cron|uuid/)) return 'development';
  if (text.match(/color|image|gradient|favicon|design|palette|creative/)) return 'design';
  if (text.match(/seo|meta|utm|social|email|marketing|campaign|analytics/)) return 'marketing';
  if (text.match(/word|text|markdown|pdf|study|citation|vocab|formula|math/)) return 'education';
  if (text.match(/counter|diff|lorem|planner|organizer|productivity/)) return 'productivity';
  if (text.match(/health|fitness|medical|wellness/)) return 'health';
  
  return 'utility';
};

interface CategoryData {
  category?: {
    id: string;
    name: string;
    description: string;
  };
}

interface ToolData {
  tool?: {
    id: string;
    name: string;
    description: string;
  };
}

type PageData = CategoryData | ToolData | Record<string, unknown>;

// Pre-defined meta data for different page types
export const getPageMeta = (pageType: string, data?: PageData): MetaData => {
  const baseUrl = 'https://neuralstock.ai';
  
  switch (pageType) {
    case 'home':
      return {
        title: 'NeuralStock.ai | Free AI Tools & Utilities | No Signup Required',
        description: 'Access 50+ free AI-powered tools instantly. Text generators, calculators, converters, and productivity tools. No registration needed.',
        keywords: 'free AI tools, online utilities, text generator, calculator, converter, productivity tools, no signup',
        canonical: baseUrl,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'categories':
      return {
        title: 'Tool Categories | Browse AI Tools by Category | NeuralStock.ai',
        description: 'Explore AI tools organized by categories: Development, Design, Marketing, Finance, Education, Health, and more. Find the perfect tool for your needs.',
        keywords: 'tool categories, AI tools by category, organized tools, development tools, design tools, marketing tools',
        canonical: `${baseUrl}/categories`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'category': {
      const categoryData = data as CategoryData;
      const categoryName = categoryData?.category?.name || 'Category';
      const categoryDescription = categoryData?.category?.description || `Explore ${categoryName} tools`;
      const categoryId = categoryData?.category?.id || 'category';
      return {
        title: `${categoryName} AI Tools | Free ${categoryName} Tools | NeuralStock.ai`,
        description: `${categoryDescription}. Access powerful ${categoryName.toLowerCase()} tools powered by AI. Free to use, no signup required.`,
        keywords: `${categoryName.toLowerCase()} tools, AI ${categoryName.toLowerCase()}, free ${categoryName.toLowerCase()} tools`,
        canonical: `${baseUrl}/category/${categoryId}`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };
    }

    case 'tool': {
      const toolData = data as ToolData;
      const toolName = toolData?.tool?.name || 'Tool';
      const toolId = toolData?.tool?.id || 'tool';
      const baseDescription = toolData?.tool?.description || `Use our ${toolName} tool`;
      
      // Get tool-specific optimized meta data
      const toolMeta = getToolSpecificMeta(toolId, toolName, baseDescription);
      
      return {
        title: `${toolName} | Free AI-Powered Tool | NeuralStock.ai`,
        description: toolMeta.description,
        keywords: toolMeta.keywords,
        canonical: `${baseUrl}/tool/${toolId}`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };
    }

    case 'search':
      return {
        title: 'Search AI Tools | Find Perfect Tools for Your Needs | NeuralStock.ai',
        description: 'Search through 1000+ AI-powered tools to find exactly what you need. Filter by category, features, and more to discover the perfect tool.',
        keywords: 'search tools, find AI tools, tool search, discover tools',
        canonical: `${baseUrl}/search`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'about':
      return {
        title: 'About NeuralStock.ai | The Future of AI-Powered Productivity',
        description: 'Learn about NeuralStock.ai, your go-to platform for 1000+ AI-powered tools. Discover our mission to democratize AI technology and boost productivity.',
        keywords: 'about neuralstock, AI platform, productivity tools, AI technology, artificial intelligence',
        canonical: `${baseUrl}/about`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'contact':
      return {
        title: 'Contact Us | Get Help with AI Tools | NeuralStock.ai',
        description: 'Get in touch with our support team for help with AI-powered tools, feature requests, or technical support. Multiple ways to reach us.',
        keywords: 'contact support, help, customer service, technical support, AI tools help',
        canonical: `${baseUrl}/contact`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'privacy':
      return {
        title: 'Privacy Policy | NeuralStock.ai',
        description: 'Read our privacy policy to understand how we protect your data and respect your privacy while using our AI-powered tools.',
        keywords: 'privacy policy, data protection, user privacy',
        canonical: `${baseUrl}/privacy-policy`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'cookies':
      return {
        title: 'Cookie Policy | NeuralStock.ai',
        description: 'Learn about our cookie usage and how we use cookies to improve your experience on our AI tools platform.',
        keywords: 'cookie policy, cookies usage, website cookies',
        canonical: `${baseUrl}/cookie-policy`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    case 'partnership':
      return {
        title: 'Partnership & Media Kit | NeuralStock.ai',
        description: 'Partner with NeuralStock.ai and access our media kit. Join our affiliate program and help promote AI-powered productivity tools.',
        keywords: 'partnership, affiliate program, media kit, collaboration',
        canonical: `${baseUrl}/partnership`,
        ogImage: `${baseUrl}/opengraph-image.png`
      };

    default:
      return {
        title: 'NeuralStock.ai - AI-Powered Tools',
        description: 'Access powerful AI tools for productivity, development, design, and more.',
        canonical: baseUrl,
        ogImage: `${baseUrl}/opengraph-image.png`
      };
  }
};
