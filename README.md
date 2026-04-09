# chat-with-coder

프로그래머들이 코드를 공유하며 실시간으로 채팅하는 웹앱입니다.

## 기능

- 💬 실시간 채팅
- 🎨 코드 하이라이팅 (붙여넣은 코드를 자동으로 언어 감지 후 컬러링)
- 👤 닉네임 변경
- 👥 현재 접속한 사용자 목록

> 로그인 없이 닉네임만으로 참여 가능

---

## 기술 스택

### Frontend
| 항목 | 기술 |
|------|------|
| 프레임워크 | React + Vite + TypeScript |
| 스타일링 | Tailwind CSS |
| 코드 하이라이팅 | Prism.js |
| 실시간 통신 | WebSocket (native) |
| 배포 | Vercel |

### Backend
| 항목 | 기술 |
|------|------|
| 런타임 | Node.js |
| 실시간 통신 | Socket.io |
| 배포 | Render |

---

## 프로젝트 구조

```
chat-with-coder/
├── frontend/          # React + Vite 앱
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx       # 채팅 메시지 목록
│   │   │   ├── ChatInput.tsx        # 메시지 입력창
│   │   │   ├── CodeBlock.tsx        # Prism.js 코드 하이라이팅
│   │   │   ├── UserList.tsx         # 접속자 목록
│   │   │   └── NicknameModal.tsx    # 닉네임 설정/변경
│   │   ├── hooks/
│   │   │   └── useSocket.ts         # Socket.io 연결 훅
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/           # Node.js + Socket.io 서버
│   ├── src/
│   │   ├── index.ts                 # 서버 진입점
│   │   ├── socketHandler.ts         # 소켓 이벤트 핸들러
│   │   └── roomManager.ts           # 접속자 목록 관리
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 주요 Socket.io 이벤트

### Client → Server
| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `join` | `{ nickname }` | 입장 (닉네임 등록) |
| `message` | `{ text, isCode, language? }` | 메시지 전송 |
| `nickname_change` | `{ nickname }` | 닉네임 변경 |

### Server → Client
| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `message` | `{ id, nickname, text, isCode, language?, timestamp }` | 새 메시지 수신 |
| `user_list` | `{ users: [{ id, nickname }] }` | 접속자 목록 갱신 |
| `system` | `{ text }` | 입장/퇴장 알림 |

---

## 코드 감지 로직

메시지 입력 시 아래 조건 중 하나라도 해당하면 코드 블록으로 렌더링합니다:

- 백틱 3개로 감싸진 경우 ` ```언어명 ... ``` `
- 줄 수가 3줄 이상이고 들여쓰기 또는 특수문자(`{`, `}`, `;`, `=>`)를 포함하는 경우

언어는 Prism.js `autodetect` 플러그인으로 자동 감지합니다.

---

## 시작하기

### 요구사항
- Node.js 20+
- pnpm (또는 npm)

### 로컬 실행

```bash
# 백엔드
cd backend
pnpm install
pnpm dev

# 프론트엔드
cd frontend
pnpm install
pnpm dev
```

### 환경 변수

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

## 배포

### Backend → Render
1. GitHub에 push
2. Render → New Web Service → GitHub 연동
3. Build Command: `pnpm install && pnpm build`
4. Start Command: `pnpm start`
5. 환경 변수 `CLIENT_ORIGIN` 설정 (Vercel 도메인)

### Frontend → Vercel
1. Vercel → New Project → GitHub 연동
2. Framework Preset: Vite
3. 환경 변수 `VITE_SOCKET_URL` 설정 (Render 서버 URL)

> ⚠️ Render 무료 플랜은 15분 비활성 시 슬립됩니다.  
> 첫 접속 시 30~60초 지연이 발생할 수 있습니다.

---

## 주의사항

- 메시지는 서버 메모리에만 저장되므로 **서버 재시작 시 채팅 기록이 사라집니다**
- 로그인 없이 닉네임만 사용하므로 닉네임 중복 방지 로직이 필요합니다
- Render 슬립 문제가 심각하다면 **Fly.io** 또는 **Railway** 전환을 고려하세요
