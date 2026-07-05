import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function JarvisChat() {
  const jarvisOpen = useAppStore((state) => state.jarvisOpen);
  const setJarvisOpen = useAppStore((state) => state.setJarvisOpen);
  const setShowContactForm = useAppStore((state) => state.setShowContactForm);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hey! I\'m Jarvis, Jaswin\'s AI assistant. Ask me about projects, experience, skills, or anything else you\'d like to know!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
            .filter((m) => (m.role as string) !== 'system')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();

      // Check for recruiter detection
      if (data.isRecruiter) {
        setShowContactForm(true);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-speak the response
      if ('speechSynthesis' in window) {
        speakText(data.response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        speakText(lastMessage.content);
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!jarvisOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setJarvisOpen(true)}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {jarvisOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-96 h-[600px] bg-gradient-to-b from-gray-900 to-black border-2 border-green-500/50 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <h3 className="text-white font-bold text-sm" style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  Jarvis
                </h3>
              </div>
              <button
                onClick={() => setJarvisOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-100 rounded-bl-none border border-green-500/30'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 px-4 py-2 rounded-lg border border-green-500/30">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-green-500/20 bg-black/50 p-4 space-y-2">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Jarvis..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send size={16} />
                </Button>
              </form>

              <button
                onClick={toggleSpeech}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 border border-green-500/30 rounded text-sm text-green-400 hover:bg-gray-700 transition-colors"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX size={16} />
                    Stop Speaking
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    Speak Last Message
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
