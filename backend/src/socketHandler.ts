import { Socket, Server } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, Message } from '@chat/types';
import { createRoomManager } from './roomManager';

const roomManager = createRoomManager();

export const setupSocketHandlers = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  // 입장
  socket.on('join', ({ nickname }) => {
    roomManager.addUser(socket.id, nickname);
    socket.emit('system', { key: 'user_joined', params: { nickname } });
    socket.broadcast.emit('system', { key: 'user_joined', params: { nickname } });
    io.emit('user_list', { users: roomManager.getAllUsers() });
  });

  // 메시지
  socket.on('message', ({ text, isCode, language }) => {
    const user = roomManager.getUser(socket.id);
    if (!user) return;

    const message: Message = {
      id: `${socket.id}-${Date.now()}`,
      nickname: user.nickname,
      text,
      isCode,
      language,
      timestamp: new Date(),
    };

    io.emit('message', message);
  });

  // 닉네임 변경
  socket.on('nickname_change', ({ nickname }) => {
    const user = roomManager.updateNickname(socket.id, nickname);
    if (!user) return;

    socket.emit('system', { key: 'nickname_changed_self', params: { nickname } });
    socket.broadcast.emit('system', { key: 'nickname_changed_broadcast', params: { oldNickname: user.nickname } });
    io.emit('user_list', { users: roomManager.getAllUsers() });
  });

  // 퇴장
  socket.on('disconnect', () => {
    const user = roomManager.getUser(socket.id);
    if (user) {
      socket.broadcast.emit('system', { key: 'user_left', params: { nickname: user.nickname } });
      roomManager.removeUser(socket.id);
      io.emit('user_list', { users: roomManager.getAllUsers() });
    }
  });
};

// io 인스턴스를 저장할 변수
let io: Server;

export const setIo = (ioInstance: Server) => {
  io = ioInstance;
};
