import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { MessageCircle, Send, Smile, Heart, ThumbsUp, Laugh, Zap, Angry } from 'lucide-react';

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: number;
  type: 'message' | 'reaction';
}

interface ChatDrawerProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSendReaction: (reaction: string) => void;
}

const reactionEmojis = [
  { icon: Heart, emoji: '❤️', label: 'Love' },
  { icon: ThumbsUp, emoji: '👍', label: 'Like' },
  { icon: Laugh, emoji: '😂', label: 'Laugh' },
  { icon: Zap, emoji: '😮', label: 'Wow' },
  { icon: Angry, emoji: '😠', label: 'Mad' },
];

export function ChatDrawer({ messages, onSendMessage, onSendReaction }: ChatDrawerProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-teal-accent)] hover:bg-[var(--color-dark-teal)] text-[var(--color-dark-leather)] shadow-lg z-40 transition-colors duration-200 flex items-center justify-center">
          <MessageCircle className="w-6 h-6" />
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80 bg-[var(--color-dark-leather)] border-l-2 border-[var(--color-gold-accent)]">
        <SheetHeader>
          <SheetTitle className="text-[var(--color-cream)]">Chat & Reactions</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-6">
          {/* Reactions Panel */}
          <div className="mb-4 p-3 bg-[var(--color-leather-brown)] rounded-lg">
            <h4 className="text-[var(--color-cream)] text-sm font-medium mb-2">Quick Reactions</h4>
            <div className="flex space-x-2">
              {reactionEmojis.map((reaction) => (
                <Button
                  key={reaction.label}
                  size="sm"
                  variant="ghost"
                  onClick={() => onSendReaction(reaction.emoji)}
                  className="p-2 hover:bg-[var(--color-dark-leather)] text-[var(--color-cream)]"
                  title={reaction.label}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-[var(--color-leather-brown)] p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[var(--color-teal-accent)] text-sm font-medium">
                    {message.player}
                  </span>
                  <span className="text-[var(--color-muted-foreground)] text-xs">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className={`text-[var(--color-cream)] text-sm ${
                  message.type === 'reaction' ? 'text-center text-lg' : ''
                }`}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-[var(--color-leather-brown)] border-[var(--color-gold-accent)] text-[var(--color-cream)] placeholder:text-[var(--color-muted-foreground)]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-[var(--color-teal-accent)] hover:bg-[var(--color-dark-teal)] text-[var(--color-dark-leather)]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}