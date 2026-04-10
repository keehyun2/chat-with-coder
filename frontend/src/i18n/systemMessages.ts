import type { Language, SystemMessageKey } from '@chat/types';

const systemMessageTemplates: Record<SystemMessageKey, Record<Language, string>> = {
  user_joined: {
    ko: '{nickname}님이 입장했습니다.',
    en: '{nickname} has joined.',
    zh: '{nickname} 已加入。',
  },
  user_left: {
    ko: '{nickname}님이 퇴장했습니다.',
    en: '{nickname} has left.',
    zh: '{nickname} 已离开。',
  },
  nickname_changed_self: {
    ko: '닉네임이 {nickname}(으)로 변경되었습니다.',
    en: 'Your nickname has been changed to {nickname}.',
    zh: '昵称已更改为 {nickname}。',
  },
  nickname_changed_broadcast: {
    ko: '{oldNickname}님이 닉네임을 변경했습니다.',
    en: '{oldNickname} has changed their nickname.',
    zh: '{oldNickname} 已更改昵称。',
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
