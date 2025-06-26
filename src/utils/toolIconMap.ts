import {
  Code, Palette, LineChart, BarChart3, Calculator, 
  Wrench, Heart, GraduationCap, MessageCircle,
  Hash, Key,
  FileText, Globe, Mail, QrCode,
  Search, RefreshCw, Clock, Link,
  Database, Shield, Download,
  Type, AlignLeft, Crop, Sparkles,
  DollarSign, TrendingUp, PiggyBank, CreditCard,
  Briefcase, Target, Users, Star,
  BookOpen, Brain, Calendar,
  Brackets, LucideIcon, Droplets,
  Layers
} from 'lucide-react';

// Map tool IDs to specific icons
const toolIconMap: Record<string, LucideIcon> = {
  // Development Tools
  'password-generator': Key,
  'hash-generator': Hash,
  'jwt-decoder': Shield,
  'base64-tool': Code,
  'json-formatter': Brackets,
  'regex-tester': Search,
  'sql-formatter': Database,
  'css-minifier': Code,
  'js-minifier': Code,
  'html-entity': Code,
  'cron-generator': Clock,
  'uuid-generator': RefreshCw,
  'url-encoder': Link,
  'diff-checker': FileText,
  'timestamp-converter': Clock,

  // Design Tools
  'color-converter': Droplets, // Changed from Palette to Droplets for uniqueness
  'gradient-generator': Layers, // Changed from PaletteIcon to Layers for uniqueness
  'favicon-generator': Star, // Changed from ImageIcon to Star for uniqueness
  'image-compressor': Crop, // Changed from ImageIcon to Crop for uniqueness
  'brand-color-palette-generator': Palette,
  'ai-image-generator': Sparkles,

  // Productivity Tools
  'word-counter': Type,
  'case-converter': Type,
  'lorem-generator': AlignLeft,
  'markdown-editor': FileText,
  'qr-generator': QrCode,
  'unit-converter': RefreshCw,

  // Marketing Tools
  'meta-tag-generator': Globe,
  'email-signature-generator': Mail,
  'utm-builder': BarChart3,
  'social-media-caption-generator': MessageCircle,
  'email-subject-tester': Mail,
  'landing-page-analyzer': LineChart,
  'content-optimizer': Target,

  // Finance Tools
  'loan-calculator': Calculator,
  'mortgage-affordability-calculator': Calculator,
  'retirement-calculator': PiggyBank,
  'investment-calculator': TrendingUp,
  'budget-planner': DollarSign,
  'debt-payoff-calculator': CreditCard,
  'emergency-fund-calculator': Shield,
  'salary-negotiation-calculator': Briefcase,
  'options-profit-calculator': LineChart,
  'stock-analysis-calculator': BarChart3,
  'personal-finance-dashboard': DollarSign,

  // Education Tools
  'citation-generator': BookOpen,
  'math-problem-solver': Calculator,
  'vocabulary-builder': Brain,
  'study-planner': Calendar,
  'formula-reference': BookOpen,

  // Health Tools - if any exist

  // Chatbot Tools
  'persona-simulator': Users,

  // Utility Tools
  'pdf-compressor': Download,
  'terms-analyzer': FileText,
};

// Category fallback icons
const categoryIconMap: Record<string, LucideIcon> = {
  development: Code,
  design: Palette,
  productivity: LineChart,
  marketing: BarChart3,
  finance: Calculator,
  chatbots: MessageCircle,
  utility: Wrench,
  health: Heart,
  education: GraduationCap,
};

export const getToolIcon = (toolId: string, category: string): LucideIcon => {
  // First try to get specific tool icon
  const toolIcon = toolIconMap[toolId];
  if (toolIcon) {
    return toolIcon;
  }

  // Fallback to category icon
  const categoryIcon = categoryIconMap[category];
  if (categoryIcon) {
    return categoryIcon;
  }

  // Ultimate fallback
  return Wrench;
};
