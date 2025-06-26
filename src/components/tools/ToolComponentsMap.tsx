// Import tool components
import { Tool } from '@/types/tool';
import { lazy } from 'react';

// 🚀 PERFORMANCE: Dynamic imports - only load tools when needed
const PasswordGenerator = lazy(() => import('@/components/tools/PasswordGenerator'));
const WordCounter = lazy(() => import('@/components/tools/WordCounter'));
const ColorConverter = lazy(() => import('@/components/tools/ColorConverter'));
const UrlEncoder = lazy(() => import('@/components/tools/UrlEncoder'));
const Base64Tool = lazy(() => import('@/components/tools/Base64Tool'));
const MarkdownEditor = lazy(() => import('@/components/tools/MarkdownEditor'));
const ImageCompressor = lazy(() => import('@/components/tools/ImageCompressor'));
const UnitConverter = lazy(() => import('@/components/tools/UnitConverter'));
const QrGenerator = lazy(() => import('@/components/tools/QrGenerator'));
const HtmlEntity = lazy(() => import('@/components/tools/HtmlEntity'));
const CaseConverter = lazy(() => import('@/components/tools/CaseConverter'));
const HashGenerator = lazy(() => import('@/components/tools/HashGenerator'));
const LoremGenerator = lazy(() => import('@/components/tools/LoremGenerator'));
const DiffChecker = lazy(() => import('@/components/tools/DiffChecker'));
const RegexTester = lazy(() => import('@/components/tools/RegexTester'));
const CssMinifier = lazy(() => import('@/components/tools/CssMinifier'));
const JsMinifier = lazy(() => import('@/components/tools/JsMinifier'));
const GradientGenerator = lazy(() => import('@/components/tools/GradientGenerator'));
const TimestampConverter = lazy(() => import('@/components/tools/TimestampConverter'));
const UuidGenerator = lazy(() => import('@/components/tools/UuidGenerator'));
const SqlFormatter = lazy(() => import('@/components/tools/SqlFormatter'));
const JwtDecoder = lazy(() => import('@/components/tools/JwtDecoder'));
const CronGenerator = lazy(() => import('@/components/tools/CronGenerator'));
const FaviconGenerator = lazy(() => import('@/components/tools/FaviconGenerator'));
const AiImageGenerator = lazy(() => import('@/components/tools/AiImageGenerator'));

// Marketing tools
const EmailSignatureGenerator = lazy(() => import('@/components/tools/EmailSignatureGenerator'));
const UtmBuilder = lazy(() => import('@/components/tools/UtmBuilder'));
const MetaTagGenerator = lazy(() => import('@/components/tools/MetaTagGenerator'));
const EmailSubjectTester = lazy(() => import('@/components/tools/EmailSubjectTester'));
const BrandColorPaletteGenerator = lazy(() => import('@/components/tools/BrandColorPaletteGenerator'));

// AI-powered content tools
const ContentOptimizer = lazy(() => import('@/components/tools/ContentOptimizer'));

// Utility tools  
const TermsAnalyzer = lazy(() => import('@/components/tools/TermsAnalyzer'));

// Finance tools
const InvestmentCalculator = lazy(() => import('@/components/tools/InvestmentCalculator'));
const LoanCalculator = lazy(() => import('@/components/tools/LoanCalculator'));
const MortgageAffordabilityCalculator = lazy(() => import('@/components/tools/MortgageAffordabilityCalculator'));
const DebtPayoffCalculator = lazy(() => import('@/components/tools/DebtPayoffCalculator'));
const RetirementCalculator = lazy(() => import('@/components/tools/RetirementCalculator'));
const BudgetPlanner = lazy(() => import('@/components/tools/BudgetPlanner'));
const EmergencyFundCalculator = lazy(() => import('@/components/tools/EmergencyFundCalculator'));
const SalaryNegotiationCalculator = lazy(() => import('@/components/tools/SalaryNegotiationCalculator'));
const OptionsProfitCalculator = lazy(() => import('@/components/tools/OptionsProfitCalculator'));

// Education tools
const MathProblemSolver = lazy(() => import('@/components/tools/MathProblemSolver'));
const CitationGenerator = lazy(() => import('@/components/tools/CitationGenerator'));
const StudyPlanner = lazy(() => import('@/components/tools/StudyPlanner'));
const VocabularyBuilder = lazy(() => import('@/components/tools/VocabularyBuilder'));
const FormulaReference = lazy(() => import('@/components/tools/FormulaReference'));

// JSON Formatter (most important tool)
const JsonFormatter = lazy(() => import('@/components/tools/JsonFormatter'));

// PDF tools
const PdfCompressor = lazy(() => import('@/components/tools/PdfCompressor'));

// Persona Simulator
const PersonaSimulator = lazy(() => import('@/components/tools/PersonaSimulator'));

export const ToolComponents: Record<string, React.ComponentType<{ tool: Tool }>> = {
  'password-generator': PasswordGenerator,
  'word-counter': WordCounter,
  'color-converter': ColorConverter,
  'url-encoder': UrlEncoder,
  'base64': Base64Tool,
  'markdown-editor': MarkdownEditor,
  'image-compressor': ImageCompressor,
  'unit-converter': UnitConverter,
  'qr-generator': QrGenerator,
  'html-entity': HtmlEntity,
  'case-converter': CaseConverter,
  'hash-generator': HashGenerator,
  'lorem-generator': LoremGenerator,
  'diff-checker': DiffChecker,
  'regex-tester': RegexTester,
  'css-minifier': CssMinifier,
  'js-minifier': JsMinifier,
  'gradient-generator': GradientGenerator,
  'timestamp-converter': TimestampConverter,
  'uuid-generator': UuidGenerator,
  'sql-formatter': SqlFormatter,
  'jwt-decoder': JwtDecoder,
  'cron-generator': CronGenerator,
  'favicon-generator': FaviconGenerator,
  'ai-image-generator': AiImageGenerator,
  'email-signature-generator': EmailSignatureGenerator,
  'utm-builder': UtmBuilder,
  'meta-tag-generator': MetaTagGenerator,
  'email-subject-tester': EmailSubjectTester,
  'brand-color-palette-generator': BrandColorPaletteGenerator,
  'content-optimizer': ContentOptimizer,
  'terms-analyzer': TermsAnalyzer,
  'investment-calculator': InvestmentCalculator,
  'loan-calculator': LoanCalculator,
  'mortgage-affordability-calculator': MortgageAffordabilityCalculator,
  'debt-payoff-calculator': DebtPayoffCalculator,
  'retirement-calculator': RetirementCalculator,
  'budget-planner': BudgetPlanner,
  'emergency-fund-calculator': EmergencyFundCalculator,
  'salary-negotiation-calculator': SalaryNegotiationCalculator,
  'options-profit-calculator': OptionsProfitCalculator,
  'math-problem-solver': MathProblemSolver,
  'citation-generator': CitationGenerator,
  'study-planner': StudyPlanner,
  'vocabulary-builder': VocabularyBuilder,
  'formula-reference': FormulaReference,
  'pdf-compressor': PdfCompressor,
  'persona-simulator': PersonaSimulator,
  'json-formatter': JsonFormatter
};
