import { useEffect, useRef, useState } from 'react';
import type { Message } from '@chat/types';
import { CodeBlock } from './CodeBlock';
import { EditMessageModal } from './EditMessageModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface ChatWindowProps {
  messages: Message[];
  typingUsers: Set<string>;
  currentNickname: string;
  onEditMessage: (id: string, text: string) => void;
  onDeleteMessage: (id: string) => void;
}

const localeMap = {
  ko: 'ko-KR',
  en: 'en-US',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  ja: 'ja-JP',
  id: 'id-ID',
  vi: 'vi-VN',
  es: 'es-ES',
  ar: 'ar-SA',
  pt: 'pt-BR',
  hi: 'hi-IN',
  th: 'th-TH',
  de: 'de-DE',
  fr: 'fr-FR',
} as const;

export const ChatWindow = ({ messages, typingUsers, currentNickname, onEditMessage, onDeleteMessage }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const { toggleTranslation, isTranslated, isLoading, getTranslatedText, getError } = useTranslation(language);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const typingNicknames = Array.from(typingUsers);

  const getTypingText = (): string | null => {
    if (typingNicknames.length === 0) return null;

    if (typingNicknames.length === 1) {
      return t('typing.single').replace('{name}', typingNicknames[0]);
    }

    if (typingNicknames.length === 2) {
      return t('typing.multiple').replace('{names}', typingNicknames.join(', '));
    }

    return t('typing.others')
      .replace('{name}', typingNicknames[0])
      .replace('{count}', String(typingNicknames.length - 1));
  };

  const typingText = getTypingText();

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
  };

  const handleEditSubmit = (newText: string) => {
    if (editingMessage) {
      onEditMessage(editingMessage.id, newText);
    }
  };

  const handleDelete = (message: Message) => {
    setDeletingMessage(message);
  };

  const handleDeleteConfirm = () => {
    if (deletingMessage) {
      onDeleteMessage(deletingMessage.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      {messages.map((message) => (
        <div key={message.id} className="group relative flex flex-col">
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
            {message.edited && !message.deleted && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {t('message.edited')}
              </span>
            )}
          </div>
          {message.deleted ? (
            <p className="text-sm italic text-gray-400 dark:text-gray-500">
              {t('message.deleted')}
            </p>
          ) : message.isCode ? (
            <CodeBlock code={message.text} language={message.language} />
          ) : (
            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {isTranslated(message.id) ? (
                <>
                  <p>{getTranslatedText(message.id)}</p>
                  <span className="text-xs text-blue-400 dark:text-blue-500 mt-0.5 inline-block">
                    {t('message.translated')}
                  </span>
                </>
              ) : (
                <p>{message.text}</p>
              )}
              {isLoading(message.id) && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <span>{t('message.translating')}</span>
                </div>
              )}
              {getError(message.id) && (
                <p className="text-xs text-red-400 mt-0.5">{getError(message.id)}</p>
              )}
            </div>
          )}
          {/* Hover actions */}
          {!message.deleted && !message.id.startsWith('system-') && (
            <div className="absolute top-0 right-0 hidden group-hover:flex gap-1">
              {/* Translate button — non-code messages */}
              {!message.isCode && (
                <button
                  onClick={() => toggleTranslation(message.id, message.text, language)}
                  disabled={isLoading(message.id)}
                  className={`text-xs px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-600 ${
                    isTranslated(message.id)
                      ? 'text-blue-500 border-blue-300 dark:border-blue-600'
                      : 'text-gray-400 hover:text-blue-500'
                  }`}
                  title={isTranslated(message.id) ? t('message.show_original') : t('message.translate')}
                >
                  {isLoading(message.id) ? (
                    <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  ) : isTranslated(message.id) ? (
                    t('message.show_original')
                  ) : (
                    t('message.translate')
                  )}
                </button>
              )}
              {/* Edit/Delete — own messages only */}
              {message.nickname === currentNickname && (
                <>
                  <button
                    onClick={() => handleEdit(message)}
                    className="text-xs text-gray-400 hover:text-blue-500 px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-600"
                    title={t('message.edit')}
                  >
                    {t('message.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(message)}
                    className="text-xs text-gray-400 hover:text-red-500 px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-600"
                    title={t('message.delete')}
                  >
                    {t('message.delete')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      {typingText && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>{typingText}</span>
        </div>
      )}
      <div ref={messagesEndRef} />
      <EditMessageModal
        isOpen={editingMessage !== null}
        onClose={() => setEditingMessage(null)}
        currentText={editingMessage?.text || ''}
        onSubmit={handleEditSubmit}
      />
      <DeleteConfirmModal
        isOpen={deletingMessage !== null}
        onClose={() => setDeletingMessage(null)}
        onConfirm={handleDeleteConfirm}
        messagePreview={deletingMessage?.text}
      />
    </div>
  );
};
