import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis votre assistante virtuelle. Je suis là pour vous accompagner dans vos démarches avec la plus grande discrétion. Comment puis-je vous aider aujourd'hui ?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: ["Prendre rendez-vous", "Informations services", "Questions discrétion", "Accompagnement couples"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<{
    messages: { role: 'user' | 'assistant'; content: string }[];
    clientType?: 'individual' | 'couple';
    appointmentRequested?: boolean;
  }>({ messages: [] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mettre à jour le contexte de conversation
    const newContext = {
      ...conversationContext,
      messages: [
        ...conversationContext.messages,
        { role: 'user' as const, content: text.trim() }
      ]
    };

    try {
      // Appel au service IA
      const aiResponse = await aiService.sendMessage(text.trim(), newContext);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.message,
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Mettre à jour le contexte avec la réponse de l'IA
      setConversationContext({
        ...newContext,
        messages: [
          ...newContext.messages,
          { role: 'assistant', content: aiResponse.message }
        ]
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Je suis désolée, je rencontre un problème technique. Pourriez-vous reformuler votre demande ?",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Récupérer les suggestions du dernier message de l'assistant
  const getLatestSuggestions = (): string[] => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.sender === 'assistant');
    return lastAssistantMessage?.suggestions || [];
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="chatbot-container"
    >
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="status-indicator"></div>
          <div>
            <h3>Assistante Secrétariat</h3>
            <span className="status">En ligne - Réponse immédiate</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="chatbot-close"
          aria-label="Fermer le chat"
        >
          ×
        </button>
      </div>

      <div className="chatbot-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="message assistant typing"
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {getLatestSuggestions().length > 0 && (
        <div className="quick-replies">
          {getLatestSuggestions().map((suggestion, index) => (
            <button
              key={index}
              onClick={() => sendMessage(suggestion)}
              className="quick-reply"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="chatbot-input">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="send-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </form>

      <div className="chatbot-footer">
        <span>🔒 Conversation sécurisée et confidentielle</span>
      </div>
    </motion.div>
  );
}