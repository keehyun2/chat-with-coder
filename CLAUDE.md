# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js + Socket.io)
```bash
cd backend
pnpm install
pnpm dev      # Run with tsx watch for hot reload
pnpm build    # Compile TypeScript
pnpm start    # Run compiled dist/index.js
```

### Frontend (React + Vite)
```bash
cd frontend
pnpm install
pnpm dev      # Run Vite dev server on port 5173
pnpm build    # TypeScript compile + Vite build
pnpm preview  # Preview production build
```

## Architecture

This is a real-time chat application for programmers with code syntax highlighting. The project uses a shared type definition at `types/index.ts` that both frontend and backend reference.

### Frontend Architecture
- **Entry point**: `frontend/src/main.tsx` → `App.tsx`
- **State management**: Local React state (no Redux/Zustand)
- **Socket connection**: `useSocket.ts` hook - creates Socket.io instance with `autoConnect: false`, connects only after nickname is set
- **Component structure**:
  - `App.tsx` - Main container, manages messages/users state, handles socket event listeners
  - `ChatWindow.tsx` - Renders message list with auto-scroll
  - `ChatInput.tsx` - Handles message input with automatic code detection
  - `CodeBlock.tsx` - Wraps Prism.js for syntax highlighting
  - `UserList.tsx` - Shows connected users
  - `NicknameModal.tsx` - Initial nickname entry modal

### Backend Architecture
- **Entry point**: `backend/src/index.ts` - Creates HTTP server + Socket.io server
- **Socket handler**: `socketHandler.ts` - Handles all Socket.io events (join, message, nickname_change, disconnect)
- **Room manager**: `roomManager.ts` - In-memory user management using Map (no database - users lost on restart)

### Shared Types (`types/index.ts`)
Both frontend and backend import from the root `types/index.ts`:
- `Message` - Chat message with `isCode` flag and optional `language`
- `User` - User with `id` (socket.id) and `nickname`
- `ServerToClientEvents` / `ClientToServerEvents` - Socket.io type definitions

## Socket.io Events

**Client → Server:**
- `join({ nickname })` - User joins with nickname
- `message({ text, isCode, language? })` - Send message
- `nickname_change({ nickname })` - Change nickname

**Server → Client:**
- `message(Message)` - New message broadcast to all
- `user_list({ users })` - Updated user list
- `system({ text })` - System announcements (join/leave)

## Code Detection Logic

Located in `ChatInput.tsx` `detectCode()` function:

1. **Markdown code blocks**: Regex `/^```(\w*)\n([\s\S]*?)```$/` extracts language and code
2. **Auto-detection**: 3+ lines with indentation (`  ` or `\t`) OR special characters (`{`, `}`, `;`, `=>`)

When code is detected, `isCode=true` and `language` is sent to server. The `CodeBlock.tsx` component uses Prism.js to highlight the code on the client side.

## Code Highlighting

- **Library**: Prism.js (imported in `CodeBlock.tsx`)
- **Theme**: `prism-tomorrow.css` (dark theme) imported in `App.tsx`
- **Language support**: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, CSS, JSON, Markdown, Bash
- **Important**: `useLayoutEffect` is used in `CodeBlock.tsx` to ensure DOM is ready before Prism highlights

## Known Limitations

- Messages are stored in server memory only - lost on restart
- No nickname collision detection - duplicate nicknames allowed
