"use client";

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <img src="/neuralstock-logo.png" alt="NeuralStock.ai Logo" className="w-6 h-6 object-contain" />
              NeuralStock.ai
            </h3>
            <p className="text-sm text-gray-300">
              NeuralStock.ai is a comprehensive collection of tools, powered by cutting-edge technology. The future of productivity, powered by our hardworking digital hamsters.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-blue-400">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/development" className="text-gray-300 hover:text-blue-400 transition-colors">Development</Link></li>
              <li><Link href="/category/design" className="text-gray-300 hover:text-blue-400 transition-colors">Design</Link></li>
              <li><Link href="/category/productivity" className="text-gray-300 hover:text-blue-400 transition-colors">Productivity</Link></li>
              <li><Link href="/category/marketing" className="text-gray-300 hover:text-blue-400 transition-colors">Marketing</Link></li>
              <li><Link href="/category/finance" className="text-gray-300 hover:text-blue-400 transition-colors">Finance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-purple-400 flex items-center gap-2">
              <span>🔥</span>
              Popular Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tool/json-formatter" className="text-gray-300 hover:text-purple-400 transition-colors">JSON Formatter, Validator and Fixer</Link></li>
              <li><Link href="/tool/password-generator" className="text-gray-300 hover:text-purple-400 transition-colors">Password Generator</Link></li>
              <li><Link href="/tool/color-converter" className="text-gray-300 hover:text-purple-400 transition-colors">Color Converter</Link></li>
              <li><Link href="/tool/word-counter" className="text-gray-300 hover:text-purple-400 transition-colors">Word Counter</Link></li>
              <li><Link href="/tool/image-compressor" className="text-gray-300 hover:text-purple-400 transition-colors">Image Compressor</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-pink-400 flex items-center gap-2">
              <span>📚</span>
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">About</Link></li>
              <li><Link href="/partnership" className="text-gray-300 hover:text-pink-400 transition-colors font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Partner With Us</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-300 hover:text-pink-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <span>🐹</span>
            &copy; {currentYear} NeuralStock.ai. All rights reserved.
            <span>⚡</span>
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://x.com/neuralstock" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              X
            </a>
            <a href="https://www.linkedin.com/company/106520467/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
