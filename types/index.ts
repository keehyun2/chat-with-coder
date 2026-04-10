// 메시지 타입
export interface Message {
  id: string;
  nickname: string;
  text: string;
  isCode: boolean;
  language?: string;
  timestamp: Date;
}

// 사용자 타입
export interface User {
  id: string;
  nickname: string;
}

// 언어 타입
export type Language = 'ko' | 'en' | 'zh';

// 시스템 메시지 키
export type SystemMessageKey =
  | 'user_joined'
  | 'user_left'
  | 'nickname_changed_self'
  | 'nickname_changed_broadcast';

// 시스템 메시지 타입
export interface SystemMessage {
  text?: string;
  key?: SystemMessageKey;
  params?: Record<string, string>;
}

// Socket 이벤트 타입
export interface ServerToClientEvents {
  message: (message: Message) => void;
  user_list: (data: { users: User[] }) => void;
  system: (message: SystemMessage) => void;
}

export interface ClientToServerEvents {
  join: (data: { nickname: string }) => void;
  message: (data: { text: string; isCode: boolean; language?: string }) => void;
  nickname_change: (data: { nickname: string }) => void;
}
