# chat-with-coder

A real-time chat web app for programmers to share and discuss code.

**Try it out:** [https://chat-with-coder.vercel.app](https://chat-with-coder.vercel.app/)

## Features

- 💬 Real-time chat
- 🎨 Code syntax highlighting (automatic language detection and coloring for pasted code)
- 👤 Nickname changes
- 👥 Active user list

> No login required — just enter a nickname to join.

---

## Tech Stack

### Frontend
| Item | Technology |
|------|-----------|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Syntax Highlighting | Prism.js |
| Real-time Communication | WebSocket (native) |

### Backend
| Item | Technology |
|------|-----------|
| Runtime | Node.js |
| Real-time Communication | Socket.io |

---

## Project Structure

```
chat-with-coder/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx       # Chat message list
│   │   │   ├── ChatInput.tsx        # Message input
│   │   │   ├── CodeBlock.tsx        # Prism.js syntax highlighting
│   │   │   ├── UserList.tsx         # Active user list
│   │   │   └── NicknameModal.tsx    # Nickname setup/change
│   │   ├── hooks/
│   │   │   └── useSocket.ts         # Socket.io connection hook
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/           # Node.js + Socket.io server
│   ├── src/
│   │   ├── index.ts                 # Server entry point
│   │   ├── socketHandler.ts         # Socket event handler
│   │   └── roomManager.ts           # User list management
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Socket.io Events

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `join` | `{ nickname }` | Join with a nickname |
| `message` | `{ text, isCode, language? }` | Send a message |
| `nickname_change` | `{ nickname }` | Change nickname |

### Server → Client
| Event | Data | Description |
|-------|------|-------------|
| `message` | `{ id, nickname, text, isCode, language?, timestamp }` | Receive a new message |
| `user_list` | `{ users: [{ id, nickname }] }` | Updated user list |
| `system` | `{ text }` | Join/leave notification |

---

## Code Detection Logic

When a message is sent, it is rendered as a code block if any of the following conditions are met:

- Wrapped in triple backticks: ` ```language ... ``` `
- 3+ lines and contains indentation or special characters (`{`, `}`, `;`, `=>`)

The language is auto-detected by the Prism.js `autodetect` plugin.

---

## Getting Started

### Requirements
- Node.js 20+
- pnpm (or npm)

### Local Development

```bash
# Backend
cd backend
pnpm install
pnpm dev

# Frontend
cd frontend
pnpm install
pnpm dev
```

### Environment Variables

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

## Notes

- Messages are stored in server memory only — **chat history is lost on server restart**.
- No login system, so nickname collision prevention is needed.

---

## Other Languages

- [한국어 (Korean)](README.ko.md)
- [中文 (Chinese)](README.zh.md)
