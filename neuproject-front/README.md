# 🦅 ForTheTeam (FTT) - Sports Calendar Web App

FTT는 스포츠 팬들을 위한 프리미엄 경기 일정 관리 및 실시간 점수 확인 플랫폼입니다. 현대적인 디자인과 고성능 아키텍처를 지향합니다.

## 🚀 주요 성과 (최근 업데이트)

최근 대규모 리팩토링을 통해 다음과 같은 기술적 개선을 이루었습니다:

- **전역 상태 관리 도입 (Zustand)**: 기존의 복잡한 Props Drilling을 제거하고 Centralized Store를 통해 데이터 흐름을 최적화했습니다.
- **실시간 데이터 최적화**: Socket.io를 통한 점수 업데이트 시, 불필요한 전체 재조회를 방지하고 특정 경기 데이터만 부분 호출(setQueriesData)하도록 개선했습니다.
- **성능 극대화**: `React 19`와 `Babel Compiler`를 기반으로 하며, `useMemo`와 `useCallback`을 통한 훅 메모이제이션 및 `select` 로직을 활용한 선제적 데이터 가공을 적용했습니다.

---

## 🛠 Tech Stack

- **Core**: React 19 (Beta), Next.js 16.1.6
- **State Management**: Zustand 5.0 (Global), TanStack Query v5 (Server State)
- **Styling & Animation**: Tailwind CSS 4, Framer Motion
- **Real-time**: Socket.io-client
- **Build & Lint**: TypeScript, ESLint 9

---

## ✨ Key Features

1. **Intelligent Calendar**: 팔로우한 팀의 일정을 한눈에 확인하고, 월별/리스트 뷰 전환이 가능합니다.
2. **Team Selector**: 종목별 선호 팀을 팔로우하고 테마 색상을 대시보드 전반에 즉시 투영합니다.
3. **Real-time Score Ticker**: 상단 티커를 통해 현재 진행 중인 경기의 점수를 실시간으로 확인합니다.
4. **Data Persistence**: Zustand의 Persist 미들웨어를 통해 새로고침 후에도 팔로우 설정과 캘린더 위치가 유지됩니다.

---

## 🏃 Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 📈 Optimization Highlights

- **Dynamic Imports**: 메인 캘린더의 각 뷰를 지연 로딩(Dynamic Import)하여 초기 번들 사이즈를 줄였습니다.
- **Suspense-driven UI**: `useSuspenseQuery`를 활용하여 선언적인 로딩 상태 관리를 구현했습니다.
- **Memoized Auth**: 인증 상태 확인 훅을 메모이제이션하여 전역 리렌더링 부하를 최소화했습니다.
