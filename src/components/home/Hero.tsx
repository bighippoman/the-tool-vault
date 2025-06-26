"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 lg:py-12">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full border border-orange-200">
              <img src="/neuralstock-logo.png" alt="NeuralStock Logo" className="w-6 h-6 animate-bounce object-contain" />
              <span className="text-sm font-medium text-orange-700 italic">
                All our tools are powered by overqualified, caffeinated digital hamsters with PhDs in theoretical computing and a slight tendency toward chaos.
              </span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>☕</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              50+
            </span>
            <br />
            Free Online Tools
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Boost your productivity with our comprehensive collection of hamster-powered tools. 
            No downloads, no installations – everything runs in your browser.
          </p>

          <p className="text-sm text-gray-500 mb-8 italic">
            Currently offering 50+ tools and plans to add many many more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/tools">
                Explore Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Instant results with our optimized algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/neuralstock-logo.png" alt="NeuralStock Logo" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hamster-Powered</h3>
              <p className="text-gray-600">Our overqualified caffeinated hamsters work 24/7 for chaotically good results</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Free</h3>
              <p className="text-gray-600">No hidden costs, no subscriptions required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
