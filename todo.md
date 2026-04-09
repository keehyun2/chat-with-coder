# TODO - chat-with-coder

## Phase 1: 프로젝트 기본 구조 설정
- [x] 1-1. 루트 package.json 생성 (monorepo workspace)
- [x] 1-2. frontend 폴더 생성 및 Vite + React + TS 설정
- [x] 1-3. backend 폴더 생성 및 Node.js + TS 설정
- [x] 1-4. 공유 타입 정의 (types 패키지)

## Phase 2: 백엔드 개발
- [x] 2-1. Socket.io 서버 기본 구조 (index.ts)
- [x] 2-2. 소켓 이벤트 핸들러 (socketHandler.ts)
- [x] 2-3. 접속자 목록 관리 (roomManager.ts)
- [x] 2-4. 환경 변수 설정 (.env.example)

## Phase 3: 프론트엔드 개발
- [x] 3-1. Vite 기본 설정 및 Tailwind CSS 설치
- [x] 3-2. Socket.io 클라이언트 연결 훅 (useSocket.ts)
- [x] 3-3. 컴포넌트 구현
  - [x] NicknameModal.tsx - 닉네임 설정 모달
  - [x] ChatWindow.tsx - 채팅 메시지 목록
  - [x] ChatInput.tsx - 메시지 입력창
  - [x] CodeBlock.tsx - Prism.js 코드 하이라이팅
  - [x] UserList.tsx - 접속자 목록
- [x] 3-4. App.tsx 메인 컴포넌트 조립
- [x] 3-5. 환경 변수 설정 (.env.example)

## Phase 4: 코드 감지 로직 구현
- [x] 4-1. 백틱 코드 블록 감지
- [x] 4-2. 자동 코드 감지 (3줄 이상 + 특수문자)
- [x] 4-3. Prism.js autodetect 플러그인 설정

## Phase 5: 배포 설정
- [x] 5-1. Vercel 배포 설정 (vercel.json)
- [x] 5-2. Render 배포 설정 (render.yaml)
- [x] 5-3. 환경 변수 가이드 업데이트

---

## 다음 단계

1. **의존성 설치**
   ```bash
   # 루트에서 공통 의존성 설치
   pnpm install

   # 백엔드 의존성 설치
   cd backend
   pnpm install

   # 프론트엔드 의존성 설치
   cd ../frontend
   pnpm install
   ```

2. **환경 변수 설정**
   ```bash
   # frontend/.env
   cp frontend/.env.example frontend/.env

   # backend/.env
   cp backend/.env.example backend/.env
   ```

3. **로컬 실행**
   ```bash
   # 백엔드 (터미널 1)
   cd backend
   pnpm dev

   # 프론트엔드 (터미널 2)
   cd frontend
   pnpm dev
   ```

4. **배포**
   - **Frontend → Vercel**: Vercel 대시보드에서 GitHub 레포 연결 후 배포
   - **Backend → Render**: Render 대시보드에서 GitHub 레포 연결 후 배포
