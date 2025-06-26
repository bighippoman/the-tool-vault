'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Sparkles, 
  Trophy, 
  Crown, 
  Rocket, 
  ArrowRight,
  Wand2,
  Bot,
  CircuitBoard,
  Layers
} from 'lucide-react';

export const MediaKit = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMediaKit = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const mediaKitContent = createMediaKitHTML();
      downloadMediaKit(mediaKitContent);
      setIsGenerating(false);
    }, 2000);
  };

  const createMediaKitHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuralStock.ai - 2025 Media Kit</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #0f172a;
            background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%);
            overflow-x: hidden;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        .page { 
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); 
            padding: 80px 100px; 
            margin-bottom: 40px; 
            border-radius: 24px;
            box-shadow: 0 32px 120px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
        }
        .page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899);
        }
        .header { text-align: center; margin-bottom: 80px; position: relative; }
        .ai-badge {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 700;
            box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
        }
        .logo { 
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 4.5rem;
            font-weight: 900;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
        }
        .year-badge {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #1a1a1a;
            padding: 8px 24px;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: 800;
            margin-bottom: 30px;
            box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        }
        .tagline { 
            font-size: 1.8rem; 
            color: #475569; 
            font-weight: 400;
            margin-bottom: 40px;
            line-height: 1.4;
        }
        .saas-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 40px 0;
        }
        .saas-metric {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .saas-metric:hover {
            border-color: #8b5cf6;
            transform: translateY(-2px);
        }
        .metric-icon {
            font-size: 2rem;
            margin-bottom: 12px;
        }
        .metric-value {
            font-size: 1.8rem;
            font-weight: 900;
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }
        .metric-label {
            color: #64748b;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .section { margin-bottom: 60px; }
        .section h2 { 
            font-size: 3.2rem; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #0f172a, #475569);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
            letter-spacing: -0.01em;
        }
        .section h3 { 
            font-size: 2.2rem; 
            margin-bottom: 24px; 
            color: #1e293b;
            font-weight: 700;
        }
        .section p { 
            font-size: 1.2rem; 
            color: #64748b; 
            margin-bottom: 24px;
            line-height: 1.7;
        }
        .ai-highlight { 
            background: linear-gradient(135deg, #ddd6fe, #e0e7ff);
            padding: 40px;
            border-radius: 20px;
            margin: 40px 0;
            border-left: 6px solid #8b5cf6;
            position: relative;
            overflow: hidden;
        }
        .ai-highlight::before {
            content: '🤖';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 3rem;
            opacity: 0.1;
        }
        .ai-highlight h3 {
            color: #5b21b6;
            margin-bottom: 16px;
            font-size: 1.8rem;
        }
        .ai-highlight p {
            color: #5b21b6;
            font-weight: 500;
        }
        .feature-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 30px;
            margin: 50px 0;
        }
        .feature { 
            padding: 30px;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            border-radius: 16px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .feature::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .feature:hover::before {
            opacity: 1;
        }
        .feature:hover {
            border-color: #8b5cf6;
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15);
        }
        .feature h4 { 
            color: #1e293b; 
            margin-bottom: 12px;
            font-size: 1.3rem;
            font-weight: 700;
        }
        .feature p {
            font-size: 1rem;
            line-height: 1.6;
        }
        .vision-section {
            background: linear-gradient(135deg, #0f172a, #1e293b);
            color: white;
            padding: 60px;
            border-radius: 24px;
            margin: 60px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .vision-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.1;
        }
        .vision-section > * {
            position: relative;
            z-index: 1;
        }
        .vision-section h3 {
            font-size: 2.5rem;
            margin-bottom: 24px;
            color: white;
        }
        .saas-stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
            gap: 30px; 
            margin: 50px 0;
        }
        .stat { 
            text-align: center; 
            padding: 40px 30px;
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border-radius: 20px;
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
        }
        .stat:hover {
            transform: translateY(-6px);
            box-shadow: 0 25px 70px rgba(0,0,0,0.1);
            border-color: #8b5cf6;
        }
        .stat-value { 
            font-size: 3rem; 
            font-weight: 900;
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 12px;
            display: block;
        }
        .stat-label { 
            color: #64748b; 
            font-weight: 700;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .cta { 
            text-align: center; 
            background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
            color: white;
            padding: 70px 60px;
            border-radius: 24px;
            margin-top: 60px;
            position: relative;
            overflow: hidden;
        }
        .cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="%23ffffff" opacity="0.1"><animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/></circle><circle cx="80" cy="40" r="1.5" fill="%23ffffff" opacity="0.1"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/></circle><circle cx="40" cy="80" r="2.5" fill="%23ffffff" opacity="0.1"><animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite"/></circle></svg>');
        }
        .cta > * {
            position: relative;
            z-index: 1;
        }
        .cta h3 { 
            font-size: 2.8rem; 
            margin-bottom: 24px;
            color: white;
            font-weight: 800;
        }
        .contact { 
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            padding: 50px;
            border-radius: 20px;
            margin: 50px 0;
            text-align: center;
            border: 2px solid #cbd5e1;
        }
        .contact h3 {
            color: #1e293b;
            margin-bottom: 24px;
            font-size: 2rem;
        }
        .ai-image-placeholder {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #ddd6fe, #e0e7ff, #fef3c7);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px 0;
            border: 2px solid #e5e7eb;
            font-size: 1.2rem;
            color: #64748b;
            font-weight: 600;
        }
        .brand-colors {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .color-swatch {
            height: 100px;
            border-radius: 12px;
            display: flex;
            align-items: end;
            padding: 20px;
            color: white;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .blue-swatch { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .purple-swatch { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .pink-swatch { background: linear-gradient(135deg, #ec4899, #db2777); }
        @media print {
            body { background: white; }
            .page { box-shadow: none; }
        }
        @media (max-width: 768px) {
            .page { padding: 40px 30px; }
            .logo { font-size: 3rem; }
            .section h2 { font-size: 2.5rem; }
            .saas-grid { grid-template-columns: repeat(2, 1fr); }
            .feature-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Cover Page -->
        <div class="page">
            <div class="header">
                <div class="ai-badge">🚀 AI-POWERED PLATFORM 2025</div>
                <div class="logo">NeuralStock.ai</div>
                <div class="year-badge">✨ 2025 EDITION ✨</div>
                <div class="tagline">The Ultimate AI Tools Discovery Platform<br>Revolutionizing How the World Finds AI Solutions</div>
            </div>
            
            <div class="ai-highlight">
                <h3>🌟 The AI Revolution is Here - And We're Leading It</h3>
                <p>NeuralStock.ai isn't just another platform—we're the epicenter where groundbreaking AI meets infinite possibility. Every day, we're reshaping how millions discover, evaluate, and deploy the most advanced AI tools on Earth.</p>
            </div>

            <div class="saas-grid">
                <div class="saas-metric">
                    <div class="metric-icon">🌍</div>
                    <div class="metric-value">Global</div>
                    <div class="metric-label">Reach</div>
                </div>
                <div class="saas-metric">
                    <div class="metric-icon">⚡</div>
                    <div class="metric-value">Lightning</div>
                    <div class="metric-label">Fast</div>
                </div>
                <div class="saas-metric">
                    <div class="metric-icon">🤖</div>
                    <div class="metric-value">AI-Native</div>
                    <div class="metric-label">Platform</div>
                </div>
                <div class="saas-metric">
                    <div class="metric-icon">🚀</div>
                    <div class="metric-value">Exponential</div>
                    <div class="metric-label">Growth</div>
                </div>
            </div>

            <div class="ai-image-placeholder">
                🎨 AI-Generated: Futuristic Neural Network Visualization
            </div>
        </div>

        <!-- Vision 2025 Page -->
        <div class="page">
            <div class="section">
                <h2>🎯 Our 2025 Vision</h2>
                <p>We're not just building a platform—we're architecting the future of human-AI collaboration. In 2025, NeuralStock.ai will be the definitive gateway where revolutionary AI tools transform from cutting-edge concepts into everyday superpowers.</p>
                
                <div class="vision-section">
                    <h3>💡 The Future We're Creating</h3>
                    <p style="font-size: 1.3rem; line-height: 1.6;">Imagine a world where every entrepreneur, creator, developer, and visionary has instant access to the most powerful AI tools on the planet. Where innovation isn't limited by discovery, but only by imagination. That's the world we're building—one groundbreaking tool at a time.</p>
                </div>

                <div class="feature-grid">
                    <div class="feature">
                        <h4>🧠 Neural Discovery Engine</h4>
                        <p>Our proprietary AI algorithms surface hidden gems and predict the next breakthrough tools before they go mainstream.</p>
                    </div>
                    <div class="feature">
                        <h4>⚡ Real-time Intelligence</h4>
                        <p>Live updates on AI tool performance, user sentiment, and market trends delivered instantly to your dashboard.</p>
                    </div>
                    <div class="feature">
                        <h4>🌐 Global AI Ecosystem</h4>
                        <p>Connecting innovators worldwide, fostering collaboration and accelerating the pace of AI innovation.</p>
                    </div>
                    <div class="feature">
                        <h4>🎯 Personalized Recommendations</h4>
                        <p>AI-powered suggestions that understand your unique needs and surface tools you didn't know you needed.</p>
                    </div>
                </div>

                <div class="ai-image-placeholder">
                    🎨 AI-Generated: Dynamic SAAS Dashboard Interface with Neural Patterns
                </div>
            </div>
        </div>

        <!-- Market Impact Page -->
        <div class="page">
            <div class="section">
                <h2>🌟 Transforming Industries at Scale</h2>
                
                <div class="ai-highlight">
                    <h3>📈 The Numbers Tell Our Story</h3>
                    <p>While we can't share specific metrics, our trajectory is clear: exponential growth across every key performance indicator. User engagement, tool discoveries, partnership requests, and platform stickiness—all pointing skyward.</p>
                </div>

                <h3>🚀 Industry Revolution</h3>
                <p>From startups disrupting trillion-dollar markets to Fortune 500 companies reimagining their entire operations, NeuralStock.ai is the catalyst for unprecedented transformation across every sector imaginable.</p>

                <div class="feature-grid">
                    <div class="feature">
                        <h4>🏢 Enterprise Transformation</h4>
                        <p>Empowering organizations to seamlessly integrate cutting-edge AI into their workflows, creating competitive advantages overnight.</p>
                    </div>
                    <div class="feature">
                        <h4>🎓 Educational Revolution</h4>
                        <p>Giving educators and students access to AI tools that accelerate learning, creativity, and scientific discovery.</p>
                    </div>
                    <div class="feature">
                        <h4>💼 Startup Acceleration</h4>
                        <p>Providing founders with the AI arsenal they need to compete with tech giants and disrupt established markets.</p>
                    </div>
                    <div class="feature">
                        <h4>🎨 Creative Liberation</h4>
                        <p>Unleashing artists, writers, and creators with tools that amplify human imagination beyond all limits.</p>
                    </div>
                </div>

                <div class="saas-stats">
                    <div class="stat">
                        <div class="stat-value">∞</div>
                        <div class="stat-label">Potential Unlocked</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">24/7</div>
                        <div class="stat-label">AI Discovery</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">🌍</div>
                        <div class="stat-label">Global Impact</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">🚀</div>
                        <div class="stat-label">Exponential Growth</div>
                    </div>
                </div>

                <div class="ai-image-placeholder">
                    🎨 AI-Generated: Interconnected Global Network of AI Innovation
                </div>
            </div>
        </div>

        <!-- Technology Excellence Page -->
        <div class="page">
            <div class="section">
                <h2>🔮 Next-Generation Platform Architecture</h2>
                
                <h3>🌈 Beyond Today's Imagination</h3>
                <p>What we've built is just the foundation. We're architecting a future where AI tools don't just exist—they collaborate, evolve, and create possibilities we haven't even dreamed of yet.</p>

                <div class="feature-grid">
                    <div class="feature">
                        <h4>🧠 Predictive Intelligence</h4>
                        <p>Advanced algorithms that anticipate your needs and surface relevant tools before you even search for them.</p>
                    </div>
                    <div class="feature">
                        <h4>🔗 Seamless Integration Hub</h4>
                        <p>Tools that work together in perfect harmony, creating workflows that feel like magic.</p>
                    </div>
                    <div class="feature">
                        <h4>📊 Real-time Performance Analytics</h4>
                        <p>Live insights that help you maximize the impact and ROI of every AI tool in your arsenal.</p>
                    </div>
                    <div class="feature">
                        <h4>🌟 Custom AI Development Suite</h4>
                        <p>Build, test, and deploy your own AI solutions directly on our platform with zero technical overhead.</p>
                    </div>
                </div>

                <div class="vision-section">
                    <h3>🎯 The Bold Prediction</h3>
                    <p style="font-size: 1.4rem;">By 2026, every significant AI breakthrough will be discovered on NeuralStock.ai first. We're not just following the AI revolution—we're defining it.</p>
                </div>

                <div class="ai-image-placeholder">
                    🎨 AI-Generated: Futuristic Technology Stack with Neural Processing
                </div>
            </div>
        </div>

        <!-- Brand Excellence Page -->
        <div class="page">
            <div class="section">
                <h2>🎨 Brand Identity 2025</h2>
                
                <h3>Visual Excellence</h3>
                <p>Our brand represents the perfect fusion of human creativity and artificial intelligence—bold, innovative, and infinitely powerful. Every element reflects our commitment to pushing the boundaries of what's possible.</p>

                <div class="ai-image-placeholder">
                    🎨 AI-Generated: Premium Brand Logo Variations and Typography
                </div>

                <h3>🎨 Neural Color Palette</h3>
                <div class="brand-colors">
                    <div class="color-swatch blue-swatch">
                        <div>
                            <div>Neural Blue</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">#0ea5e9</div>
                        </div>
                    </div>
                    <div class="color-swatch purple-swatch">
                        <div>
                            <div>AI Purple</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">#8b5cf6</div>
                        </div>
                    </div>
                    <div class="color-swatch pink-swatch">
                        <div>
                            <div>Innovation Pink</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">#ec4899</div>
                        </div>
                    </div>
                </div>

                <div class="feature-grid">
                    <div class="feature">
                        <h4>🎯 Brand Positioning</h4>
                        <p>The definitive authority on AI tool discovery and evaluation in the global marketplace.</p>
                    </div>
                    <div class="feature">
                        <h4>✨ Visual Language</h4>
                        <p>Clean, modern, and forward-thinking design that reflects our cutting-edge technology.</p>
                    </div>
                    <div class="feature">
                        <h4>🌟 Brand Voice</h4>
                        <p>Confident, inspiring, and accessible—making complex AI technology feel approachable and exciting.</p>
                    </div>
                    <div class="feature">
                        <h4>🚀 Market Presence</h4>
                        <p>Thought leadership across all major platforms, conferences, and industry publications.</p>
                    </div>
                </div>

                <div class="ai-image-placeholder">
                    🎨 AI-Generated: Modern SAAS Brand Applications and Marketing Materials
                </div>
            </div>
        </div>

        <!-- Partnership Excellence -->
        <div class="page">
            <div class="cta">
                <h3>🤝 Partner With the AI Revolution</h3>
                <p style="font-size: 1.3rem; margin-bottom: 30px; line-height: 1.6;">Join the platform that's redefining how the world discovers and deploys artificial intelligence. Be part of the movement that's transforming every industry, one breakthrough tool at a time.</p>
                <div style="font-size: 1.2rem; margin-bottom: 20px; opacity: 0.9;">Ready to amplify your brand in the AI ecosystem?</div>
                <div style="font-size: 1.6rem; font-weight: 700;">hello@neuralstock.ai</div>
            </div>

            <div class="contact">
                <h3>📞 Connect With Innovation</h3>
                <p style="margin-bottom: 20px; font-size: 1.1rem;">Partnership Opportunities • Media Inquiries • Strategic Collaboration</p>
                <p><strong>Email:</strong> hello@neuralstock.ai</p>
                <p><strong>Website:</strong> neuralstock.ai</p>
                <div style="margin-top: 40px; padding: 30px; background: linear-gradient(135deg, #ddd6fe, #e0e7ff); border-radius: 12px;">
                    <p style="color: #5b21b6; font-weight: 600; margin-bottom: 0;">This 2025 media kit represents our vision and unwavering commitment to revolutionizing AI tool discovery. All projections reflect our exponential growth trajectory and dominant market positioning in the AI ecosystem.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const downloadMediaKit = (content: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NeuralStock-MediaKit-2025.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full p-4 inline-block mb-6 shadow-lg">
          <Download className="w-8 h-8 text-white" />
        </div>
        
        <div className="mb-4">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2">
            <Sparkles className="w-4 h-4 mr-1" />
            2025 EDITION
          </Badge>
        </div>
        
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Premium AI Media Kit
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Download our comprehensive 2025 media kit featuring AI-generated visuals, cutting-edge brand assets, and the revolutionary vision that&apos;s transforming AI discovery.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105">
            <Wand2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold">AI Visuals</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:scale-105">
            <Bot className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-semibold">SAAS Focus</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-pink-100 hover:border-pink-300 transition-all duration-300 hover:scale-105">
            <CircuitBoard className="w-6 h-6 text-pink-600 mx-auto mb-2" />
            <div className="text-sm font-semibold">Tech Vision</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-100 hover:border-yellow-300 transition-all duration-300 hover:scale-105">
            <Layers className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm font-semibold">Brand Assets</div>
          </div>
        </div>

        <Button 
          onClick={generateMediaKit}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-6 h-6 mr-3 animate-spin" />
              Generating Epic Kit...
            </>
          ) : (
            <>
              <Download className="w-6 h-6 mr-3" />
              Download 2025 Media Kit
              <ArrowRight className="w-6 h-6 ml-3" />
            </>
          )}
        </Button>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4">
            <Rocket className="w-4 h-4 mr-1" />
            AI-Powered Platform
          </Badge>
          <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 px-4">
            <Trophy className="w-4 h-4 mr-1" />
            Industry Leading
          </Badge>
          <Badge className="bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 px-4">
            <Crown className="w-4 h-4 mr-1" />
            Premium Partnership
          </Badge>
        </div>
      </div>
    </Card>
  );
};
