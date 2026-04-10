// 룸 타입
export interface Room {
  id: string;
  name: string;
}

export const DEFAULT_ROOMS: Room[] = [
  { id: 'general', name: 'General' },
  { id: 'help', name: 'Help' },
  { id: 'showcase', name: 'Showcase' },
];

// 메시지 타입
export interface Message {
  id: string;
  nickname: string;
  text: string;
  isCode: boolean;
  language?: string;
  timestamp: Date;
  room: string;
  edited?: boolean;
  deleted?: boolean;
}

// 사용자 타입
export interface User {
  id: string;
  nickname: string;
  currentRoom: string;
}

// 언어 타입
export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'id' | 'vi';

// 시스템 메시지 키
export type SystemMessageKey =
  | 'user_joined'
  | 'user_left'
  | 'nickname_changed_self'
  | 'nickname_changed_broadcast'
  | 'room_joined'
  | 'room_left';

// 시스템 메시지 타입
export interface SystemMessage {
  text?: string;
  key?: SystemMessageKey;
  params?: Record<string, string>;
}

// Socket 이벤트 타입
export interface ServerToClientEvents {
  message: (message: Message) => void;
  message_updated: (data: { id: string; text: string; edited: boolean }) => void;
  message_deleted: (data: { id: string }) => void;
  user_list: (data: { users: User[]; room: string }) => void;
  system: (message: SystemMessage) => void;
  error: (data: { message: string }) => void;
  typing_start: (data: { nickname: string; room: string }) => void;
  typing_stop: (data: { nickname: string; room: string }) => void;
  room_list: (data: { rooms: Room[] }) => void;
  room_messages: (data: { messages: Message[] }) => void;
}

export interface ClientToServerEvents {
  join: (data: { nickname: string; room: string }) => void;
  message: (data: { text: string; isCode: boolean; language?: string }) => void;
  message_edit: (data: { id: string; text: string }) => void;
  message_delete: (data: { id: string }) => void;
  nickname_change: (data: { nickname: string }) => void;
  switch_room: (data: { room: string }) => void;
  typing_start: () => void;
  typing_stop: () => void;
}
