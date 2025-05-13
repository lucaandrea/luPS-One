import { useState, useRef, useEffect } from 'react';
import { SaveModal } from '@/components/SaveModal/SaveModal';
import { useSound, Sounds } from '@/hooks/useSound';

// Message type definition
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ChatDiscSlotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define slot data separately from component
const slotData = {
  title1: "PS Chat Disc",
  title2: "Ask Luca AI",
  thumbnailSrc: "/assets/slots/chat-disc.png",
  appId: "chat-disc",
};

// Export it separately for better compatibility with Fast Refresh
export const ChatDiscSlotData = slotData;

export function ChatDiscSlot({ isOpen, onClose }: ChatDiscSlotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Luca AI. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { play: playMessageSent } = useSound(Sounds.BUTTON_CLICK);
  const { play: playMessageReceived } = useSound(Sounds.WINDOW_OPEN, 0.4);
  
  // Check remaining message quota on load
  useEffect(() => {
    if (isOpen) {
      checkMessageQuota();
    }
  }, [isOpen]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Check remaining messages quota
  const checkMessageQuota = async () => {
    try {
      const response = await fetch('/api/chat/quota');
      if (response.ok) {
        const data = await response.json();
        setRemainingMessages(data.remaining);
      }
    } catch (err) {
      console.error('Failed to check message quota:', err);
    }
  };
  
  // Send a message to the API
  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    setError(null);
    setIsProcessing(true);
    playMessageSent();
    
    // Add user message to the UI immediately
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Create an empty assistant message that will be updated as we get chunks
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1 // Ensure ordering
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    try {
      // Get conversation history (excluding the empty assistant message)
      const conversationHistory = messages.concat(userMessage);
      
      // Send request to the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          setError("You've reached your daily message limit. Please try again tomorrow.");
          // Remove the empty assistant message
          setMessages(prev => prev.slice(0, -1));
          setIsProcessing(false);
          await checkMessageQuota();
          return;
        }
        
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Handle streaming response
      if (!response.body) throw new Error("Response body is null");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let responseText = '';
      let isFirstChunk = true;
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          responseText += chunk;
          
          // Update the last message content
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = responseText;
            return updated;
          });
          
          // Play sound on first chunk
          if (isFirstChunk) {
            playMessageReceived();
            isFirstChunk = false;
          }
        }
      }
      
      // Refresh quota after successful message
      await checkMessageQuota();
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      
      // Update the last message to show the error
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "I'm sorry, but I couldn't process your request right now.";
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter or Command+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <SaveModal
      title1={ChatDiscSlotData.title1}
      title2={ChatDiscSlotData.title2}
      isOpen={isOpen}
      onClose={onClose}
      appId={ChatDiscSlotData.appId as any}
    >
      <div className="flex flex-col h-full">
        {/* Message count indicator */}
        {remainingMessages !== null && (
          <div className="bg-gray-900 rounded px-3 py-1 text-sm text-gray-400 self-end mb-2">
            {remainingMessages} message{remainingMessages !== 1 ? 's' : ''} remaining today
          </div>
        )}
        
        {/* Messages container */}
        <div 
          className="flex-1 overflow-auto mb-4 pr-2 space-y-4"
          role="log"
          aria-live="polite"
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] rounded-lg p-3 
                  ${msg.role === 'user' 
                    ? 'bg-ps-amber text-black rounded-tr-none'
                    : 'bg-gray-800 text-gray-100 rounded-tl-none'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs">
                    {msg.role === 'user' ? 'You' : 'Luca AI'}
                  </span>
                  <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
          
          {/* Error message */}
          {error && (
            <div className="bg-ps-red/20 border border-ps-red text-white rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
        
        {/* Input form */}
        <form 
          onSubmit={handleSubmit} 
          className="flex items-center space-x-2 mt-auto"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isProcessing || remainingMessages === 0}
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ps-amber"
            aria-label="Your message"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim() || remainingMessages === 0}
            className={`
              bg-ps-amber hover:bg-ps-amber/90 text-black rounded-lg px-4 py-2
              disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ps-amber
            `}
            aria-label="Send message"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </form>
        
        {/* Keyboard shortcut tip */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Ctrl+Enter to send
        </div>
      </div>
    </SaveModal>
  );
} 