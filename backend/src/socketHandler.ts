import { Socket, Server } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, Message, DEFAULT_ROOMS } from '@chat/types';
import { createRoomManager } from './roomManager';
import { validateNickname, validateMessage, sanitizeString } from './validation';

const roomManager = createRoomManager();

// Rate limiter: tracks message timestamps per socket
const messageTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10_000; // 10 seconds
const RATE_LIMIT_MAX = 5; // max 5 messages per window

function checkRateLimit(socketId: string): boolean {
  const now = Date.now();
  const timestamps = messageTimestamps.get(socketId) || [];
  // Remove timestamps outside the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    return false; // rate limited
  }
  recent.push(now);
  messageTimestamps.set(socketId, recent);
  return true;
}

// Clean up rate limit data on disconnect
function clearRateLimit(socketId: string) {
  messageTimestamps.delete(socketId);
}

export const setupSocketHandlers = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  // 입장
  socket.on('join', ({ nickname, room }) => {
    const error = validateNickname(nickname);
    if (error) {
      socket.emit('error', { message: error });
      return;
    }
    const sanitized = sanitizeString(nickname);
    const roomId = room || 'general';

    socket.join(roomId);
    roomManager.addUser(socket.id, sanitized, roomId);

    // Send initial data to the joining user
    socket.emit('room_list', { rooms: DEFAULT_ROOMS });
    socket.emit('room_messages', { messages: roomManager.getRecentMessages(roomId) });
    socket.emit('system', { key: 'user_joined', params: { nickname: sanitized } });

    // Notify others in the room
    socket.to(roomId).emit('system', { key: 'user_joined', params: { nickname: sanitized } });
    io.to(roomId).emit('user_list', { users: roomManager.getRoomUsers(roomId), room: roomId });
    io.emit('room_user_counts', { counts: roomManager.getRoomUserCounts() });
  });

  // 메시지
  socket.on('message', ({ text, isCode, language }) => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;

    // Rate limit check
    if (!checkRateLimit(socket.id)) {
      socket.emit('error', { message: 'Too many messages. Please slow down.' });
      return;
    }

    const error = validateMessage(text);
    if (error) {
      socket.emit('error', { message: error });
      return;
    }

    const sanitized = sanitizeString(text);
    const message: Message = {
      id: `${socket.id}-${Date.now()}`,
      nickname: user.nickname,
      text: sanitized,
      isCode,
      language,
      timestamp: new Date(),
      room: user.currentRoom,
    };

    roomManager.addMessage(message);
    io.to(user.currentRoom).emit('message', message);

    // 메시지 전송 시 타이핑 중단 브로드캐스트 (해당 룸에만)
    socket.to(user.currentRoom).emit('typing_stop', { nickname: user.nickname, room: user.currentRoom });
  });

  // 메시지 수정
  socket.on('message_edit', ({ id, text }) => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;

    const found = roomManager.findMessage(id);
    if (!found) return;

    // Only allow editing own messages (message id starts with socket.id)
    if (!found.message.id.startsWith(socket.id)) {
      socket.emit('error', { message: 'You can only edit your own messages.' });
      return;
    }

    const error = validateMessage(text);
    if (error) {
      socket.emit('error', { message: error });
      return;
    }

    const sanitized = sanitizeString(text);
    const updated = roomManager.updateMessage(id, sanitized);
    if (updated) {
      io.to(user.currentRoom).emit('message_updated', { id, text: sanitized, edited: true });
    }
  });

  // 메시지 삭제
  socket.on('message_delete', ({ id }) => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;

    const found = roomManager.findMessage(id);
    if (!found) return;

    // Only allow deleting own messages
    if (!found.message.id.startsWith(socket.id)) {
      socket.emit('error', { message: 'You can only delete your own messages.' });
      return;
    }

    const deleted = roomManager.deleteMessage(id);
    if (deleted) {
      io.to(user.currentRoom).emit('message_deleted', { id });
    }
  });

  // 닉네임 변경
  socket.on('nickname_change', ({ nickname }) => {
    const error = validateNickname(nickname);
    if (error) {
      socket.emit('error', { message: error });
      return;
    }
    const sanitized = sanitizeString(nickname);
    const user = roomManager.updateNickname(socket.id, sanitized);
    if (!user) return;

    socket.emit('system', { key: 'nickname_changed_self', params: { nickname: sanitized } });
    socket.to(user.currentRoom).emit('system', { key: 'nickname_changed_broadcast', params: { oldNickname: user.nickname } });
    io.to(user.currentRoom).emit('user_list', { users: roomManager.getRoomUsers(user.currentRoom), room: user.currentRoom });
  });

  // 룸 전환
  socket.on('switch_room', ({ room }) => {
    const result = roomManager.switchRoom(socket.id, room);
    if (!result) return;

    const { oldRoom, newRoom, user } = result;

    // Leave old room, join new room
    socket.leave(oldRoom);
    socket.join(newRoom);

    // Notify old room
    socket.to(oldRoom).emit('system', { key: 'room_left', params: { nickname: user.nickname, room: oldRoom } });
    io.to(oldRoom).emit('user_list', { users: roomManager.getRoomUsers(oldRoom), room: oldRoom });

    // Notify new room
    socket.to(newRoom).emit('system', { key: 'room_joined', params: { nickname: user.nickname, room: newRoom } });
    io.to(newRoom).emit('user_list', { users: roomManager.getRoomUsers(newRoom), room: newRoom });

    // Broadcast updated room counts to all clients
    io.emit('room_user_counts', { counts: roomManager.getRoomUserCounts() });

    // Send room messages to the switching user
    socket.emit('room_messages', { messages: roomManager.getRecentMessages(newRoom) });
    socket.emit('system', { key: 'room_joined', params: { nickname: user.nickname, room: newRoom } });
  });

  // 퇴장
  socket.on('disconnect', () => {
    clearRateLimit(socket.id);
    const result = roomManager.removeUser(socket.id);
    if (result) {
      const { user, room } = result;
      socket.to(room).emit('system', { key: 'user_left', params: { nickname: user.nickname } });
      socket.to(room).emit('typing_stop', { nickname: user.nickname, room });
      io.to(room).emit('user_list', { users: roomManager.getRoomUsers(room), room });
      io.emit('room_user_counts', { counts: roomManager.getRoomUserCounts() });
    }
  });

  // 타이핑 시작
  socket.on('typing_start', () => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;
    socket.to(user.currentRoom).emit('typing_start', { nickname: user.nickname, room: user.currentRoom });
  });

  // 타이핑 중단
  socket.on('typing_stop', () => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;
    socket.to(user.currentRoom).emit('typing_stop', { nickname: user.nickname, room: user.currentRoom });
  });
};

// io 인스턴스를 저장할 변수
let io: Server;

export const setIo = (ioInstance: Server) => {
  io = ioInstance;
};
