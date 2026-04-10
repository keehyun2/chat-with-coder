import type { Language, SystemMessageKey } from '@chat/types';

const systemMessageTemplates: Record<SystemMessageKey, Record<Language, string>> = {
  user_joined: {
    ko: '{nickname}님이 입장했습니다.',
    en: '{nickname} has joined.',
    'zh-CN': '{nickname} 已加入。',
    'zh-TW': '{nickname} 已加入。',
    ja: '{nickname}さんが参加しました。',
    id: '{nickname} telah bergabung.',
    vi: '{nickname} đã tham gia.',
    es: '{nickname} se ha unido.',
    ar: '{nickname} انضم.',
    pt: '{nickname} entrou.',
    hi: '{nickname} शामिल हो गए।',
    th: '{nickname} เข้าร่วมแล้ว',
    de: '{nickname} ist beigetreten.',
    fr: '{nickname} a rejoint.',
  },
  user_left: {
    ko: '{nickname}님이 퇴장했습니다.',
    en: '{nickname} has left.',
    'zh-CN': '{nickname} 已离开。',
    'zh-TW': '{nickname} 已離開。',
    ja: '{nickname}さんが退室しました。',
    id: '{nickname} telah keluar.',
    vi: '{nickname} đã rời đi.',
    es: '{nickname} se ha ido.',
    ar: '{nickname} غادر.',
    pt: '{nickname} saiu.',
    hi: '{nickname} चले गए।',
    th: '{nickname} ออกไปแล้ว',
    de: '{nickname} ist gegangen.',
    fr: '{nickname} est parti.',
  },
  nickname_changed_self: {
    ko: '닉네임이 {nickname}(으)로 변경되었습니다.',
    en: 'Your nickname has been changed to {nickname}.',
    'zh-CN': '昵称已更改为 {nickname}。',
    'zh-TW': '暱稱已變更為 {nickname}。',
    ja: 'ニックネームが{nickname}に変更されました。',
    id: 'Nama panggilan Anda telah diubah menjadi {nickname}.',
    vi: 'Biệt danh của bạn đã được đổi thành {nickname}.',
    es: 'Tu apodo ha sido cambiado a {nickname}.',
    ar: 'تم تغيير اسمك المستعار إلى {nickname}.',
    pt: 'Seu apelido foi alterado para {nickname}.',
    hi: 'आपका उपनाम {nickname} में बदल दिया गया है।',
    th: 'เปลี่ยนชื่อเล่นของคุณเป็น {nickname} แล้ว',
    de: 'Dein Spitzname wurde zu {nickname} geändert.',
    fr: 'Ton pseudo a été changé en {nickname}.',
  },
  nickname_changed_broadcast: {
    ko: '{oldNickname}님이 닉네임을 변경했습니다.',
    en: '{oldNickname} has changed their nickname.',
    'zh-CN': '{oldNickname} 已更改昵称。',
    'zh-TW': '{oldNickname} 已變更暱稱。',
    ja: '{oldNickname}さんがニックネームを変更しました。',
    id: '{oldNickname} telah mengubah nama panggilannya.',
    vi: '{oldNickname} đã thay đổi biệt danh.',
    es: '{oldNickname} ha cambiado su apodo.',
    ar: '{oldNickname} غير اسمه المستعار.',
    pt: '{oldNickname} alterou seu apelido.',
    hi: '{oldNickname} ने अपना उपनाम बदल दिया।',
    th: '{oldNickname} เปลี่ยนชื่อเล่นแล้ว',
    de: '{oldNickname} hat den Spitznamen geändert.',
    fr: '{oldNickname} a changé de pseudo.',
  },
  room_joined: {
    ko: '{nickname}님이 #{room}에 입장했습니다.',
    en: '{nickname} joined #{room}.',
    'zh-CN': '{nickname} 加入了 #{room}。',
    'zh-TW': '{nickname} 加入了 #{room}。',
    ja: '{nickname}さんが#{room}に参加しました。',
    id: '{nickname} bergabung ke #{room}.',
    vi: '{nickname} đã tham gia #{room}.',
    es: '{nickname} se unió a #{room}.',
    ar: '{nickname} انضم إلى #{room}.',
    pt: '{nickname} entrou em #{room}.',
    hi: '{nickname} #{room} में शामिल हुए।',
    th: '{nickname} เข้าร่วม #{room}',
    de: '{nickname} ist #{room} beigetreten.',
    fr: '{nickname} a rejoint #{room}.',
  },
  room_left: {
    ko: '{nickname}님이 #{room}에서 퇴장했습니다.',
    en: '{nickname} left #{room}.',
    'zh-CN': '{nickname} 离开了 #{room}。',
    'zh-TW': '{nickname} 離開了 #{room}。',
    ja: '{nickname}さんが#{room}から退室しました。',
    id: '{nickname} keluar dari #{room}.',
    vi: '{nickname} đã rời {room}.',
    es: '{nickname} salió de #{room}.',
    ar: '{nickname} غادر #{room}.',
    pt: '{nickname} saiu de #{room}.',
    hi: '{nickname} #{room} से चले गए।',
    th: '{nickname} ออกจาก #{room}',
    de: '{nickname} hat #{room} verlassen.',
    fr: '{nickname} a quitté #{room}.',
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
