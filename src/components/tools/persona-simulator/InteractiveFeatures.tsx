'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Trophy, Clock, Star, Feather } from 'lucide-react';
import { PersonaProfile } from './types';

interface InteractiveFeaturesProps {
  persona: PersonaProfile;
  onFeatureClick: (feature: string, prompt: string) => void;
}

export const InteractiveFeatures = ({ persona, onFeatureClick }: InteractiveFeaturesProps) => {
  const [usedFeatures, setUsedFeatures] = useState<Set<string>>(new Set());

  const handleFeatureClick = (featureId: string, prompt: string) => {
    onFeatureClick(featureId, prompt);
    setUsedFeatures(prev => new Set([...Array.from(prev), featureId]));
  };

  const getPersonaFeatures = (personaId: string) => {
    const baseFeatures = [
      {
        id: 'daily-wisdom',
        title: 'Daily Wisdom',
        description: 'Share your most profound insight',
        icon: Star,
        prompt: 'Share with me your most profound piece of wisdom or insight that you think everyone should know.',
        badge: 'Wisdom'
      },
      {
        id: 'life-story',
        title: 'Life Story',
        description: 'Tell me about a pivotal moment',
        icon: BookOpen,
        prompt: 'Tell me about the most pivotal or transformative moment in your life and how it shaped who you became.',
        badge: 'Personal'
      }
    ];

    const personaSpecific = {
      einstein: [
        {
          id: 'thought-experiment',
          title: 'Thought Experiment',
          description: 'Create a mind-bending scenario',
          icon: Sparkles,
          prompt: 'Create an original thought experiment that helps explain a complex physics concept in an intuitive way.',
          badge: 'Physics'
        },
        {
          id: 'daily-discovery',
          title: 'Daily Discovery',
          description: 'Learn something new about the universe',
          icon: Trophy,
          prompt: 'Teach me one fascinating thing about the universe that most people don\'t know, and explain it simply.',
          badge: 'Learning'
        }
      ],
      shakespeare: [
        {
          id: 'spontaneous-sonnet',
          title: 'Spontaneous Sonnet',
          description: 'Compose a poem on the spot',
          icon: Feather,
          prompt: 'Compose an original sonnet about the beauty and complexity of human emotions.',
          badge: 'Poetry'
        },
        {
          id: 'character-analysis',
          title: 'Character Study',
          description: 'Analyze human nature',
          icon: Trophy,
          prompt: 'Choose one of your most complex characters and explain what they reveal about human nature.',
          badge: 'Drama'
        }
      ],
      davinci: [
        {
          id: 'invention-challenge',
          title: 'Invention Challenge',
          description: 'Design something revolutionary',
          icon: Sparkles,
          prompt: 'Design a revolutionary invention that combines art and science to solve a modern problem.',
          badge: 'Innovation'
        },
        {
          id: 'sketch-lesson',
          title: 'Art Lesson',
          description: 'Teach me to observe like an artist',
          icon: Trophy,
          prompt: 'Teach me how to observe the world like an artist and scientist combined. What should I look for?',
          badge: 'Art'
        }
      ],
      jobs: [
        {
          id: 'design-philosophy',
          title: 'Design Challenge',
          description: 'Redesign something beautifully',
          icon: Sparkles,
          prompt: 'Pick an everyday object that frustrates you and explain how you would redesign it with perfect simplicity.',
          badge: 'Design'
        },
        {
          id: 'future-vision',
          title: 'Future Vision',
          description: 'Predict the next big thing',
          icon: Trophy,
          prompt: 'What technology or innovation do you think will transform humanity in the next 20 years?',
          badge: 'Vision'
        }
      ],
      curie: [
        {
          id: 'discovery-method',
          title: 'Discovery Method',
          description: 'Share your research approach',
          icon: Sparkles,
          prompt: 'Explain your methodical approach to scientific discovery and how persistence leads to breakthroughs.',
          badge: 'Science'
        },
        {
          id: 'inspire-women',
          title: 'Inspiration',
          description: 'Advice for overcoming barriers',
          icon: Trophy,
          prompt: 'Share advice for women or anyone facing discrimination in pursuing their scientific dreams.',
          badge: 'Inspiration'
        }
      ],
      darwin: [
        {
          id: 'observation-challenge',
          title: 'Nature Walk',
          description: 'Observe evolution in action',
          icon: Sparkles,
          prompt: 'Take me on an imaginary nature walk and point out examples of evolution and adaptation I might miss.',
          badge: 'Nature'
        },
        {
          id: 'species-story',
          title: 'Species Story',
          description: 'Tell the tale of evolution',
          icon: Trophy,
          prompt: 'Tell me the fascinating evolutionary story of one species that perfectly demonstrates natural selection.',
          badge: 'Evolution'
        }
      ],
      tesla: [
        {
          id: 'energy-future',
          title: 'Energy Vision',
          description: 'Imagine wireless everything',
          icon: Sparkles,
          prompt: 'Describe your vision of a world powered entirely by wireless electricity and clean energy.',
          badge: 'Innovation'
        },
        {
          id: 'invention-story',
          title: 'Invention Story',
          description: 'Share a breakthrough moment',
          icon: Trophy,
          prompt: 'Tell me about the moment you realized how to harness alternating current and what it felt like.',
          badge: 'Discovery'
        }
      ],
      plato: [
        {
          id: 'cave-allegory',
          title: 'Modern Cave',
          description: 'Apply allegory to today',
          icon: Sparkles,
          prompt: 'Explain how the Allegory of the Cave applies to modern society and social media.',
          badge: 'Philosophy'
        },
        {
          id: 'ideal-society',
          title: 'Ideal Society',
          description: 'Design the perfect state',
          icon: Trophy,
          prompt: 'Describe what an ideal society would look like if we could start from scratch today.',
          badge: 'Politics'
        }
      ]
    };

    return [...baseFeatures, ...(personaSpecific[personaId as keyof typeof personaSpecific] || [])];
  };

  const features = getPersonaFeatures(persona.id);

  return (
    <Card className="mb-6 bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Interactive Experiences with {persona.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground italic">
          Discover unique insights through guided conversations
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isUsed = usedFeatures.has(feature.id);
            
            return (
              <Button
                key={feature.id}
                variant="ghost"
                onClick={() => handleFeatureClick(feature.id, feature.prompt)}
                className={`h-auto p-4 text-left justify-start bg-background/30 hover:bg-background/60 border border-border/30 rounded-lg transition-all duration-200 ${
                  isUsed ? 'opacity-60' : 'hover:scale-105'
                }`}
                disabled={isUsed}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg ${isUsed ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Icon className={`h-4 w-4 ${isUsed ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm font-serif">{feature.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                      {isUsed && <Badge variant="outline" className="text-xs">Used</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/20">
          <p className="text-xs text-muted-foreground text-center italic">
            &apos;I&apos;m {persona.name}, {persona.description}&apos;
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
