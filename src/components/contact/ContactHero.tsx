
import { Mail, MessageCircle, Users } from 'lucide-react';

const ContactHero = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full flex items-center gap-2">
          <span className="text-2xl">🐹</span>
          <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <span className="text-2xl">💬</span>
        </div>
      </div>
      
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
        Get in Touch
      </h1>
      
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
        Have questions about our hamster-powered tools? Need help with a specific feature? 
        Our support hamsters are here to help you get the most out of NeuralStock.ai.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="text-lg">🐹</span>
          <span>Quick Response</span>
        </div>
        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-lg">⚡</span>
          <span>Expert Hamster Support</span>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
