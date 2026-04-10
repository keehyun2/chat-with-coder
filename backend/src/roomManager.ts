import { User, Message, DEFAULT_ROOMS } from '@chat/types';

interface RoomData {
  users: Map<string, User>;
  messages: Message[];
}

interface RoomManager {
  users: Map<string, User>;
  rooms: Map<string, RoomData>;
  addUser: (id: string, nickname: string, roomId: string) => User;
  removeUser: (id: string) => { user: User; room: string } | null;
  getUser: (id: string) => User | undefined;
  getRoomUsers: (roomId: string) => User[];
  switchRoom: (id: string, newRoomId: string) => { oldRoom: string; newRoom: string; user: User } | null;
  addMessage: (message: Message) => void;
  getRecentMessages: (roomId: string, limit?: number) => Message[];
  getRoomUserCounts: () => Record<string, number>;
  updateNickname: (id: string, nickname: string) => User | undefined;
  findMessage: (messageId: string) => { message: Message; room: string } | null;
  updateMessage: (messageId: string, text: string) => Message | null;
  deleteMessage: (messageId: string) => Message | null;
}

export const createRoomManager = (): RoomManager => {
  const users = new Map<string, User>();
  const rooms = new Map<string, RoomData>();

  // Initialize default rooms
  for (const room of DEFAULT_ROOMS) {
    rooms.set(room.id, { users: new Map(), messages: [] });
  }

  const addUser = (id: string, nickname: string, roomId: string): User => {
    const user: User = { id, nickname, currentRoom: roomId };
    users.set(id, user);
    const room = rooms.get(roomId);
    if (room) {
      room.users.set(id, user);
    }
    return user;
  };

  const removeUser = (id: string): { user: User; room: string } | null => {
    const user = users.get(id);
    if (!user) return null;

    const roomId = user.currentRoom;
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(id);
    }
    users.delete(id);
    return { user, room: roomId };
  };

  const getUser = (id: string): User | undefined => {
    return users.get(id);
  };

  const getRoomUsers = (roomId: string): User[] => {
    const room = rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users.values());
  };

  const switchRoom = (id: string, newRoomId: string): { oldRoom: string; newRoom: string; user: User } | null => {
    const user = users.get(id);
    if (!user) return null;

    const oldRoom = user.currentRoom;
    if (oldRoom === newRoomId) return null;

    // Remove from old room
    const oldRoomData = rooms.get(oldRoom);
    if (oldRoomData) {
      oldRoomData.users.delete(id);
    }

    // Add to new room
    user.currentRoom = newRoomId;
    const newRoomData = rooms.get(newRoomId);
    if (newRoomData) {
      newRoomData.users.set(id, user);
    }

    return { oldRoom, newRoom: newRoomId, user };
  };

  const addMessage = (message: Message): void => {
    const room = rooms.get(message.room);
    if (room) {
      room.messages.push(message);
      // Keep max 100 messages per room
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }
    }
  };

  const getRecentMessages = (roomId: string, limit = 50): Message[] => {
    const room = rooms.get(roomId);
    if (!room) return [];
    return room.messages.slice(-limit);
  };

  const getRoomUserCounts = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const [roomId, room] of rooms) {
      counts[roomId] = room.users.size;
    }
    return counts;
  };

  const updateNickname = (id: string, nickname: string): User | undefined => {
    const user = users.get(id);
    if (user) {
      user.nickname = nickname;
      users.set(id, user);
      // Also update in room
      const room = rooms.get(user.currentRoom);
      if (room) {
        room.users.set(id, user);
      }
      return user;
    }
    return undefined;
  };

  const findMessage = (messageId: string): { message: Message; room: string } | null => {
    for (const [roomId, room] of rooms) {
      const msg = room.messages.find((m) => m.id === messageId);
      if (msg) return { message: msg, room: roomId };
    }
    return null;
  };

  const updateMessage = (messageId: string, text: string): Message | null => {
    const found = findMessage(messageId);
    if (!found) return null;
    found.message.text = text;
    found.message.edited = true;
    return found.message;
  };

  const deleteMessage = (messageId: string): Message | null => {
    const found = findMessage(messageId);
    if (!found) return null;
    found.message.text = '';
    found.message.deleted = true;
    return found.message;
  };

  return {
    users,
    rooms,
    addUser,
    removeUser,
    getUser,
    getRoomUsers,
    switchRoom,
    addMessage,
    getRecentMessages,
    getRoomUserCounts,
    updateNickname,
    findMessage,
    updateMessage,
    deleteMessage,
  };
};
