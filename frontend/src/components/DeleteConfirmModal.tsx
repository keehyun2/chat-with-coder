import { useLanguage } from '../i18n/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  messagePreview?: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  messagePreview,
}: DeleteConfirmModalProps) => {
  const { t } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('message.delete')}
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

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {t('modal.delete_confirm')}
          </p>
          {messagePreview && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-hidden">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {messagePreview}
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('modal.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            {t('modal.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};
