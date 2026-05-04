import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Bot, User } from 'lucide-react';
import api from '@/services/api';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I am your SmartHR AI Assistant. How can I help you manage the system today?',
      isAi: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), text: userMessage, isAi: false, timestamp: new Date() },
    ]);

    setIsLoading(true);
    try {
      const response = await api.post('/ai/hr-assistant', { question: userMessage });
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: response.data.answer || 'Sorry, I could not generate an answer.',
          isAi: true,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Oops! I encountered an error connecting to the AI service. Please try again later.',
          isAi: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-industrial-lg flex items-center justify-center hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        title="Open AI Assistant"
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-surface-dark-1 border border-surface-dark-2 rounded-lg shadow-industrial-xl flex flex-col transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-dark-2 bg-gradient-to-r from-primary-900/40 to-transparent rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-500/20 rounded text-primary-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">SmartHR AI</h3>
              <p className="text-xs text-text-tertiary">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-tertiary hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isAi ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isAi ? 'bg-primary-900/50 text-primary-400' : 'bg-surface-dark-3 text-text-secondary'}`}
              >
                {msg.isAi ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div
                className={`max-w-[75%] rounded-lg p-3 text-sm ${msg.isAi ? 'bg-surface-dark-2 text-text-primary rounded-tl-none border border-surface-dark-3' : 'bg-primary-600 text-white rounded-tr-none'}`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${msg.isAi ? 'text-text-tertiary' : 'text-primary-200'}`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-900/50 text-primary-400 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-surface-dark-2 text-text-primary rounded-lg rounded-tl-none p-3 border border-surface-dark-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-primary-400" />
                <span className="text-sm text-text-secondary">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-surface-dark-2 bg-surface-dark-1 rounded-b-lg">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-surface-dark-2 text-white placeholder-text-tertiary text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary-500 border border-surface-dark-3"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-tertiary hover:text-primary-400 disabled:opacity-50 disabled:hover:text-text-tertiary transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
