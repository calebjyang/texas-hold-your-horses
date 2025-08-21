import React, { useEffect, useState } from 'react';
import { X, Info, User, Clock, Zap } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'info' | 'player' | 'timer' | 'action';
  message: string;
  timestamp: number;
}

interface EventToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toastIcons = {
  info: Info,
  player: User,
  timer: Clock,
  action: Zap,
};

const toastColors = {
  info: 'bg-blue-600',
  player: 'bg-[var(--color-teal-accent)]',
  timer: 'bg-orange-600',
  action: 'bg-[var(--color-gold-accent)]',
};

export function EventToast({ messages, onDismiss }: EventToastProps) {
  const [visibleMessages, setVisibleMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    setVisibleMessages(messages.slice(-3)); // Show only last 3 messages
  }, [messages]);

  useEffect(() => {
    // Auto-dismiss messages after 4 seconds
    const timers = visibleMessages.map((message) => {
      return setTimeout(() => {
        onDismiss(message.id);
      }, 4000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [visibleMessages, onDismiss]);

  if (visibleMessages.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-6 z-50 space-y-2">
      {visibleMessages.map((message, index) => {
        const Icon = toastIcons[message.type];
        const colorClass = toastColors[message.type];
        
        return (
          <div
            key={message.id}
            className={`flex items-center space-x-3 ${colorClass} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out animate-in slide-in-from-left-5`}
            style={{
              animationDelay: `${index * 100}ms`,
              opacity: 1 - (index * 0.1),
            }}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium flex-1">{message.message}</span>
            <button
              onClick={() => onDismiss(message.id)}
              className="w-4 h-4 flex-shrink-0 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}