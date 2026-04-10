import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface ChatInputProps {
  onSendMessage: (text: string, isCode: boolean, language?: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export const ChatInput = ({ onSendMessage, onTypingStart, onTypingStop }: ChatInputProps) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLanguage();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const detectCode = (input: string): { isCode: boolean; language?: string; code?: string } => {
    // 백틱 코드 블록 감지
    const codeBlockMatch = input.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (codeBlockMatch) {
      return { isCode: true, language: codeBlockMatch[1] || undefined, code: codeBlockMatch[2] };
    }

    // 자동 코드 감지: 3줄 이상 && 특수문자 포함
    const lines = input.split('\n');
    if (lines.length >= 3) {
      const hasIndentation = lines.some((line) => line.startsWith('  ') || line.startsWith('\t'));
      const hasSpecialChars = /[{};=>]/.test(input);
      if (hasIndentation || hasSpecialChars) {
        return { isCode: true, code: input };
      }
    }

    return { isCode: false, code: input };
  };

  const clearTypingTimer = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const handleChange = (value: string) => {
    setText(value);

    if (!value.trim()) {
      // 텍스트 비워지면 즉시 타이핑 중단
      clearTypingTimer();
      onTypingStop?.();
      return;
    }

    // 타이핑 시작
    onTypingStart?.();

    // 3초 디바운스: 입력 없으면 타이핑 중단
    clearTypingTimer();
    typingTimerRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const { isCode, language, code } = detectCode(text);
      onSendMessage(code || text, isCode, language);
      setText('');

      // 메시지 전송 시 타이핑 타이머 클리어 + 중단
      clearTypingTimer();
      onTypingStop?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('input.placeholder')}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        rows={1}
        style={{ minHeight: '44px', maxHeight: '200px' }}
      />
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('input.code_hint')}
        </p>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          {t('input.send')}
        </button>
      </div>
    </form>
  );
};
