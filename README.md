# 🛠️ The Tool Vault

> A comprehensive collection of 77+ professional developer tools built with Next.js 15 and React 19

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://vercel.com)

## 🌟 Overview

The Tool Vault is a modern, mobile-first web application featuring 77+ professional-grade developer tools. Built with the latest web technologies, it provides an intuitive interface for developers, designers, and content creators to perform common tasks efficiently.

## ✨ Key Features

### 🎯 **77+ Professional Tools**
- **Development**: JSON Formatter & Validator, Regex Tester, CSS Minifier, Hash Generator
- **Content**: Word Counter, Case Converter, Base64 Encoder/Decoder, Diff Checker  
- **Design**: Color Converter, Gradient Generator, QR Code Generator
- **Productivity**: Password Generator, UUID Generator, Timestamp Converter
- **Finance**: Loan Calculator, Investment Calculator, ROI Calculator
- **Marketing**: UTM Builder, Meta Tag Generator, Content Optimizer

### 📱 **Mobile-First Design**
- Responsive 4-panel navigation system
- Thumb-friendly controls and spacing
- Optimized for both desktop and mobile experiences
- Progressive Web App (PWA) capabilities

### 🚀 **Enterprise Features**
- Real-time validation and error detection
- AI-powered content optimization
- Advanced formatting options
- File upload/download capabilities
- History tracking and session management
- Professional-grade output quality

### 🎨 **Modern UI/UX**
- Built with shadcn/ui components
- Consistent design language across all tools
- Dark/light mode support
- Accessibility-first approach
- Lightning-fast performance

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.3.4** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible primitives

### **Backend & Services**
- **Supabase** - Authentication and database
- **Vercel Edge Functions** - Serverless API endpoints
- **AI Integration** - Content optimization features

### **Tools & Libraries**
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **React Resizable Panels** - Flexible layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/the-tool-vault.git
cd the-tool-vault

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── tool/[slug]/       # Dynamic tool pages
│   ├── categories/        # Category pages
│   └── globals.css        # Global styles
├── components/
│   ├── tools/             # 77 individual tool components
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   ├── layout/            # Header, footer, navigation
│   └── shared/            # Shared feature components
├── data/                  # Static data (tools.ts, categories.ts)
├── types/                 # TypeScript type definitions
├── utils/                 # Shared utilities
├── hooks/                 # Custom React hooks
├── lib/                   # Third-party integrations
└── integrations/          # External service connections
```

## 🎯 Featured Tools

### JSON Formatter & Validator
- Real-time JSON validation with line/column error detection
- 16 local AI fix patterns + API fallback
- Format conversion (YAML, XML, CSV, TOML)
- Enterprise validation with schema detection
- Multiple view modes and syntax highlighting

### Word Counter & Analyzer
- Comprehensive text analysis and statistics
- Reading time estimation and readability scores
- Mobile-optimized interface with history tracking
- Export functionality for analysis reports

### Regex Tester
- Interactive regex pattern testing
- Full flags support and performance metrics
- Pattern library with common expressions
- Mobile-friendly interface with explanations

### Case Converter
- 14+ case conversion formats
- Programming conventions (camelCase, snake_case, etc.)
- Content formatting with preserve spacing
- History tracking and batch processing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Adding a New Tool

1. Create component in `src/components/tools/`
2. Add tool definition to `src/data/tools.ts`
3. Register in `src/components/tools/ToolComponentsMap.tsx`
4. Follow existing patterns for mobile UI and TypeScript

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/the-tool-vault)

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent ratings
- **Bundle Size**: Optimized with code splitting
- **Load Time**: < 2s on mobile networks

## 🔮 Roadmap

- [ ] Add more AI-powered tools
- [ ] Implement collaborative features
- [ ] Add API for tool integrations  
- [ ] Create desktop app with Tauri
- [ ] Add more export formats
- [ ] Implement tool customization

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component library
- [Lucide](https://lucide.dev/) - For the icon set
- [Vercel](https://vercel.com/) - For hosting and deployment
- [Supabase](https://supabase.com/) - For backend services

## 📞 Support

- 📧 Email: support@tooltarget.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/the-tool-vault/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/the-tool-vault/discussions)

---

<div align="center">
  <p>Built with ❤️ using Next.js 15 and React 19</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
