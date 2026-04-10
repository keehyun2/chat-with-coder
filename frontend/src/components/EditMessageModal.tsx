import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onSubmit: (newText: string) => void;
}

export const EditMessageModal = ({
  isOpen,
  onClose,
  currentText,
  onSubmit,
}: EditMessageModalProps) => {
  const [text, setText] = useState(currentText);
  const { t } = useLanguage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      textareaRef.current.setSelectionRange(text.length, text.length);
    }
  }, [isOpen, text.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && text.trim() !== currentText) {
      onSubmit(text.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[500px] shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('message.edit')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="editText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('modal.edit_message')}
            </label>
            <textarea
              ref={textareaRef}
              id="editText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('input.placeholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={5}
              maxLength={2000}
            />
            <div className="mt-1 text-right">
              <span className={`text-xs ${text.length > 1900 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {text.length}/2000
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={!text.trim() || text.trim() === currentText}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {t('modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
