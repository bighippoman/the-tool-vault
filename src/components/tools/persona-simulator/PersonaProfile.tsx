
import { PersonaProfile as PersonaProfileType } from './types';

interface PersonaProfileProps {
  persona: PersonaProfileType;
}

export const PersonaProfile = ({ persona }: PersonaProfileProps) => {
  return (
    <div className={`p-4 rounded-lg bg-gradient-to-r ${persona.theme.background} border`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{persona.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{persona.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{persona.historicalContext}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Favorite topics:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {persona.favoriteTopics.slice(0, 3).map(topic => (
                  <span key={topic} className="bg-white/50 px-2 py-1 rounded text-xs">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Speaking style:</span>
              <p className="text-xs mt-1">{persona.speakingStyle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
