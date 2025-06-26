"use client";

import React, { useState } from 'react';
import { PersonaSelector } from './persona-simulator/PersonaSelector';
import { ChatInterface } from './persona-simulator/ChatInterface';
import { Message } from './persona-simulator/types';
import { personas } from './persona-simulator/data';

const PersonaSimulator = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationMemory, setConversationMemory] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoading] = useState(false);

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleSendMessage = () => {
    // Implementation would go here
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationMemory([]);
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setConversationMemory([]);
    setShowChat(false);
    setSelectedPersona('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedPersonaInfo = personas.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">Enhanced Persona Simulator</h1>
        </div>
        <p className="text-muted-foreground">
          Choose a persona to start chatting. Each persona has unique characteristics, 
          expertise, and communication style that will shape your conversation.
        </p>
      </div>

      {!showChat ? (
        <PersonaSelector
          personas={personas}
          selectedPersona={selectedPersona}
          onPersonaSelect={handlePersonaSelect}
          onStartChat={handleStartChat}
        />
      ) : selectedPersonaInfo && (
        <ChatInterface
          persona={selectedPersonaInfo}
          messages={messages}
          inputMessage={inputMessage}
          isLoading={isLoading}
          conversationMemory={conversationMemory}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onStartNewChat={handleStartNewChat}
          onKeyPress={handleKeyPress}
        />
      )}
    </div>
  );
};

export default PersonaSimulator;
