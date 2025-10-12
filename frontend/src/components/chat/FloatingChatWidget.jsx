import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from './ChatWindow';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)} 
          onNewMessage={() => setUnreadCount(0)}
        />
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-danger hover:bg-red-600' 
            : 'bg-gradient-to-br from-primary via-accent to-primary-light hover:shadow-primary/50'
        }`}
        aria-label="AI Chat Assistant"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className="text-3xl animate-bounce">🤖</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Pulsing Ring Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-full bg-primary opacity-20 animate-ping pointer-events-none" />
      )}
    </>
  );
};

export default FloatingChatWidget;
