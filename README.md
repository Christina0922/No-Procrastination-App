# No Procrastination App (미루기 방지 앱)

사용자가 오늘 할 일을 등록하면 완료 시 포인트를 지급하고, 미루거나 시간 초과 시 선택한 유도 메시지/음성이 재생되는 습관 교정 앱입니다.

## 주요 기능

### 1. 할 일 등록/관리
- 오늘 할 일 추가/삭제/완료 체크
- 마감시간 설정
- 중요도 설정 (1~3)
- 실시간 달성률 표시

### 2. 미루기 방지 유도 시스템
- 할 일 생성 후 10분 이상 미시작 시 알림
- 마감 30분 전 미완료 시 알림
- 마감 시간 초과 시 알림
- 유형별 유도 문구 선택 (부드러운/직설적인/유쾌한/강한)
- 음성/팝업/진동 알림 방식 선택

### 3. 보상 시스템
- 할 일 1개 완료 = +5 포인트
- 오늘 목표 100% 완료 = 추가 +20 포인트
- 미루거나 실패 시 오늘의 보상 0
- 누적 포인트로 상품권 교환 (추후 API 연동)

### 4. 통계
- 일/주/월 달성률 그래프
- 연속 성공 일수
- 총 할 일 수

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
  /components
    TodoItem.tsx
    TodoList.tsx
    RewardPopup.tsx
    NudgeMessagePopup.tsx
    CharacterVoicePlayer.tsx
  /pages
    HomePage.tsx
    RewardPage.tsx
    SettingsPage.tsx
    StatisticsPage.tsx
  /hooks
    useTodos.ts
    useRewards.ts
    useNudge.ts
  /utils
    timeUtils.ts
    storage.ts
  /data
    nudgeMessages.ts
    characterVoices.ts
  App.tsx
  index.tsx
```

## 기술 스택

- React 18
- TypeScript
- Vite
- React Router
- Recharts (통계 그래프)
- LocalStorage (데이터 저장)

## 사용 방법

1. **할 일 추가**: 홈 화면에서 "+ 할 일 추가" 버튼 클릭
2. **완료 체크**: 할 일 항목의 체크박스 클릭
3. **보상 확인**: "보상 내역" 버튼 클릭
4. **설정 변경**: "설정" 버튼에서 유도 문구, 음성, 알림 방식 선택
5. **통계 확인**: "통계" 버튼에서 달성률 그래프 확인

## 데이터 저장

모든 데이터는 브라우저의 LocalStorage에 저장됩니다:
- 할 일 목록
- 보상 내역
- 설정
- 통계 데이터

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다:
- **프로덕션 URL**: https://no-procrastination-app.vercel.app

## 최근 업데이트

- PWA (Progressive Web App) 지원 추가
- AI 기반 할 일 추천 기능
- 미루기 패턴 분석 기능
- 반복 할 일 템플릿 관리 기능
- 빌드 최적화 및 코드 스플리팅 적용

## 라이선스

MIT

