# chat-with-coder

一个供程序员分享代码并进行实时聊天的 Web 应用。

**在线体验：** [https://chat-with-coder.vercel.app](https://chat-with-coder.vercel.app/)

## 功能

- 💬 实时聊天
- 🎨 代码语法高亮（自动检测语言并为粘贴的代码着色）
- 👤 修改昵称
- 👥 在线用户列表

> 无需登录，输入昵称即可加入。

---

## 技术栈

### 前端
| 项目 | 技术 |
|------|------|
| 框架 | React + Vite + TypeScript |
| 样式 | Tailwind CSS |
| 语法高亮 | Prism.js |
| 实时通信 | WebSocket (原生) |

### 后端
| 项目 | 技术 |
|------|------|
| 运行时 | Node.js |
| 实时通信 | Socket.io |

---

## 项目结构

```
chat-with-coder/
├── frontend/          # React + Vite 应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx       # 聊天消息列表
│   │   │   ├── ChatInput.tsx        # 消息输入框
│   │   │   ├── CodeBlock.tsx        # Prism.js 语法高亮
│   │   │   ├── UserList.tsx         # 在线用户列表
│   │   │   └── NicknameModal.tsx    # 昵称设置/修改
│   │   ├── hooks/
│   │   │   └── useSocket.ts         # Socket.io 连接 Hook
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/           # Node.js + Socket.io 服务器
│   ├── src/
│   │   ├── index.ts                 # 服务器入口
│   │   ├── socketHandler.ts         # Socket 事件处理
│   │   └── roomManager.ts           # 用户列表管理
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Socket.io 事件

### 客户端 → 服务器
| 事件 | 数据 | 说明 |
|------|------|------|
| `join` | `{ nickname }` | 加入聊天（注册昵称） |
| `message` | `{ text, isCode, language? }` | 发送消息 |
| `nickname_change` | `{ nickname }` | 修改昵称 |

### 服务器 → 客户端
| 事件 | 数据 | 说明 |
|------|------|------|
| `message` | `{ id, nickname, text, isCode, language?, timestamp }` | 接收新消息 |
| `user_list` | `{ users: [{ id, nickname }] }` | 更新在线用户列表 |
| `system` | `{ text }` | 加入/离开通知 |

---

## 代码检测逻辑

发送消息时，满足以下任一条件即会以代码块渲染：

- 使用三个反引号包裹：` ```语言名 ... ``` `
- 超过 3 行且包含缩进或特殊字符（`{`、`}`、`;`、`=>`）

语言由 Prism.js `autodetect` 插件自动检测。

---

## 快速开始

### 环境要求
- Node.js 20+
- pnpm（或 npm）

### 本地运行

```bash
# 后端
cd backend
pnpm install
pnpm dev

# 前端
cd frontend
pnpm install
pnpm dev
```

### 环境变量

**frontend/.env**
```
VITE_SOCKET_URL=http://localhost:3001
```

**backend/.env**
```
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

---

## 注意事项

- 消息仅存储在服务器内存中，**服务器重启后聊天记录将会丢失**
- 没有登录系统，仅使用昵称，因此需要添加昵称防重逻辑

---

## 其他语言

- [English](README.md)
- [한국어 (Korean)](README.ko.md)
