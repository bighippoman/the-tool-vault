
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle } from 'lucide-react';
import { PersonaProfile } from './types';
import { PersonaProfile as PersonaProfileComponent } from './PersonaProfile';

interface PersonaSelectorProps {
  personas: PersonaProfile[];
  selectedPersona: string;
  onPersonaSelect: (personaId: string) => void;
  onStartChat: () => void;
}

export const PersonaSelector = ({ 
  personas, 
  selectedPersona, 
  onPersonaSelect, 
  onStartChat 
}: PersonaSelectorProps) => {
  const selectedPersonaInfo = personas.find(p => p.id === selectedPersona);

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Choose Your Conversation Partner
        </CardTitle>
        <CardDescription>
          Select a historical figure and start an engaging conversation with enhanced personality traits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="persona-select">Select Persona</Label>
          <Select value={selectedPersona} onValueChange={onPersonaSelect}>
            <SelectTrigger className="h-auto">
              <SelectValue placeholder="Choose your conversation partner..." />
            </SelectTrigger>
            <SelectContent>
              {personas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  <div className="flex items-center gap-3 py-2">
                    <span className="text-2xl">{persona.emoji}</span>
                    <div>
                      <div className="font-medium">{persona.name}</div>
                      <div className="text-sm text-muted-foreground">{persona.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {persona.era} • {persona.field}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPersonaInfo && (
          <PersonaProfileComponent persona={selectedPersonaInfo} />
        )}

        <Button
          onClick={onStartChat}
          disabled={!selectedPersona}
          className="w-full h-12 text-lg"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Start Enhanced Conversation
        </Button>
      </CardContent>
    </Card>
  );
};
