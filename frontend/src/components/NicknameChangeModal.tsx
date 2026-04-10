import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onSubmit: (newNickname: string) => void;
}

export const NicknameChangeModal = ({
  isOpen,
  onClose,
  currentNickname,
  onSubmit,
}: NicknameChangeModalProps) => {
  const [nickname, setNickname] = useState(currentNickname);
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim() && nickname.trim() !== currentNickname) {
      onSubmit(nickname.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('users.change')}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('modal.current_nickname')}
            </label>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              {currentNickname}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="newNickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('modal.new_nickname')}
            </label>
            <input
              ref={inputRef}
              id="newNickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('modal.nickname_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={20}
            />
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
              disabled={!nickname.trim() || nickname.trim() === currentNickname}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {t('modal.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
