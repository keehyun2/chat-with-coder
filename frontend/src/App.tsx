import { useState, useEffect, useRef } from 'react';
import { useSocket } from './hooks/useSocket';
import { NicknameModal } from './components/NicknameModal';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { UserList } from './components/UserList';
import { SettingsModal } from './components/SettingsModal';
import { useLanguage } from './i18n/LanguageContext';
import { localizeSystemMessage } from './i18n/systemMessages';
import 'prismjs/themes/prism-tomorrow.css';
import type { Message, User, Language } from '@chat/types';

function App() {
  const { socket, isConnected, isConnecting } = useSocket();
  const { t, language, setLanguage } = useLanguage();
  const languageRef = useRef(language);
  languageRef.current = language;

  const savedNickname = localStorage.getItem('nickname') || '';
  const [nickname, setNickname] = useState<string>(savedNickname);
  const [showNicknameModal, setShowNicknameModal] = useState(!savedNickname);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  // 테마 적용
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
      socket.emit('join', { nickname: savedNickname });
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    // 메시지 수신
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 접속자 목록 수신
    socket.on('user_list', ({ users }) => {
      setUsers(users);
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
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    return () => {
      socket.off('message');
      socket.off('user_list');
      socket.off('system');
    };
  }, [socket, t]);

  const handleJoin = (newNickname: string) => {
    setNickname(newNickname);
    setShowNicknameModal(false);
    localStorage.setItem('nickname', newNickname);
    socket?.connect();
    socket?.emit('join', { nickname: newNickname });
  };

  const handleSendMessage = (text: string, isCode: boolean, language?: string) => {
    if (!socket || !isConnected) return;
    socket.emit('message', { text, isCode, language });
  };

  const handleNicknameChange = () => {
    const newNickname = prompt(t('nickname.change_prompt'), nickname);
    if (newNickname && newNickname.trim() && newNickname !== nickname) {
      const trimmed = newNickname.trim();
      setNickname(trimmed);
      socket?.emit('nickname_change', { nickname: trimmed });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-100">
      {showNicknameModal && <NicknameModal onJoin={handleJoin} />}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        theme={theme}
        setTheme={setTheme}
      />

      {!showNicknameModal && (
        <>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Chat with Coder
              </h1>
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
                  className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
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
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <ChatWindow messages={messages} />
              {isConnected ? (
                <ChatInput onSendMessage={handleSendMessage} />
              ) : isConnecting ? (
                <div className="p-6 text-center border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
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
              ) : null}
            </div>
            <UserList
              users={users}
              currentNickname={nickname}
              onNicknameChange={handleNicknameChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
