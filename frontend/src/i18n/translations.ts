export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'id' | 'vi';

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
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    // Nickname change
    'nickname.change_prompt': '새 닉네임을 입력하세요:',
    'nickname.change_title': '닉네임 변경',

    // System nickname
    'system.nickname': '시스템',

    // Toast
    'toast.copied': '클립보드에 복사되었습니다',
    'toast.copy_failed': '복사에 실패했습니다',

    // Typing indicator
    'typing.single': '{name}님이 입력 중...',
    'typing.multiple': '{names}님이 입력 중...',
    'typing.others': '{name} 외 {count}명이 입력 중...',

    // Rooms
    'rooms.title': '채널',
    'rooms.general': '일반',
    'rooms.help': '도움',
    'rooms.showcase': '자랑하기',

    // Mobile menu
    'menu.open': '메뉴',

    // Message actions
    'message.edit': '수정',
    'message.delete': '삭제',
    'message.edited': '(수정됨)',
    'message.deleted': '삭제된 메시지',
    'message.edit_prompt': '메시지를 수정하세요:',
    'message.translate': '번역',
    'message.show_original': '원문',
    'message.translated': '(번역됨)',
    'message.translating': '번역 중...',
    'message.translate_error': '번역에 실패했습니다',
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
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    'nickname.change_prompt': 'Enter a new nickname:',
    'nickname.change_title': 'Change Nickname',

    'system.nickname': 'System',

    // Toast
    'toast.copied': 'Copied to clipboard',
    'toast.copy_failed': 'Failed to copy',

    // Typing indicator
    'typing.single': '{name} is typing...',
    'typing.multiple': '{names} are typing...',
    'typing.others': '{name} and {count} others are typing...',

    // Rooms
    'rooms.title': 'Channels',
    'rooms.general': 'General',
    'rooms.help': 'Help',
    'rooms.showcase': 'Showcase',

    // Mobile menu
    'menu.open': 'Menu',

    // Message actions
    'message.edit': 'Edit',
    'message.delete': 'Delete',
    'message.edited': '(edited)',
    'message.deleted': 'Message deleted',
    'message.edit_prompt': 'Edit your message:',
    'message.translate': 'Translate',
    'message.show_original': 'Original',
    'message.translated': '(translated)',
    'message.translating': 'Translating...',
    'message.translate_error': 'Translation failed',
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
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    'nickname.change_prompt': '请输入新昵称：',
    'nickname.change_title': '修改昵称',

    'system.nickname': '系统',

    // Toast
    'toast.copied': '已复制到剪贴板',
    'toast.copy_failed': '复制失败',

    // Typing indicator
    'typing.single': '{name}正在输入...',
    'typing.multiple': '{names}正在输入...',
    'typing.others': '{name}等{count}人正在输入...',

    // Rooms
    'rooms.title': '频道',
    'rooms.general': '综合',
    'rooms.help': '帮助',
    'rooms.showcase': '展示',

    // Mobile menu
    'menu.open': '菜单',

    // Message actions
    'message.edit': '编辑',
    'message.delete': '删除',
    'message.edited': '(已编辑)',
    'message.deleted': '消息已删除',
    'message.edit_prompt': '编辑您的消息：',
    'message.translate': '翻译',
    'message.show_original': '原文',
    'message.translated': '(已翻译)',
    'message.translating': '翻译中...',
    'message.translate_error': '翻译失败',
  },
  ja: {
    // NicknameModal
    'modal.enter_nickname': 'ニックネームを入力して参加',
    'modal.nickname_placeholder': 'ニックネームを入力...',
    'modal.join': '参加する',

    // ChatInput
    'input.placeholder': 'メッセージを入力... (Shift+Enter: 改行)',
    'input.code_hint': 'コードハイライト: ```言語名 コード``` または3行以上',
    'input.send': '送信',

    // UserList
    'users.title': 'オンライン',
    'users.change': '変更',
    'users.me': '自分',

    // Header
    'header.settings': '設定',
    'header.connected': '接続済み',
    'header.connecting': '接続中...',
    'header.disconnected': '未接続',

    // Connecting overlay
    'connecting.waking': 'サーバーを起動しています...',
    'connecting.cold_start': 'Render無料プランのコールドスタートは最大30秒かかる場合があります',
    'connecting.auto_start': '接続されると自動的にチャットが開始されます',

    // Settings
    'settings.title': '設定',
    'settings.theme': 'テーマ',
    'settings.language': '言語',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    // Nickname change
    'nickname.change_prompt': '新しいニックネームを入力してください：',
    'nickname.change_title': 'ニックネーム変更',

    // System nickname
    'system.nickname': 'システム',

    // Toast
    'toast.copied': 'クリップボードにコピーしました',
    'toast.copy_failed': 'コピーに失敗しました',

    // Typing indicator
    'typing.single': '{name}さんが入力中...',
    'typing.multiple': '{names}さんが入力中...',
    'typing.others': '{name}さんと他{count}人が入力中...',

    // Rooms
    'rooms.title': 'チャンネル',
    'rooms.general': '一般',
    'rooms.help': 'ヘルプ',
    'rooms.showcase': 'ショーケース',

    // Mobile menu
    'menu.open': 'メニュー',

    // Message actions
    'message.edit': '編集',
    'message.delete': '削除',
    'message.edited': '(編集済み)',
    'message.deleted': 'メッセージが削除されました',
    'message.edit_prompt': 'メッセージを編集してください：',
    'message.translate': '翻訳',
    'message.show_original': '原文',
    'message.translated': '(翻訳済み)',
    'message.translating': '翻訳中...',
    'message.translate_error': '翻訳に失敗しました',
  },
  id: {
    // NicknameModal
    'modal.enter_nickname': 'Masukkan nama panggilan untuk bergabung',
    'modal.nickname_placeholder': 'Masukkan nama panggilan...',
    'modal.join': 'Gabung',

    // ChatInput
    'input.placeholder': 'Ketik pesan... (Shift+Enter untuk baris baru)',
    'input.code_hint': 'Sorotan kode: ```bahasa kode``` atau 3+ baris',
    'input.send': 'Kirim',

    // UserList
    'users.title': 'Pengguna',
    'users.change': 'Ubah',
    'users.me': 'saya',

    // Header
    'header.settings': 'Pengaturan',
    'header.connected': 'Terhubung',
    'header.connecting': 'Menghubungkan...',
    'header.disconnected': 'Terputus',

    // Connecting overlay
    'connecting.waking': 'Membangunkan server...',
    'connecting.cold_start': 'Cold start paket gratis Render mungkin memakan waktu hingga 30 detik',
    'connecting.auto_start': 'Obrolan akan dimulai secara otomatis setelah terhubung',

    // Settings
    'settings.title': 'Pengaturan',
    'settings.theme': 'Tema',
    'settings.language': 'Bahasa',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    // Nickname change
    'nickname.change_prompt': 'Masukkan nama panggilan baru:',
    'nickname.change_title': 'Ubah Nama Panggilan',

    // System nickname
    'system.nickname': 'Sistem',

    // Toast
    'toast.copied': 'Disalin ke papan klip',
    'toast.copy_failed': 'Gagal menyalin',

    // Typing indicator
    'typing.single': '{name} sedang mengetik...',
    'typing.multiple': '{names} sedang mengetik...',
    'typing.others': '{name} dan {count} lainnya sedang mengetik...',

    // Rooms
    'rooms.title': 'Saluran',
    'rooms.general': 'Umum',
    'rooms.help': 'Bantuan',
    'rooms.showcase': 'Pameran',

    // Mobile menu
    'menu.open': 'Menu',

    // Message actions
    'message.edit': 'Edit',
    'message.delete': 'Hapus',
    'message.edited': '(diedit)',
    'message.deleted': 'Pesan dihapus',
    'message.edit_prompt': 'Edit pesan Anda:',
    'message.translate': 'Terjemahkan',
    'message.show_original': 'Asli',
    'message.translated': '(diterjemahkan)',
    'message.translating': 'Menerjemahkan...',
    'message.translate_error': 'Terjemahan gagal',
  },
  vi: {
    // NicknameModal
    'modal.enter_nickname': 'Nhập biệt danh để tham gia',
    'modal.nickname_placeholder': 'Nhập biệt danh...',
    'modal.join': 'Tham gia',

    // ChatInput
    'input.placeholder': 'Nhập tin nhắn... (Shift+Enter: xuống dòng)',
    'input.code_hint': 'Tô sáng mã: ```ngôn ngữ mã``` hoặc 3+ dòng',
    'input.send': 'Gửi',

    // UserList
    'users.title': 'Người dùng',
    'users.change': 'Thay đổi',
    'users.me': 'tôi',

    // Header
    'header.settings': 'Cài đặt',
    'header.connected': 'Đã kết nối',
    'header.connecting': 'Đang kết nối...',
    'header.disconnected': 'Đã ngắt kết nối',

    // Connecting overlay
    'connecting.waking': 'Đang khởi động máy chủ...',
    'connecting.cold_start': 'Khởi động lạnh gói miễn phí Render có thể mất đến 30 giây',
    'connecting.auto_start': 'Trò chuyện sẽ tự động bắt đầu khi kết nối',

    // Settings
    'settings.title': 'Cài đặt',
    'settings.theme': 'Giao diện',
    'settings.language': 'Ngôn ngữ',
    'settings.lang_ko': '한국어',
    'settings.lang_en': 'English',
    'settings.lang_zh': '中文',
    'settings.lang_ja': '日本語',
    'settings.lang_id': 'Bahasa Indonesia',
    'settings.lang_vi': 'Tiếng Việt',

    // Nickname change
    'nickname.change_prompt': 'Nhập biệt danh mới:',
    'nickname.change_title': 'Thay đổi biệt danh',

    // System nickname
    'system.nickname': 'Hệ thống',

    // Toast
    'toast.copied': 'Đã sao chép vào clipboard',
    'toast.copy_failed': 'Sao chép thất bại',

    // Typing indicator
    'typing.single': '{name} đang nhập...',
    'typing.multiple': '{names} đang nhập...',
    'typing.others': '{name} và {count} người khác đang nhập...',

    // Rooms
    'rooms.title': 'Kênh',
    'rooms.general': 'Chung',
    'rooms.help': 'Trợ giúp',
    'rooms.showcase': 'Trưng bày',

    // Mobile menu
    'menu.open': 'Menu',

    // Message actions
    'message.edit': 'Sửa',
    'message.delete': 'Xóa',
    'message.edited': '(đã sửa)',
    'message.deleted': 'Tin nhắn đã bị xóa',
    'message.edit_prompt': 'Sửa tin nhắn của bạn:',
    'message.translate': 'Dịch',
    'message.show_original': 'Gốc',
    'message.translated': '(đã dịch)',
    'message.translating': 'Đang dịch...',
    'message.translate_error': 'Dịch thất bại',
  },
};
