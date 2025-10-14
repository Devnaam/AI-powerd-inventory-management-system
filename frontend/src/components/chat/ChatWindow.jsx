import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatWindow = ({ onClose, onNewMessage }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI Inventory Assistant powered by Gemini 2.0 Flash.\n\nI can help you with:\n• Stock analysis 📊\n• Sales insights 📈\n• Low stock alerts ⚠️\n• Smart recommendations 💡\n\nAsk me anything in English or Hindi!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en-IN');
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
      window.speechSynthesis.cancel();
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select professional voice based on language
      let selectedVoice;
      if (language === 'hi-IN') {
        // For Hindi - prefer Google voices or any Hindi voice
        selectedVoice = voices.find(voice => 
          voice.lang === 'hi-IN' && voice.name.includes('Google')
        ) || voices.find(voice => voice.lang === 'hi-IN');
      } else {
        // For English - prefer female Google/Microsoft voices for professional sound
        selectedVoice = voices.find(voice => 
          (voice.lang === 'en-IN' || voice.lang === 'en-US' || voice.lang === 'en-GB') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft')) &&
          (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Zira'))
        ) || voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Professional voice settings
      utterance.rate = 0.95;  // Slightly slower for clarity
      utterance.pitch = 1.0;   // Natural pitch
      utterance.volume = 1.0;  // Full volume
      utterance.lang = language;
      
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
    // Stop speaking before listening
    stopSpeaking();
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: language });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Stop listening when sending message
    if (listening) {
      stopListening();
    }

    // Stop speaking when sending new message
    stopSpeaking();

    const userMessage = input.trim();
    setInput('');
    resetTranscript();

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
        conversation_history: messages.slice(-10)
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.data.answer,
        timestamp: new Date().toISOString(),
        model: response.data.data.model
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak response after a brief delay (ensures mic is off)
      setTimeout(() => {
        speak(response.data.data.answer);
      }, 300);
      
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

  const quickQuestions = {
    'en-IN': [
      "Show low stock items",
      "Best selling products",
      "Total inventory value",
      "Recent transactions"
    ],
    'hi-IN': [
      "कम स्टॉक दिखाएं",
      "सबसे अच्छे उत्पाद",
      "कुल इन्वेंटरी मूल्य",
      "हाल के लेनदेन"
    ]
  };

  const clearChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([
      {
        role: 'assistant',
        content: language === 'en-IN' 
          ? 'Chat cleared! How can I help you?' 
          : 'चैट साफ़ हो गई! मैं आपकी कैसे मदद कर सकता हूं?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-scale-up">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></span>
            </div>
            <div>
              <h3 className="font-bold text-base">AI Assistant</h3>
              <p className="text-xs text-gray-400">Gemini 2.0 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage('en-IN')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              language === 'en-IN'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setLanguage('hi-IN')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              language === 'hi-IN'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🇮🇳 हिंदी
          </button>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <p className="text-xs text-gray-600 font-semibold mb-2">
          {language === 'en-IN' ? 'Quick Questions:' : 'त्वरित प्रश्न:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions[language].map((q, index) => (
            <button
              key={index}
              onClick={() => setInput(q)}
              className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-xs rounded-lg transition-all border border-gray-200 font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow-sm border border-gray-200'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-900">AI</span>
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="flex items-center justify-between mt-2 gap-3">
                <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
                  >
                    {isSpeaking ? (
                      <>
                        <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        Stop
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        Listen
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'en-IN' ? 'Type your message...' : 'अपना संदेश लिखें...'}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-900"
            rows="2"
            disabled={loading}
          />
          
          {/* Voice Input Button */}
          {browserSupportsSpeechRecognition && (
            <button
              onClick={listening ? stopListening : startListening}
              disabled={loading}
              className={`p-3 rounded-xl transition-all ${
                listening 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {listening && (
          <div className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {language === 'en-IN' ? 'Listening... Speak now' : 'सुन रहा हूँ... अभी बोलें'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
