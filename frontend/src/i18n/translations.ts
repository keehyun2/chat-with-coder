export type Language = 'ko' | 'en' | 'zh';

type TranslationDict = Record<string, string>;

export const translations: Record<Language, TranslationDict> = {
  ko: {
    // NicknameModal
    'modal.enter_nickname': '닉네임을 입력하여 참여하세요',
    'modal.nickname_placeholder': '닉네임 입력...',
    'modal.join': '참여하기',

    // ChatInput
    'input.placeholder': '메시지를 입력하세요... (Shift+Enter: 줄바꿈)',
    'input.code_hint': '코드 하이라이팅: ```언어명 코드``` 또는 3줄 이상 입력',
    'input.send': '전송',

    // UserList
    'users.title': '접속자',
    'users.change': '변경',
    'users.me': '나',

    // Header
    'header.settings': '설정',
    'header.connected': '연결됨',
    'header.connecting': '연결 중...',
    'header.disconnected': '연결 안됨',

    // Connecting overlay
    'connecting.waking': '서버를 깨우는 중입니다',
    'connecting.cold_start': 'Render 무료 플랜 콜드 스타트로 최대 30초 걸릴 수 있습니다',
    'connecting.auto_start': '연결되면 자동으로 채팅이 시작됩니다',

    // Settings
    'settings.title': '설정',
    'settings.theme': '테마',
    'settings.language': '언어',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',

    // Nickname change
    'nickname.change_prompt': '새 닉네임을 입력하세요:',
    'nickname.change_title': '닉네임 변경',

    // System nickname
    'system.nickname': '시스템',
  },
  en: {
    'modal.enter_nickname': 'Enter a nickname to join',
    'modal.nickname_placeholder': 'Enter nickname...',
    'modal.join': 'Join',

    'input.placeholder': 'Type a message... (Shift+Enter for new line)',
    'input.code_hint': 'Code highlighting: ```language code``` or 3+ lines',
    'input.send': 'Send',

    'users.title': 'Users',
    'users.change': 'Change',
    'users.me': 'me',

    'header.settings': 'Settings',
    'header.connected': 'Connected',
    'header.connecting': 'Connecting...',
    'header.disconnected': 'Disconnected',

    'connecting.waking': 'Waking up the server...',
    'connecting.cold_start': 'Render free plan cold start may take up to 30 seconds',
    'connecting.auto_start': 'Chat will start automatically once connected',

    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',

    'nickname.change_prompt': 'Enter a new nickname:',
    'nickname.change_title': 'Change Nickname',

    'system.nickname': 'System',
  },
  zh: {
    'modal.enter_nickname': '输入昵称加入聊天',
    'modal.nickname_placeholder': '输入昵称...',
    'modal.join': '加入',

    'input.placeholder': '输入消息... (Shift+Enter 换行)',
    'input.code_hint': '代码高亮: ```语言 代码``` 或 3 行以上',
    'input.send': '发送',

    'users.title': '在线用户',
    'users.change': '修改',
    'users.me': '我',

    'header.settings': '设置',
    'header.connected': '已连接',
    'header.connecting': '连接中...',
    'header.disconnected': '未连接',

    'connecting.waking': '正在唤醒服务器...',
    'connecting.cold_start': 'Render 免费计划冷启动最多可能需要 30 秒',
    'connecting.auto_start': '连接后将自动开始聊天',

    'settings.title': '设置',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',

    'nickname.change_prompt': '请输入新昵称：',
    'nickname.change_title': '修改昵称',

    'system.nickname': '系统',
  },
};
