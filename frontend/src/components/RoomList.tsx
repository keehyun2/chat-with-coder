import type { Room } from '@chat/types';
import { useLanguage } from '../i18n/LanguageContext';

interface RoomListProps {
  rooms: Room[];
  currentRoom: string;
  roomUserCounts: Record<string, number>;
  onSwitchRoom: (roomId: string) => void;
}

export function RoomList({ rooms, currentRoom, roomUserCounts, onSwitchRoom }: RoomListProps) {
  const { t } = useLanguage();

  return (
    <div className="w-48 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="p-3 border-b dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t('rooms.title')}
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSwitchRoom(room.id)}
            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
              currentRoom === room.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-gray-400 dark:text-gray-500">#</span>
              <span>{t(`rooms.${room.id}`)}</span>
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {roomUserCounts[room.id] ?? 0}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
