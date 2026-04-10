import type { Message } from '@chat/types';

const MESSAGE_PREFIX = 'chat-messages:';
const CURRENT_ROOM_KEY = 'chat-current-room';
const MAX_MESSAGES = 200;

export function getStoredMessages(room: string): Message[] {
  try {
    const raw = localStorage.getItem(`${MESSAGE_PREFIX}${room}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Restore timestamp strings to Date objects
    return parsed.map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch {
    return [];
  }
}

export function storeMessages(room: string, messages: Message[]): void {
  try {
    const toStore = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(`${MESSAGE_PREFIX}${room}`, JSON.stringify(toStore));
  } catch {
    // localStorage full or unavailable - silently fail
  }
}

export function getStoredCurrentRoom(): string | null {
  return localStorage.getItem(CURRENT_ROOM_KEY);
}

export function storeCurrentRoom(room: string): void {
  localStorage.setItem(CURRENT_ROOM_KEY, room);
}
