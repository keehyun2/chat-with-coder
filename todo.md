# chat-with-coder 개선 로드맵

## Phase 1: 안정화 및 기본 수정 (필수) ✅ 완료

- [x] 1.1 console.log 제거
- [x] 1.2 백엔드 입력 검증 추가 (`backend/src/validation.ts`)
- [x] 1.3 React Error Boundary (`frontend/src/components/ErrorBoundary.tsx`)
- [x] 1.4 설정 모달에 언어 선택 추가
- [x] 1.5 연결 끊김 피드백 개선

---

## Phase 2: 핵심 UX 개선 ✅ 완료

- [x] 2.1 타이핑 표시기 — "OO님이 입력 중..." 표시 (Socket.io 타이핑 이벤트, 3초 디바운스)
- [x] 2.2 코드 블록 복사 버튼 — CodeBlock 상단에 언어명 + 복사 버튼 추가
- [x] 2.3 토스트 알림 시스템 — `Toast.tsx` 신규, 소켓 에러/복사 성공 등 알림

## Phase 3: 룸 시스템 + 메시지 영속화 ✅ 완료

- [x] 3.1 멀티 룸/채널 지원 — 룸별 사용자 관리, 사이드바 룸 목록 (general, help, showcase)
- [x] 3.2 메시지 localStorage 영속화 — 룸별 최근 200개 메시지 저장, 새로고침 복원

## Phase 4: 다듬기 ✅ 완료

- [x] 4.1 반응형/모바일 레이아웃 — 사이드바 hamburger 메뉴, Tailwind 반응형
- [x] 4.2 메시지 수정/삭제 — 본인 메시지만 수정/삭제, "(수정됨)" 표시
- [ ] 4.3 코드 품질 — SVG 아이콘 분리, React.memo, vitest 인프라
- [x] 4.4 백엔드 Rate Limiting — 10초당 5메시지 제한
