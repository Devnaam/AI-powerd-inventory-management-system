import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatWindow = ({ onClose, onNewMessage }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Inventory Assistant powered by Gemini 2.0 Flash. I can help you with:\n\n• 📊 Stock analysis\n• 📈 Sales insights\n• ⚠️ Low stock alerts\n• 💡 Smart recommendations\n\nWhat would you like to know?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    resetTranscript();

    // Add user message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await api.post('/ai/ask', {
        message: userMessage,
        conversation_history: messages.slice(-10) // Send last 5 exchanges
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.data.answer,
        timestamp: new Date().toISOString(),
        model: response.data.data.model
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak response
      speak(response.data.data.answer);
      
      onNewMessage?.();
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to get AI response');
      
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Show low stock items",
    "Best selling products",
    "Total inventory value",
    "Recent transactions"
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-primary animate-scale-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary-light text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-3xl">🤖</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Assistant</h3>
            <p className="text-xs opacity-90">Powered by Gemini 2.0</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Questions */}
      <div className="p-3 bg-gradient-to-r from-primary-light/10 to-accent/10 border-b border-border">
        <p className="text-xs text-text-muted font-semibold mb-2">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => setInput(q)}
              className="px-3 py-1 bg-primary-light/20 hover:bg-primary-light hover:text-white text-xs rounded-full transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary-light text-white'
                  : 'bg-white shadow-md border border-border'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="text-xs font-semibold text-primary">AI Assistant</span>
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                    className="text-xs hover:text-primary transition-colors"
                  >
                    {isSpeaking ? '🔇 Stop' : '🔊 Listen'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-2 border-primary/20">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your inventory..."
            className="flex-1 px-4 py-2 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="2"
            disabled={loading}
          />
          
          {/* Voice Input Button */}
          {browserSupportsSpeechRecognition && (
            <button
              onClick={listening ? stopListening : startListening}
              className={`p-3 rounded-xl transition-all ${
                listening 
                  ? 'bg-danger text-white animate-pulse' 
                  : 'bg-gradient-to-br from-primary to-accent text-white hover:shadow-lg'
              }`}
              title={listening ? "Stop recording" : "Start voice input"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
              </svg>
            </button>
          )}
          
          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-3 bg-gradient-to-br from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {listening && (
          <div className="mt-2 text-xs text-danger font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-danger rounded-full animate-pulse"></span>
            Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
