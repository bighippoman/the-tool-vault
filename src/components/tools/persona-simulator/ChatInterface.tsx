'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Settings, Trash2, History, Feather, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, PersonaProfile } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface ChatInterfaceProps {
  persona: PersonaProfile;
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  conversationMemory: string[];
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClearChat: () => void;
  onStartNewChat: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInterface = ({
  persona,
  messages,
  inputMessage,
  isLoading,
  conversationMemory,
  onInputChange,
  onSendMessage,
  onClearChat,
  onStartNewChat,
  onKeyPress
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Very subtle auto-scroll with long delay
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      // Much longer delay and very gentle scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest' // Less aggressive than 'end'
        });
      }, 1200); // Even longer delay to feel more natural
    }
  }, [messages.length]);

  const handleInterestingFact = () => {
    const factPrompts = [
      `Tell me a fascinating fact about yourself that most people don't know.`,
      `Share an interesting detail about your life or work that might surprise me.`,
      `What's something remarkable about you that you'd like people to remember?`,
      `Tell me about a quirky or unexpected aspect of your personality or life.`,
      `Share a little-known fact about your discoveries, creations, or experiences.`
    ];
    
    const randomPrompt = factPrompts[Math.floor(Math.random() * factPrompts.length)];
    onInputChange(randomPrompt);
    setTimeout(() => onSendMessage(), 100);
  };

  return (
    <Card className={`flex flex-col bg-gradient-to-br ${persona.theme.background} shadow-2xl border-2`} style={{ height: '600px' }}>
      <CardHeader className="pb-3 border-b bg-background/90 backdrop-blur-sm flex-shrink-0 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-2 left-4 w-16 h-16 border border-current rounded-full"></div>
          <div className="absolute top-4 right-8 w-8 h-8 border border-current rotate-45"></div>
          <div className="absolute bottom-2 left-1/3 w-12 h-12 border border-current rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-2xl">{persona.emoji}</div>
              <Feather className="absolute -bottom-1 -right-1 h-3 w-3 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-serif tracking-wide">Correspondence with {persona.name}</CardTitle>
              <CardDescription className="text-xs italic">{persona.description} • {persona.era}</CardDescription>
              {conversationMemory.length > 0 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/70">
                  <History className="h-2.5 w-2.5" />
                  <span className="font-mono text-[10px]">{conversationMemory.length} topics in memory</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" onClick={onClearChat} disabled={messages.length === 0} className="h-7 w-7 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onStartNewChat} className="h-7 w-7 p-0">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden relative">
          {/* Paper texture background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 25px,
                rgba(0,0,0,0.1) 25px,
                rgba(0,0,0,0.1) 26px
              )`
            }}></div>
          </div>
          
          <div className="h-full overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-6 opacity-80">{persona.emoji}</div>
                  <h3 className="text-base font-serif mb-3 text-foreground/80">Begin your correspondence with {persona.name}</h3>
                  <p className="text-xs max-w-md mx-auto text-muted-foreground/70 mb-6 leading-relaxed italic">
                    Write as if you were penning a letter to this remarkable mind. Each exchange will be remembered, 
                    creating a rich tapestry of intellectual discourse.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs">
                    <div className="bg-background/30 backdrop-blur-sm p-4 rounded-lg border border-border/30">
                      <h4 className="font-medium mb-2 text-xs font-serif">Explore their expertise:</h4>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">{persona.favoriteTopics.slice(0, 2).join(', ')}</p>
                    </div>
                    <div className="bg-background/30 backdrop-blur-sm p-4 rounded-lg border border-border/30">
                      <h4 className="font-medium mb-2 text-xs font-serif">Their manner of speech:</h4>
                      <p className="text-muted-foreground text-[11px] leading-relaxed italic">{persona.speakingStyle}</p>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border border-border/30 ${
                        message.role === 'user' 
                          ? 'bg-primary/10 text-primary' 
                          : `bg-background/80 backdrop-blur-sm text-lg`
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          persona.emoji
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-4 relative ${
                          message.role === 'user'
                            ? 'bg-primary/5 border border-primary/20 backdrop-blur-sm'
                            : `bg-background/60 backdrop-blur-sm border border-border/30 shadow-sm`
                        }`}
                      >
                        {/* Letter-style decoration */}
                        <div className={`absolute top-2 ${message.role === 'user' ? 'right-2' : 'left-2'} w-1 h-1 bg-current opacity-30 rounded-full`}></div>
                        
                        {message.role === 'user' ? (
                          <p className="text-xs leading-relaxed font-serif tracking-wide text-foreground/90">{message.content}</p>
                        ) : (
                          <div className="prose prose-xs dark:prose-invert max-w-none">
                            <div className="text-xs leading-relaxed font-serif [&>p]:mb-2 [&>p]:text-xs [&>p]:leading-relaxed">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                        <p className={`text-[10px] mt-2 opacity-60 font-mono ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className={`w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 flex items-center justify-center text-lg`}>
                    {persona.emoji}
                  </div>
                  <div className={`bg-background/60 backdrop-blur-sm border border-border/30 rounded-2xl p-4 shadow-sm`}>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Interesting fact button between chat and input */}
        <div className="px-4 py-2 border-t border-border/20 bg-background/40 backdrop-blur-sm flex justify-center">
          <Button
            onClick={handleInterestingFact}
            disabled={isLoading}
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs bg-background/60 backdrop-blur-sm border border-border/30 shadow-sm hover:bg-background/80 transition-all duration-200 font-serif italic"
          >
            <Sparkles className="h-3 w-3 mr-1.5" />
            Tell me an interesting fact about you
          </Button>
        </div>

        {/* Message Input - Letter writing style */}
        <div className="border-t border-border/30 p-4 bg-background/90 backdrop-blur-sm flex-shrink-0 relative">
          {/* Decorative quill */}
          <div className="absolute top-2 left-4 opacity-10">
            <Feather className="h-4 w-4" />
          </div>
          
          <div className="flex gap-3">
            <Input
              placeholder={`Write to ${persona.name}...`}
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              disabled={isLoading}
              className="flex-1 text-xs font-serif bg-background/50 border-border/50 focus:border-border rounded-xl px-4 py-2.5 placeholder:italic placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={onSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              className="h-9 w-9 rounded-xl p-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>

          {!user && (
            <div className="text-center mt-3 p-3 bg-muted/30 rounded-lg border border-border/20">
              <p className="text-xs text-muted-foreground font-mono">
                ⚡ Limited to 10 exchanges per minute. 
                <Button variant="link" className="p-0 h-auto text-xs font-medium underline" asChild>
                  <a href="/auth">Sign in</a>
                </Button> for unlimited correspondence.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
