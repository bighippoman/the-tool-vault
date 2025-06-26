import { Tool } from '../types/tool';

// Only include tools that have actual component implementations
export const implementedTools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter, Validator and Fixer',
    description: 'Intelligently repair, format, validate, and transform your JSON data with advanced AI capabilities',
    category: 'development',
    path: '/tool/json-formatter',
    isPopular: true,
    tags: ['json', 'formatter', 'validator', 'developer', 'ai', 'repair', 'transform']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure, random passwords based on your requirements',
    category: 'utility',
    path: '/tool/password-generator',
    isPopular: true,
    tags: ['password', 'security', 'generator']
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL and more',
    category: 'design',
    path: '/tool/color-converter',
    isPopular: true,
    tags: ['color', 'converter', 'design', 'hex', 'rgb', 'hsl']
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and paragraphs in your text',
    category: 'productivity',
    path: '/tool/word-counter',
    isPopular: true,
    tags: ['text', 'counter', 'words', 'characters']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress and optimize your images for the web',
    category: 'design',
    path: '/tool/image-compressor',
    isPopular: true,
    tags: ['image', 'compression', 'optimizer']
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview markdown with real-time rendering',
    category: 'productivity',
    path: '/tool/markdown-editor',
    isPopular: true,
    tags: ['markdown', 'editor', 'text']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs for safe transmission',
    category: 'development',
    path: '/tool/url-encoder',
    isPopular: true,
    tags: ['url', 'encoder', 'decoder']
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Convert text to Base64 and decode Base64 to text',
    category: 'development',
    path: '/tool/base64',
    isPopular: true,
    tags: ['base64', 'encoder', 'decoder']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'utility',
    path: '/tool/unit-converter',
    isNew: true,
    tags: ['converter', 'units', 'measurement']
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, or contact information',
    category: 'marketing',
    path: '/tool/qr-generator',
    isNew: true,
    tags: ['qr code', 'generator', 'marketing']
  },
  {
    id: 'html-entity',
    name: 'HTML Entity Encoder/Decoder',
    description: 'Convert characters to HTML entities and vice versa',
    category: 'development',
    path: '/tool/html-entity',
    tags: ['html', 'entity', 'encoder', 'decoder']
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different letter cases',
    category: 'productivity',
    path: '/tool/case-converter',
    tags: ['text', 'case', 'converter']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and other hash values',
    category: 'development',
    path: '/tool/hash-generator',
    isNew: true,
    tags: ['hash', 'md5', 'sha', 'encryption', 'security']
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and development',
    category: 'development',
    path: '/tool/lorem-generator',
    tags: ['lorem', 'placeholder', 'text', 'design']
  },
  {
    id: 'diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare two texts and highlight differences',
    category: 'productivity',
    path: '/tool/diff-checker',
    tags: ['diff', 'compare', 'text', 'changes']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with live matching',
    category: 'development',
    path: '/tool/regex-tester',
    isPopular: true,
    tags: ['regex', 'regexp', 'pattern', 'testing']
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier & Formatter',
    description: 'Minify and beautify CSS code with advanced optimization',
    category: 'development',
    path: '/tool/css-minifier',
    isNew: true,
    tags: ['css', 'minifier', 'formatter', 'optimizer', 'web']
  },
  {
    id: 'js-minifier',
    name: 'JavaScript Minifier & Beautifier',
    description: 'Minify and format JavaScript code with error detection',
    category: 'development',
    path: '/tool/js-minifier',
    isNew: true,
    tags: ['javascript', 'minifier', 'beautifier', 'formatter', 'optimizer']
  },
  {
    id: 'gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Create stunning CSS gradients with live preview and export options',
    category: 'design',
    path: '/tool/gradient-generator',
    isNew: true,
    tags: ['gradient', 'css', 'design', 'colors', 'web']
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps, dates, and time zones',
    category: 'utility',
    path: '/tool/timestamp-converter',
    isNew: true,
    tags: ['timestamp', 'unix', 'date', 'time', 'converter']
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs/GUIDs in multiple formats with bulk generation',
    category: 'development',
    path: '/tool/uuid-generator',
    isNew: true,
    tags: ['uuid', 'guid', 'generator', 'unique', 'identifier']
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter & Validator',
    description: 'Format and validate SQL queries with syntax highlighting',
    category: 'development',
    path: '/tool/sql-formatter',
    isNew: true,
    tags: ['sql', 'formatter', 'validator', 'database', 'query']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Token Decoder',
    description: 'Decode and validate JSON Web Tokens (JWT) with detailed analysis',
    category: 'development',
    path: '/tool/jwt-decoder',
    isNew: true,
    tags: ['jwt', 'token', 'decoder', 'json', 'authentication']
  },
  {
    id: 'cron-generator',
    name: 'Cron Expression Generator',
    description: 'Generate and validate cron expressions with human-readable descriptions',
    category: 'development',
    path: '/tool/cron-generator',
    isNew: true,
    tags: ['cron', 'scheduler', 'expression', 'generator', 'automation']
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    description: 'Generate favicons in multiple sizes and formats from any image',
    category: 'design',
    path: '/tool/favicon-generator',
    isNew: true,
    tags: ['favicon', 'icon', 'generator', 'web', 'design']
  },
  {
    id: 'email-signature-generator',
    name: 'Professional Email Signature Generator',
    description: 'Create stunning, responsive email signatures with social links and branding',
    category: 'marketing',
    path: '/tool/email-signature-generator',
    isNew: true,
    tags: ['email signature', 'professional', 'branding', 'responsive', 'html']
  },
  {
    id: 'utm-builder',
    name: 'Advanced UTM Campaign Builder',
    description: 'Build, track, and analyze UTM parameters for precise campaign attribution',
    category: 'marketing',
    path: '/tool/utm-builder',
    isNew: true,
    isPopular: true,
    tags: ['utm', 'campaign tracking', 'analytics', 'attribution', 'google analytics']
  },
  {
    id: 'meta-tag-generator',
    name: 'SEO Meta Tags Generator',
    description: 'Generate optimized meta tags, Open Graph, and Twitter Cards for maximum SEO impact',
    category: 'marketing',
    path: '/tool/meta-tag-generator',
    isNew: true,
    isPopular: true,
    tags: ['seo', 'meta tags', 'open graph', 'twitter cards', 'optimization']
  },
  {
    id: 'social-media-caption-generator',
    name: 'AI Social Media Caption Generator',
    description: 'Generate engaging captions for Instagram, Facebook, LinkedIn with hashtag suggestions',
    category: 'marketing',
    path: '/tool/social-media-caption-generator',
    isNew: true,
    isPopular: true,
    tags: ['social media', 'captions', 'ai generator', 'hashtags', 'engagement']
  },
  {
    id: 'email-subject-tester',
    name: 'Email Subject Line Tester',
    description: 'Test and optimize email subject lines for maximum open rates with A/B insights',
    category: 'marketing',
    path: '/tool/email-subject-tester',
    isNew: true,
    tags: ['email marketing', 'subject lines', 'open rates', 'a/b testing', 'optimization']
  },
  {
    id: 'brand-color-palette-generator',
    name: 'Brand Color Palette Generator',
    description: 'Generate professional brand color palettes with accessibility and psychology insights',
    category: 'marketing',
    path: '/tool/brand-color-palette-generator',
    isNew: true,
    tags: ['brand colors', 'color palette', 'branding', 'accessibility', 'psychology']
  },
  {
    id: 'content-optimizer',
    name: 'AI Content Optimizer',
    description: 'Analyze and optimize your content for SEO, readability, engagement, and quality using AI',
    category: 'marketing',
    path: '/tool/content-optimizer',
    isNew: true,
    isPopular: true,
    tags: ['content optimization', 'ai analysis', 'seo', 'readability', 'engagement', 'quality']
  },
  {
    id: 'terms-analyzer',
    name: 'Comprehensive Terms Analyzer',
    description: 'Transform complex legal documents into digestible summaries with AI-powered danger flags and plain-language explanations',
    category: 'utility',
    path: '/tool/terms-analyzer',
    isNew: true,
    isPopular: true,
    tags: ['terms of service', 'privacy policy', 'legal', 'ai analysis', 'danger flags', 'plain language', 'accessibility']
  },
  {
    id: 'investment-calculator',
    name: 'Advanced Investment Calculator',
    description: 'Calculate compound interest, portfolio returns, retirement planning with detailed projections',
    category: 'finance',
    path: '/tool/investment-calculator',
    isNew: true,
    isPopular: true,
    tags: ['investment', 'compound interest', 'portfolio', 'retirement', 'financial planning', 'calculator']
  },
  {
    id: 'loan-calculator',
    name: 'Comprehensive Loan Calculator',
    description: 'Calculate mortgages, auto loans, personal loans with amortization schedules and comparison tools',
    category: 'finance',
    path: '/tool/loan-calculator',
    isNew: true,
    tags: ['loan', 'mortgage', 'amortization', 'interest', 'payment calculator', 'finance']
  },
  {
    id: 'mortgage-affordability-calculator',
    name: 'Mortgage Affordability Calculator',
    description: 'Determine how much house you can afford with detailed affordability analysis and recommendations',
    category: 'finance',
    path: '/tool/mortgage-affordability-calculator',
    isNew: true,
    isPopular: true,
    tags: ['mortgage', 'affordability', 'home buying', 'real estate', 'debt-to-income', 'finance']
  },
  {
    id: 'debt-payoff-calculator',
    name: 'Smart Debt Payoff Calculator',
    description: 'Create optimized debt payoff strategies using snowball and avalanche methods with visual progress tracking',
    category: 'finance',
    path: '/tool/debt-payoff-calculator',
    isNew: true,
    isPopular: true,
    tags: ['debt payoff', 'snowball method', 'avalanche method', 'debt management', 'financial planning']
  },
  {
    id: 'retirement-calculator',
    name: 'Advanced Retirement Calculator',
    description: 'Plan your retirement with detailed projections, inflation adjustments, and multiple scenario analysis',
    category: 'finance',
    path: '/tool/retirement-calculator',
    isNew: true,
    isPopular: true,
    tags: ['retirement planning', 'savings calculator', 'inflation', 'pension', 'financial independence']
  },
  {
    id: 'budget-planner',
    name: 'Smart Budget Planner',
    description: 'Create comprehensive budgets with the 50/30/20 rule, expense tracking, and goal setting',
    category: 'finance',
    path: '/tool/budget-planner',
    isNew: true,
    isPopular: true,
    tags: ['budgeting', '50/30/20 rule', 'expense tracking', 'financial goals', 'money management']
  },
  {
    id: 'emergency-fund-calculator',
    name: 'Emergency Fund Calculator',
    description: 'Calculate your ideal emergency fund size and create a savings plan to reach your goal',
    category: 'finance',
    path: '/tool/emergency-fund-calculator',
    isNew: true,
    tags: ['emergency fund', 'savings calculator', 'financial security', 'goal setting', 'personal finance']
  },
  {
    id: 'salary-negotiation-calculator',
    name: 'Salary Negotiation Calculator',
    description: 'Calculate salary increases, benefits value, and total compensation packages for better negotiations',
    category: 'finance',
    path: '/tool/salary-negotiation-calculator',
    isNew: true,
    tags: ['salary negotiation', 'compensation', 'benefits calculator', 'career', 'income planning']
  },
  {
    id: 'options-profit-calculator',
    name: 'Options Profit & Risk Calculator',
    description: 'Calculate options strategies profits, losses, and Greeks with interactive profit/loss charts and risk analysis',
    category: 'finance',
    path: '/tool/options-profit-calculator',
    isNew: true,
    isPopular: true,
    tags: ['options trading', 'profit calculator', 'greeks', 'risk analysis', 'derivatives', 'trading']
  },
  {
    id: 'break-even-analyzer',
    name: 'Break-Even Analysis Calculator',
    description: 'Calculate break-even points, margin of safety, and scenario analysis for business planning and pricing',
    category: 'finance',
    path: '/tool/break-even-analyzer',
    isNew: true,
    tags: ['break even', 'margin of safety', 'business planning', 'pricing', 'cost analysis', 'profitability']
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Generate stunning images from text descriptions using OpenAI\'s advanced image generation model',
    category: 'design',
    path: '/tool/ai-image-generator',
    isNew: true,
    isPopular: true,
    tags: ['ai', 'image generation', 'creative', 'design', 'art']
  },
  {
    id: 'math-problem-solver',
    name: 'Advanced Math Problem Solver',
    description: 'Solve complex mathematical equations with step-by-step solutions, graphing, and AI explanations',
    category: 'education',
    path: '/tool/math-problem-solver',
    isNew: true,
    isPopular: true,
    tags: ['math solver', 'equations', 'step-by-step', 'graphing', 'calculus', 'algebra']
  },
  {
    id: 'citation-generator',
    name: 'Academic Citation Generator',
    description: 'Generate perfect citations in APA, MLA, Chicago, and Harvard formats with AI-powered source analysis',
    category: 'education',
    path: '/tool/citation-generator',
    isNew: true,
    isPopular: true,
    tags: ['citations', 'apa', 'mla', 'chicago', 'harvard', 'bibliography', 'research']
  },
  {
    id: 'study-planner',
    name: 'Smart Study Planner',
    description: 'Organize your study sessions, set priorities, and track your progress',
    category: 'education',
    path: '/tool/study-planner',
    isNew: true,
    tags: ['study', 'planner', 'education', 'schedule', 'productivity']
  },
  {
    id: 'vocabulary-builder',
    name: 'Smart Vocabulary Builder',
    description: 'Build vocabulary with spaced repetition, etymology, pronunciation guides, and interactive games',
    category: 'education',
    path: '/tool/vocabulary-builder',
    isNew: true,
    tags: ['vocabulary', 'spaced repetition', 'etymology', 'pronunciation', 'language learning']
  },
  {
    id: 'formula-reference',
    name: 'Interactive Formula Reference Guide',
    description: 'Comprehensive database of mathematical, physics, and chemistry formulas with interactive examples',
    category: 'education',
    path: '/tool/formula-reference',
    isNew: true,
    tags: ['formula reference', 'mathematics', 'physics', 'chemistry', 'interactive examples']
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Compress PDF files to reduce size while maintaining quality for web upload and email sharing',
    category: 'productivity',
    path: '/tool/pdf-compressor',
    isNew: true,
    isPopular: true,
    tags: ['pdf compression', 'file size reduction', 'document optimization', 'web upload', 'email sharing']
  },
  {
    id: 'persona-simulator',
    name: 'Persona Simulator',
    description: 'Have realistic conversations with historical figures and notable personas using AI',
    category: 'chatbots',
    path: '/tool/persona-simulator',
    isNew: true,
    isPopular: true,
    tags: ['ai chat', 'personas', 'historical figures', 'conversation', 'roleplay']
  }
];

export const getAllTools = (): Tool[] => {
  return implementedTools;
};

export const getToolsByCategory = (category: string): Tool[] => {
  return implementedTools.filter(tool => tool.category === category);
};

export const getToolById = (id: string): Tool | undefined => {
  return implementedTools.find(tool => tool.id === id);
};

export const getPopularTools = (limit: number = 8): Tool[] => {
  return implementedTools
    .filter(tool => tool.isPopular)
    .slice(0, limit);
};

export const getNewTools = (limit: number = 8): Tool[] => {
  return implementedTools
    .filter(tool => tool.isNew)
    .slice(0, limit);
};

export const searchTools = (query: string): Tool[] => {
  const searchTerm = query.toLowerCase();
  return implementedTools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm) || 
    tool.description.toLowerCase().includes(searchTerm) ||
    (tool.tags && tool.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
  );
};

// Keep the legacy exports for backward compatibility
export const popularTools = implementedTools.filter(tool => tool.isPopular);
export const generateTools = getAllTools;
