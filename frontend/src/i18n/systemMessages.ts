import type { Language, SystemMessageKey } from '@chat/types';

const systemMessageTemplates: Record<SystemMessageKey, Record<Language, string>> = {
  user_joined: {
    ko: '{nickname}님이 입장했습니다.',
    en: '{nickname} has joined.',
    zh: '{nickname} 已加入。',
    ja: '{nickname}さんが参加しました。',
    id: '{nickname} telah bergabung.',
    vi: '{nickname} đã tham gia.',
  },
  user_left: {
    ko: '{nickname}님이 퇴장했습니다.',
    en: '{nickname} has left.',
    zh: '{nickname} 已离开。',
    ja: '{nickname}さんが退室しました。',
    id: '{nickname} telah keluar.',
    vi: '{nickname} đã rời đi.',
  },
  nickname_changed_self: {
    ko: '닉네임이 {nickname}(으)로 변경되었습니다.',
    en: 'Your nickname has been changed to {nickname}.',
    zh: '昵称已更改为 {nickname}。',
    ja: 'ニックネームが{nickname}に変更されました。',
    id: 'Nama panggilan Anda telah diubah menjadi {nickname}.',
    vi: 'Biệt danh của bạn đã được đổi thành {nickname}.',
  },
  nickname_changed_broadcast: {
    ko: '{oldNickname}님이 닉네임을 변경했습니다.',
    en: '{oldNickname} has changed their nickname.',
    zh: '{oldNickname} 已更改昵称。',
    ja: '{oldNickname}さんがニックネームを変更しました。',
    id: '{oldNickname} telah mengubah nama panggilannya.',
    vi: '{oldNickname} đã thay đổi biệt danh.',
  },
  room_joined: {
    ko: '{nickname}님이 #{room}에 입장했습니다.',
    en: '{nickname} joined #{room}.',
    zh: '{nickname} 加入了 #{room}。',
    ja: '{nickname}さんが#{room}に参加しました。',
    id: '{nickname} bergabung ke #{room}.',
    vi: '{nickname} đã tham gia #{room}.',
  },
  room_left: {
    ko: '{nickname}님이 #{room}에서 퇴장했습니다.',
    en: '{nickname} left #{room}.',
    zh: '{nickname} 离开了 #{room}。',
    ja: '{nickname}さんが#{room}から退室しました。',
    id: '{nickname} keluar dari #{room}.',
    vi: '{nickname} đã rời #{room}.',
  },
};

export function localizeSystemMessage(
  language: Language,
  key: SystemMessageKey,
  params?: Record<string, string>
): string {
  const template = systemMessageTemplates[key]?.[language]
    ?? systemMessageTemplates[key]?.en
    ?? key;

  if (!params) return template;

  return Object.entries(params).reduce(
    (msg, [k, v]) => msg.replace(`{${k}}`, v),
    template
  );
}
