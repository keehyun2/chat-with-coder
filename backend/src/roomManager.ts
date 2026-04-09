import { User } from '../types';

interface RoomManager {
  users: Map<string, User>;
  addUser: (id: string, nickname: string) => User;
  removeUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
  getAllUsers: () => User[];
  updateNickname: (id: string, nickname: string) => User | undefined;
}

export const createRoomManager = (): RoomManager => {
  const users = new Map<string, User>();

  const addUser = (id: string, nickname: string): User => {
    const user: User = { id, nickname };
    users.set(id, user);
    return user;
  };

  const removeUser = (id: string): void => {
    users.delete(id);
  };

  const getUser = (id: string): User | undefined => {
    return users.get(id);
  };

  const getAllUsers = (): User[] => {
    return Array.from(users.values());
  };

  const updateNickname = (id: string, nickname: string): User | undefined => {
    const user = users.get(id);
    if (user) {
      user.nickname = nickname;
      users.set(id, user);
      return user;
    }
    return undefined;
  };

  return {
    users,
    addUser,
    removeUser,
    getUser,
    getAllUsers,
    updateNickname,
  };
};
