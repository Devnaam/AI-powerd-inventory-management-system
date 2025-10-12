import { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import api from '../utils/api';  // Use existing api utility

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your Inventory AI Assistant. Ask me anything about your inventory, like:\n\n• "Which products are running low on stock?"\n• "Show me the best selling products"\n• "What is my total inventory value?"\n• "Which products are out of stock?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Call Node.js backend, which forwards to Python AI service
      const response = await api.post('/ai/ask', {
        message: userMessage
      });

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.data.answer
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error(error.response?.data?.message || 'Failed to get AI response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please make sure the AI service is running and try again.'
      }]);
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
    "Which products are low on stock?",
    "Show me the best selling products",
    "What is my total inventory value?",
    "Which products are out of stock?",
    "Show me inventory by category"
  ];

  const askQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">AI Assistant</h1>
            <p className="text-text-muted mt-1">Ask questions about your inventory</p>
          </div>
          <div className="text-4xl">🤖</div>
        </div>

        {/* Quick Questions */}
        <Card>
          <h3 className="font-semibold text-text-primary mb-3">Quick Questions:</h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => askQuickQuestion(question)}
                className="px-3 py-1.5 bg-primary-light text-white rounded-full text-sm hover:bg-primary transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-primary'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🤖</span>
                      <span className="font-semibold text-sm">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your inventory..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows="2"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="self-end"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AIChat;
