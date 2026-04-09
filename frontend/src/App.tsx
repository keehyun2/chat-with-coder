import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { NicknameModal } from './components/NicknameModal';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { UserList } from './components/UserList';
import type { Message, User } from '../../types';

const highlightCode = (text: string, language?: string): string => {
  try {
    const Prism = require('prismjs');
    const lang = language && Prism.languages[language];
    if (lang) {
      return Prism.highlight(text, lang, language);
    }
    // 언어가 지정되지 않은 경우 javascript로 시도
    const jsLang = Prism.languages.javascript;
    if (jsLang) {
      return Prism.highlight(text, jsLang, 'javascript');
    }
    return text;
  } catch {
    return text;
  }
};

function App() {
  const { socket, isConnected } = useSocket();
  const [nickname, setNickname] = useState<string>('');
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!socket) return;

    // 메시지 수신
    socket.on('message', (message) => {
      // 코드 메시지인 경우 하이라이팅 처리
      const processedMessage: Message = message.isCode
        ? { ...message, text: highlightCode(message.text, message.language) }
        : message;
      setMessages((prev) => [...prev, processedMessage]);
    });

    // 접속자 목록 수신
    socket.on('user_list', ({ users }) => {
      setUsers(users);
    });

    // 시스템 메시지 수신
    socket.on('system', ({ text }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        nickname: 'System',
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
  }, [socket]);

  const handleJoin = (newNickname: string) => {
    setNickname(newNickname);
    setShowNicknameModal(false);
    socket?.connect();
    socket?.emit('join', { nickname: newNickname });
  };

  const handleSendMessage = (text: string, isCode: boolean, language?: string) => {
    if (!socket || !isConnected) return;
    socket.emit('message', { text, isCode, language });
  };

  const handleNicknameChange = () => {
    const newNickname = prompt('새 닉네임을 입력하세요:', nickname);
    if (newNickname && newNickname.trim() && newNickname !== nickname) {
      const trimmed = newNickname.trim();
      setNickname(trimmed);
      socket?.emit('nickname_change', { nickname: trimmed });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-100">
      {showNicknameModal && <NicknameModal onJoin={handleJoin} />}

      {!showNicknameModal && (
        <>
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Chat with Coder
              </h1>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? '연결됨' : '연결 안됨'}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <ChatWindow messages={messages} />
              {isConnected && <ChatInput onSendMessage={handleSendMessage} />}
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
