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

// 시스템 메시지 타입
export interface SystemMessage {
  text: string;
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
