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

## Phase 4: 다듬기 🔄 진행 중

- [x] 4.1 반응식/모바일 레이아웃 — 사이드바 hamburger 메뉴, Tailwind 반응식
- [x] 4.2 메시지 수정/삭제 — 본인 메시지만 수정/삭제, "(수정됨)" 표시
- [ ] 4.3 코드 품질 — SVG 아이콘 분리, React.memo, vitest 인프라
- [x] 4.4 백엔드 Rate Limiting — 10초당 5메시지 제한

---

## Phase 5: 다국어 지원 확대

### 중국어 분리 ✅ 완료
- [x] 5.1 간체(zh-CN) / 번체(zh-TW) 분리 — LanguageContext detectLanguage 수정
- [x] 5.2 언어 선택자 옵션 업데이트 — SettingsModal에 언어 선택 UI 추가
- [x] 5.3 번역키 분리 — translations.ts에 이미 zh-CN, zh-TW 분리됨

### 신규 언어 추가
- [x] 5.4 스페인어(es) ✅
- [x] 5.5 아랍어(ar) ✅
- [x] 5.6 포르투갈어(pt) ✅
- [x] 5.7 힌디어(hi) ✅
- [x] 5.8 태국어(th) ✅
- [x] 5.9 독일어(de) ✅
- [x] 5.10 프랑스어(fr) ✅

### 구현 작업
- [x] 5.11 `frontend/src/i18n/translations.ts`에 모든 신규 언어 번역키 추가 ✅
- [x] 5.12 언어 드롭다운에 신규 옵션 추가 ✅
- [ ] 5.13 아랍어 RTL 레이아웃 테스트
- [ ] 5.14 모든 언어 폰트 지원 확인 (태국어, 아랍어, 힌디어 특히 주의)
