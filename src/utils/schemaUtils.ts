interface BaseSchema {
  "@context": string;
  "@type": string;
}

interface SoftwareApplicationSchema extends BaseSchema {
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  browserRequirements?: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  url: string;
  featureList?: string[];
  screenshot?: string;
  softwareVersion?: string;
  releaseNotes?: string;
}

interface WebSiteSchema extends BaseSchema {
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

interface OrganizationSchema extends BaseSchema {
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo: {
    "@type": "ImageObject";
    url: string;
  };
  sameAs: string[];
  foundingDate: string;
  numberOfEmployees: string;
  slogan: string;
}

interface ItemListSchema extends BaseSchema {
  "@type": "ItemList";
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: {
      "@type": "SoftwareApplication";
      name: string;
      description: string;
      url: string;
    };
  }>;
}

interface BreadcrumbListSchema extends BaseSchema {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: {
      "@type": "WebPage";
      "@id": string;
      name: string;
      url: string;
    };
  }>;
}

interface Tool {
  id: string;
  name: string;
  description: string;
}

// Tool-specific schema configurations
const getToolSpecificSchema = (toolId: string, toolName: string): Partial<SoftwareApplicationSchema> => {
  
  const toolConfigs: Record<string, Partial<SoftwareApplicationSchema>> = {
    // Development Tools
    'json-formatter': {
      applicationCategory: "DeveloperApplication",
      featureList: ["JSON formatting", "JSON validation", "AI-powered JSON repair", "Syntax highlighting", "Error detection", "Format conversion", "Minification", "Enterprise validation"],
      softwareVersion: "2.0"
    },
    'password-generator': {
      applicationCategory: "SecurityApplication", 
      featureList: ["Strong password generation", "Customizable length", "Character set options", "Security analysis", "Bulk generation"],
      softwareVersion: "1.5"
    },
    'html-entity': {
      applicationCategory: "DeveloperApplication",
      featureList: ["HTML entity encoding", "HTML entity decoding", "Special character conversion", "Unicode support"],
      softwareVersion: "1.2"
    },
    'base64': {
      applicationCategory: "DeveloperApplication", 
      featureList: ["Base64 encoding", "Base64 decoding", "File encoding", "Text encoding", "Binary data support"],
      softwareVersion: "1.3"
    },
    'url-encoder': {
      applicationCategory: "DeveloperApplication",
      featureList: ["URL encoding", "URL decoding", "Percent encoding", "Query parameter encoding"],
      softwareVersion: "1.1"
    },
    'case-converter': {
      applicationCategory: "TextApplication",
      featureList: ["Case conversion", "camelCase", "snake_case", "kebab-case", "Title Case", "UPPER CASE"],
      softwareVersion: "1.4"
    },
    'hash-generator': {
      applicationCategory: "SecurityApplication",
      featureList: ["MD5 hashing", "SHA-256 hashing", "SHA-512 hashing", "File hashing", "Text hashing"],
      softwareVersion: "2.1"
    },
    'regex-tester': {
      applicationCategory: "DeveloperApplication",
      featureList: ["Regular expression testing", "Pattern matching", "Match groups", "Syntax highlighting", "Common patterns"],
      softwareVersion: "1.6"
    },
    'css-minifier': {
      applicationCategory: "DeveloperApplication",
      featureList: ["CSS minification", "CSS compression", "Code optimization", "File size reduction"],
      softwareVersion: "1.3"
    },
    'js-minifier': {
      applicationCategory: "DeveloperApplication", 
      featureList: ["JavaScript minification", "Code compression", "Variable renaming", "Dead code removal"],
      softwareVersion: "1.4"
    },
    'sql-formatter': {
      applicationCategory: "DeveloperApplication",
      featureList: ["SQL formatting", "Query beautification", "Multiple SQL dialects", "Syntax highlighting"],
      softwareVersion: "1.2"
    },
    'jwt-decoder': {
      applicationCategory: "SecurityApplication",
      featureList: ["JWT token decoding", "Header analysis", "Payload inspection", "Signature verification"],
      softwareVersion: "1.1"
    },
    'cron-generator': {
      applicationCategory: "DeveloperApplication",
      featureList: ["Cron expression generation", "Schedule visualization", "Human-readable descriptions", "Validation"],
      softwareVersion: "1.3"
    },
    'uuid-generator': {
      applicationCategory: "DeveloperApplication",
      featureList: ["UUID generation", "Multiple UUID versions", "Bulk generation", "Format validation"],
      softwareVersion: "1.2"
    },
    'timestamp-converter': {
      applicationCategory: "DeveloperApplication",
      featureList: ["Unix timestamp conversion", "Date formatting", "Timezone support", "Batch conversion"],
      softwareVersion: "1.4"
    },

    // Design & Creative Tools
    'color-converter': {
      applicationCategory: "DesignApplication",
      featureList: ["Color format conversion", "HEX to RGB", "RGB to HSL", "Color picker", "Palette generation"],
      softwareVersion: "2.0"
    },
    'gradient-generator': {
      applicationCategory: "DesignApplication",
      featureList: ["CSS gradients", "Linear gradients", "Radial gradients", "Color picker", "Live preview"],
      softwareVersion: "1.5"
    },
    'favicon-generator': {
      applicationCategory: "DesignApplication",
      featureList: ["Favicon creation", "Multiple sizes", "ICO format", "PNG format", "Perfect scaling"],
      softwareVersion: "1.3"
    },
    'image-compressor': {
      applicationCategory: "MultimediaApplication",
      featureList: ["Image compression", "Quality optimization", "Batch processing", "Format support", "Size reduction"],
      softwareVersion: "2.1"
    },
    'ai-image-generator': {
      applicationCategory: "MultimediaApplication",
      featureList: ["AI image generation", "Text to image", "Multiple styles", "High resolution", "Commercial use"],
      softwareVersion: "3.0"
    },

    // Productivity Tools
    'word-counter': {
      applicationCategory: "OfficeApplication",
      featureList: ["Word counting", "Character counting", "Reading time", "Paragraph analysis", "Statistics"],
      softwareVersion: "1.2"
    },
    'markdown-editor': {
      applicationCategory: "OfficeApplication",
      featureList: ["Markdown editing", "Live preview", "Syntax highlighting", "Export options", "GitHub flavored"],
      softwareVersion: "2.0"
    },
    'diff-checker': {
      applicationCategory: "OfficeApplication",
      featureList: ["Text comparison", "Side-by-side diff", "Syntax highlighting", "Merge options", "Export results"],
      softwareVersion: "1.4"
    },
    'lorem-generator': {
      applicationCategory: "OfficeApplication",
      featureList: ["Lorem ipsum generation", "Custom length", "Paragraph control", "Word control", "Multiple formats"],
      softwareVersion: "1.1"
    },
    'pdf-compressor': {
      applicationCategory: "OfficeApplication",
      featureList: ["PDF compression", "Quality optimization", "Size reduction", "Batch processing", "Privacy focused"],
      softwareVersion: "1.3"
    },

    // Marketing Tools
    'meta-tag-generator': {
      applicationCategory: "MarketingApplication",
      featureList: ["SEO meta tags", "Open Graph tags", "Twitter Cards", "Social media optimization", "Preview"],
      softwareVersion: "1.5"
    },
    'utm-builder': {
      applicationCategory: "MarketingApplication",
      featureList: ["UTM parameter building", "Campaign tracking", "Google Analytics", "Link management", "Reports"],
      softwareVersion: "1.3"
    },
    'qr-generator': {
      applicationCategory: "MarketingApplication",
      featureList: ["QR code generation", "Custom design", "Logo embedding", "Multiple formats", "High resolution"],
      softwareVersion: "2.0"
    },
    'email-signature-generator': {
      applicationCategory: "MarketingApplication",
      featureList: ["Professional signatures", "HTML email", "Social links", "Contact info", "Responsive design"],
      softwareVersion: "1.4"
    },
    'social-media-caption-generator': {
      applicationCategory: "MarketingApplication",
      featureList: ["AI caption generation", "Hashtag suggestions", "Platform optimization", "Engagement analysis", "Multiple platforms"],
      softwareVersion: "2.1"
    },
    'email-subject-tester': {
      applicationCategory: "MarketingApplication", 
      featureList: ["Subject line testing", "Spam score analysis", "Open rate prediction", "A/B testing", "Optimization tips"],
      softwareVersion: "1.2"
    },
    'brand-color-palette-generator': {
      applicationCategory: "MarketingApplication",
      featureList: ["Brand color palettes", "Color harmony", "Accessibility checks", "Psychology insights", "Export options"],
      softwareVersion: "1.6"
    },
    'content-optimizer': {
      applicationCategory: "MarketingApplication",
      featureList: ["SEO optimization", "Readability analysis", "Keyword density", "Content scoring", "AI suggestions"],
      softwareVersion: "2.2"
    },

    // Utility Tools
    'terms-analyzer': {
      applicationCategory: "BusinessApplication",
      featureList: ["Legal document analysis", "Privacy policy review", "Terms of service analysis", "Risk assessment", "Plain language"],
      softwareVersion: "1.1"
    },

    // Finance Tools
    'investment-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Investment projections", "Compound interest", "Return analysis", "Chart visualization", "Scenario planning"],
      softwareVersion: "2.0"
    },
    'loan-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Loan payments", "Amortization schedule", "Interest calculation", "Payment breakdown", "Early payoff"],
      softwareVersion: "1.5"
    },
    'mortgage-affordability-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Home affordability", "Income analysis", "Debt-to-income ratio", "Down payment planning", "Market conditions"],
      softwareVersion: "1.7"
    },
    'debt-payoff-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Debt elimination", "Snowball method", "Avalanche method", "Payment optimization", "Interest savings"],
      softwareVersion: "1.4"
    },
    'retirement-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Retirement planning", "401k projections", "Social Security", "Withdrawal strategies", "Inflation adjustment"],
      softwareVersion: "2.1"
    },
    'budget-planner': {
      applicationCategory: "FinanceApplication",
      featureList: ["Budget creation", "50/30/20 rule", "Expense tracking", "Goal setting", "Spending analysis"],
      softwareVersion: "1.6"
    },
    'emergency-fund-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Emergency fund planning", "Savings goals", "Timeline projections", "Risk assessment", "Contribution strategies"],
      softwareVersion: "1.2"
    },
    'salary-negotiation-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Salary analysis", "Market rates", "Benefits valuation", "Negotiation strategies", "Total compensation"],
      softwareVersion: "1.3"
    },
    'options-profit-calculator': {
      applicationCategory: "FinanceApplication",
      featureList: ["Options trading", "Profit/loss calculation", "Risk analysis", "Greeks calculation", "Strategy comparison"],
      softwareVersion: "1.1"
    },

    // Education Tools
    'math-problem-solver': {
      applicationCategory: "EducationApplication",
      featureList: ["Math problem solving", "Step-by-step solutions", "Multiple subjects", "AI explanations", "Learning support"],
      softwareVersion: "2.0"
    },
    'citation-generator': {
      applicationCategory: "EducationApplication",
      featureList: ["Academic citations", "APA format", "MLA format", "Chicago style", "Bibliography generation"],
      softwareVersion: "1.5"
    },
    'study-planner': {
      applicationCategory: "EducationApplication",
      featureList: ["Study scheduling", "Goal tracking", "Progress monitoring", "Reminder system", "Performance analytics"],
      softwareVersion: "1.4"
    },
    'vocabulary-builder': {
      applicationCategory: "EducationApplication",
      featureList: ["Vocabulary learning", "Spaced repetition", "Etymology insights", "Progress tracking", "Word games"],
      softwareVersion: "1.3"
    },
    'formula-reference': {
      applicationCategory: "EducationApplication",
      featureList: ["Formula database", "Math formulas", "Physics formulas", "Chemistry formulas", "Interactive examples"],
      softwareVersion: "1.2"
    }
  };

  const config = toolConfigs[toolId] || {
    applicationCategory: "WebApplication",
    featureList: [toolName, "Free online tool", "Web-based", "No download required"],
    softwareVersion: "1.0"
  };

  return {
    ...config,
    browserRequirements: "Requires JavaScript and modern web browser"
  };
};

export const generateToolSchema = (toolId: string, toolName: string, description: string): SoftwareApplicationSchema => {
  const toolConfig = getToolSpecificSchema(toolId, toolName);
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description: description,
    applicationCategory: toolConfig.applicationCategory || "WebApplication",
    operatingSystem: "Web Browser",
    browserRequirements: toolConfig.browserRequirements || "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    provider: {
      "@type": "Organization", 
      name: "NeuralStock.ai",
      url: "https://neuralstock.ai"
    },
    url: `https://neuralstock.ai/tool/${toolId}`,
    featureList: toolConfig.featureList || [toolName, "Free online tool"],
    softwareVersion: toolConfig.softwareVersion || "1.0",
    screenshot: `https://neuralstock.ai/opengraph-image.png`
  };
};

export const generateHomepageSchema = (): [WebSiteSchema, OrganizationSchema] => {
  const baseUrl = 'https://neuralstock.ai';
  
  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NeuralStock.ai - AI-Powered Tools",
    description: "Access over 1000 AI-powered tools for developers, designers, marketers and more. Free to use, no signup required.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "NeuralStock.ai",
      url: baseUrl
    }
  };

  const organizationSchema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NeuralStock.ai",
    description: "Leading platform for AI-powered productivity tools and utilities",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/opengraph-image.png`
    },
    sameAs: [
      "https://x.com/neuralstock",
      "https://www.linkedin.com/company/106520467/"
    ],
    foundingDate: "2024",
    numberOfEmployees: "1-10",
    slogan: "The Future of Productivity, Powered by AI"
  };

  return [websiteSchema, organizationSchema];
};

export const generateCategorySchema = (categoryName: string, categoryDescription: string, tools: Tool[]): ItemListSchema => {
  const baseUrl = 'https://neuralstock.ai';
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryName} Tools`,
    description: categoryDescription,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        url: `${baseUrl}/tool/${tool.id}`
      }
    }))
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbListSchema => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": crumb.url,
        name: crumb.name,
        url: crumb.url
      }
    }))
  };
};

export const injectSchema = (schema: object | object[]) => {
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  // Remove existing schema tags
  const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  existingSchemas.forEach(script => script.remove());
  
  // Add new schema
  schemas.forEach(schemaObj => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(script);
  });
};
