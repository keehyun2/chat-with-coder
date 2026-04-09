import { Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, Message } from '../../types';
import { createRoomManager } from './roomManager';

const roomManager = createRoomManager();

export const setupSocketHandlers = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  // 입장
  socket.on('join', ({ nickname }) => {
    const user = roomManager.addUser(socket.id, nickname);
    socket.emit('system', { text: `${nickname}님이 입장했습니다.` });
    socket.broadcast.emit('system', { text: `${nickname}님이 입장했습니다.` });
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

    socket.emit('system', { text: `닉네임이 ${nickname}으로 변경되었습니다.` });
    socket.broadcast.emit('system', { text: `${user.nickname}님이 닉네임을 변경했습니다.` });
    io.emit('user_list', { users: roomManager.getAllUsers() });
  });

  // 퇴장
  socket.on('disconnect', () => {
    const user = roomManager.getUser(socket.id);
    if (user) {
      socket.broadcast.emit('system', { text: `${user.nickname}님이 퇴장했습니다.` });
      roomManager.removeUser(socket.id);
      io.emit('user_list', { users: roomManager.getAllUsers() });
    }
  });
};

// io 인스턴스를 저장할 변수
let io: any;

export const setIo = (ioInstance: any) => {
  io = ioInstance;
};
