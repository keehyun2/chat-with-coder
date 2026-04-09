import type { User } from '../../../types';

interface UserListProps {
  users: User[];
  currentNickname: string;
  onNicknameChange: () => void;
}

export const UserList = ({ users, currentNickname, onNicknameChange }: UserListProps) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">
          접속자 ({users.length})
        </h3>
        <button
          onClick={onNicknameChange}
          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          변경
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentNickname} (나)
          </span>
        </div>
        {users
          .filter((user) => user.nickname !== currentNickname)
          .map((user) => (
            <div key={user.id} className="flex items-center space-x-2 p-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.nickname}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
