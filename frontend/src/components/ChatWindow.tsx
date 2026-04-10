import { useEffect, useRef } from 'react';
import type { Message } from '@chat/types';
import { CodeBlock } from './CodeBlock';
import { useLanguage } from '../i18n/LanguageContext';

interface ChatWindowProps {
  messages: Message[];
}

const localeMap = { ko: 'ko-KR', en: 'en-US', zh: 'zh-CN' } as const;

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {message.nickname}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString(localeMap[language], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {message.isCode ? (
            <CodeBlock code={message.text} language={message.language} />
          ) : (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
