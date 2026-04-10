import { useState, useEffect, useRef } from 'react';
import { useSocket } from './hooks/useSocket';
import { NicknameModal } from './components/NicknameModal';
import { NicknameChangeModal } from './components/NicknameChangeModal';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { UserList } from './components/UserList';
import { RoomList } from './components/RoomList';
import { SettingsModal } from './components/SettingsModal';
import { useLanguage } from './i18n/LanguageContext';
import { localizeSystemMessage } from './i18n/systemMessages';
import { getStoredMessages, storeMessages, getStoredCurrentRoom, storeCurrentRoom } from './utils/messageStorage';
import 'prismjs/themes/prism-tomorrow.css';
import type { Message, User, Language, Room } from '@chat/types';
import { DEFAULT_ROOMS } from '@chat/types';

function App() {
  const { socket, isConnected, isConnecting, disconnectReason } = useSocket();
  const { t, language, setLanguage } = useLanguage();
  const languageRef = useRef(language);
  languageRef.current = language;

  const savedNickname = localStorage.getItem('nickname') || '';
  const [nickname, setNickname] = useState<string>(savedNickname);
  const [showNicknameModal, setShowNicknameModal] = useState(!savedNickname);
  const [showNicknameChangeModal, setShowNicknameChangeModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Room state
  const [currentRoom, setCurrentRoom] = useState(() => getStoredCurrentRoom() || 'general');
  const currentRoomRef = useRef(currentRoom);

  const [rooms] = useState<Room[]>(DEFAULT_ROOMS);

  // Room-based message state (initialized from localStorage)
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(() => {
    const room = getStoredCurrentRoom() || 'general';
    return { [room]: getStoredMessages(room) };
  });

  const [usersByRoom, setUsersByRoom] = useState<Record<string, User[]>>({});
  const [roomUserCounts, setRoomUserCounts] = useState<Record<string, number>>({});
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derived values for current room
  const messages = messagesByRoom[currentRoom] || [];
  const users = usersByRoom[currentRoom] || [];

  // Keep ref in sync
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  // 테마 적용
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 저장된 닉네임이 있으면 자동 접속
  useEffect(() => {
    if (savedNickname && socket) {
      socket.connect();
      socket.emit('join', { nickname: savedNickname, room: currentRoomRef.current });
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    // 메시지 수신
    socket.on('message', (message) => {
      setMessagesByRoom((prev) => {
        const room = message.room;
        const updated = { ...prev, [room]: [...(prev[room] || []), message] };
        // Persist to localStorage
        storeMessages(room, updated[room]);
        return updated;
      });
    });

    // 접속자 목록 수신
    socket.on('user_list', ({ users, room }) => {
      setUsersByRoom((prev) => ({ ...prev, [room]: users }));
      setRoomUserCounts((prev) => ({ ...prev, [room]: users.length }));
    });

    // 시스템 메시지 수신
    socket.on('system', (data) => {
      let text: string;
      if (data.key) {
        text = localizeSystemMessage(languageRef.current, data.key, data.params);
      } else {
        text = data.text ?? '';
      }
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        nickname: t('system.nickname'),
        text,
        isCode: false,
        timestamp: new Date(),
        room: currentRoomRef.current,
      };
      setMessagesByRoom((prev) => {
        const room = currentRoomRef.current;
        const updated = { ...prev, [room]: [...(prev[room] || []), systemMessage] };
        return updated;
      });
    });

    // 룸 메시지 수신 (서버에서 전체 메시지 로드 시)
    socket.on('room_messages', ({ messages: roomMessages }) => {
      if (roomMessages.length === 0) return;
      const room = roomMessages[0].room;
      setMessagesByRoom((prev) => {
        // Merge: localStorage messages + server messages (deduplicate by id)
        const stored = prev[room] || [];
        const allIds = new Set(stored.map((m) => m.id));
        const newMessages = roomMessages.filter((m) => !allIds.has(m.id));
        const merged = [...stored, ...newMessages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        // Keep only last 200
        const trimmed = merged.slice(-200);
        storeMessages(room, trimmed);
        return { ...prev, [room]: trimmed };
      });
    });

    // 룸 목록 수신 (정적 룸이므로 처리 불필요)
    socket.on('room_list', () => {});

    // 전체 방 인원 수 수신
    socket.on('room_user_counts', ({ counts }) => {
      setRoomUserCounts(counts);
    });

    // 타이핑 수신
    socket.on('typing_start', ({ nickname: nick, room }) => {
      if (room === currentRoomRef.current) {
        setTypingUsers((prev) => new Set(prev).add(nick));
      }
    });

    socket.on('typing_stop', ({ nickname: nick, room }) => {
      if (room === currentRoomRef.current) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(nick);
          return next;
        });
      }
    });

    // 메시지 수정 수신
    socket.on('message_updated', ({ id, text, edited }) => {
      setMessagesByRoom((prev) => {
        const updated: Record<string, Message[]> = {};
        for (const [room, msgs] of Object.entries(prev)) {
          updated[room] = msgs.map((m) =>
            m.id === id ? { ...m, text, edited } : m
          );
        }
        // Persist any room that changed
        for (const [room, msgs] of Object.entries(updated)) {
          if (msgs !== prev[room]) {
            storeMessages(room, msgs);
          }
        }
        return updated;
      });
    });

    // 메시지 삭제 수신
    socket.on('message_deleted', ({ id }) => {
      setMessagesByRoom((prev) => {
        const updated: Record<string, Message[]> = {};
        for (const [room, msgs] of Object.entries(prev)) {
          updated[room] = msgs.map((m) =>
            m.id === id ? { ...m, text: '', deleted: true } : m
          );
        }
        for (const [room, msgs] of Object.entries(updated)) {
          if (msgs !== prev[room]) {
            storeMessages(room, msgs);
          }
        }
        return updated;
      });
    });

    return () => {
      socket.off('message');
      socket.off('user_list');
      socket.off('system');
      socket.off('room_messages');
      socket.off('room_list');
      socket.off('room_user_counts');
      socket.off('typing_start');
      socket.off('typing_stop');
      socket.off('message_updated');
      socket.off('message_deleted');
    };
  }, [socket, t]);

  const handleJoin = (newNickname: string) => {
    setNickname(newNickname);
    setShowNicknameModal(false);
    localStorage.setItem('nickname', newNickname);
    socket?.connect();
    socket?.emit('join', { nickname: newNickname, room: currentRoomRef.current });
  };

  const handleSendMessage = (text: string, isCode: boolean, language?: string) => {
    if (!socket || !isConnected) return;
    socket.emit('message', { text, isCode, language });
  };

  const handleNicknameChange = () => {
    setShowNicknameChangeModal(true);
  };

  const handleNicknameChangeSubmit = (newNickname: string) => {
    setNickname(newNickname);
    localStorage.setItem('nickname', newNickname);
    socket?.emit('nickname_change', { nickname: newNickname });
  };

  const handleSwitchRoom = (newRoom: string) => {
    if (newRoom === currentRoom) return;
    setTypingUsers(new Set());
    storeCurrentRoom(newRoom);
    setCurrentRoom(newRoom);
    setMobileMenuOpen(false);
    socket?.emit('switch_room', { room: newRoom });
  };

  const handleEditMessage = (id: string, text: string) => {
    socket?.emit('message_edit', { id, text });
  };

  const handleDeleteMessage = (id: string) => {
    socket?.emit('message_delete', { id });
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {showNicknameModal && <NicknameModal onJoin={handleJoin} />}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        theme={theme}
        setTheme={setTheme}
      />
      <NicknameChangeModal
        isOpen={showNicknameChangeModal}
        onClose={() => setShowNicknameChangeModal(false)}
        currentNickname={nickname}
        onSubmit={handleNicknameChangeSubmit}
      />

      {!showNicknameModal && (
        <>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title={t('menu.open')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Chat with Coder
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  # {t(`rooms.${currentRoom}`)}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/keehyun2/chat-with-coder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="GitHub Repository"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="id">Bahasa Indonesia</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title={t('header.settings')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isConnected ? t('header.connected') : isConnecting ? t('header.connecting') : t('header.disconnected')}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Mobile overlay */}
            {mobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            {/* RoomList - always visible on md+, overlay on mobile */}
            <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-30 h-full transition-transform duration-200`}>
              <RoomList
                rooms={rooms}
                currentRoom={currentRoom}
                roomUserCounts={roomUserCounts}
                onSwitchRoom={handleSwitchRoom}
              />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <ChatWindow
                messages={messages}
                typingUsers={typingUsers}
                currentNickname={nickname}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
              />
              {isConnected ? (
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onTypingStart={() => socket?.emit('typing_start')}
                  onTypingStop={() => socket?.emit('typing_stop')}
                />
              ) : isConnecting ? (
                <div className="p-6 text-center border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('connecting.waking')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('connecting.cold_start')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('connecting.auto_start')}
                    </p>
                  </div>
                </div>
              ) : !isConnected && !isConnecting && messages.length > 0 ? (
                <div className="p-4 text-center border-t dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {t('header.disconnected')}
                    {disconnectReason && ` (${disconnectReason})`}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="hidden md:block">
              <UserList
                users={users}
                currentNickname={nickname}
                onNicknameChange={handleNicknameChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
