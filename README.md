<div align="center">
  <h1>🏆 FOR THE TEAM (NeuProject)</h1>
  <p><strong>Enterprise-Grade Unified Sports Calendar & Dynamic Theming Platform</strong></p>
  <p>유럽 축구부터 야구, 농구, F1, e스포츠까지 내가 응원하는 팀의 일정을 한 곳에서 관리하세요.</p>
</div>

<br />

## ✨ 시스템 아키텍처 및 주요 기능 (System Architecture & Key Features)

본 프로젝트는 대규모 트래픽과 다양한 외부 데이터 소스를 안정적으로 통합하기 위해 설계된 종합 스포츠 플랫폼입니다. MSA(Microservices Architecture) 지향적인 모듈화 설계와 CSR/SSR이 결합된 하이브리드 프론트엔드 구성을 특징으로 합니다.

*   **📅 Unified Sports Data Aggregation**:
    *   다양한 외부 경기 데이터 공급자(Football-Data.org, PandaScore, ESPN 등)의 이기종(Heterogeneous) JSON/XML 응답을 규격화된 도메인 모델(League, Team, Match)로 정규화(Normalization).
    *   NestJS의 `HttpModule`(Axios 기반) 및 의존성 주입(DI)을 활용한 각 스포츠별 어댑터 패턴 적용.
*   **❤️ Personalized Data Delivery**:
    *   JWT(JSON Web Token) 및 Passport.js를 활용한 상태 비저장(Stateless) 세션 관리.
    *   사용자(User)와 팀(Team) 간의 다대다(N:M) 매핑을 통한 맞춤형 캘린더 피드 제공 효율화.
*   **🎨 Dynamic CSS Variable Theming**:
    *   React Context 기반의 상태 및 Next.js SSR 환경 이슈를 최소화하기 위해 루트 문서(document) 요소의 `--color-primary`, `--color-secondary` 등의 CSS 변수를 실시간 DOM 조작으로 런타임에 주입.
    *   Hex 코드 분석 알고리즘(`getLuminance`, `getContrastColor`)을 커스텀 훅(`useTheme`)에 내장하여 배경색상 대비 가독성(WCAG 기준)을 자동 연산.
*   **⚡ High-Performance UI Rendering**: 
    *   Next.js App Router (React Server Components)를 통한 TTI(Time To Interactive) 개선.
    *   Framer Motion의 `useDragControls`, `layoutId` 속성을 활용한 GPU 가속(GPU-accelerated) 기반의 부드러운 상태 전이 및 모달 애니메이션.

---

## 🛠️ 상세 기술 스택 (Technical Stack)

### 💻 프론트엔드 (Frontend) - `neuproject-front`
<p>
  <img src="https://img.shields.io/badge/Next.js%20(15.x)-000000?style=flat-square&logo=Next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%20(19.x)-61DAFB?style=flat-square&logo=React&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript%20(5.x)-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=Framer&logoColor=white" alt="Framer Motion" />
</p>

*   **Architecture**: App Router 기반 모듈식 컴포넌트 설계 (`src/components`, `src/hooks`, `src/app`).
*   **Build Optimization**: `next.config.ts`에 `output: "standalone"` 속성을 적용하여 Docker 환경에서의 이미지 사이즈 최적화 및 프로덕션 번들 트리쉐이킹(Tree-shaking) 처리.
*   **State Management**: Context API를 활용한 관심사 분리. (예: `ThemeContext` - 테마 제어, `AuthContext` - JWT 보관 로직 격리).

### ⚙️ 백엔드 (Backend) - `neuproject-back`
<p>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Swagger%20(OpenAPI%203.0)-85EA2D?style=flat-square&logo=Swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=Passport&logoColor=black" alt="Passport" />
</p>

*   **Architecture**: NestJS Dependency Injection(DI) 생태계 위에서 Controller, Service, Module 분리 및 싱글톤(Singleton) 인스턴스 라이프사이클 관리.
*   **Data Synchronization (SyncService)**: `Cron` 작업 또는 백그라운드 Worker를 통한 배치(Batch) 처리. 특정 어댑터(예: KBO 크롤링 패턴 등)가 CORS/Rate-limit(403/429) 및 쿼터 등의 사유로 실패하더라도 `this.logger.error` 처리 후 전체 동기화 파이프라인이 중단되지 않도록 Failover 메커니즘이 탑재.
*   **API Validation**: `@nestjs/swagger`와 `class-validator`를 결합하여 런타임 DTO 제약조건 준수 확인 및 동적 OpenAPI(Swagger UI) 문서 자동화 구현.

### 🗄️ 데이터베이스 및 인프라 (DB & Infra)
<p>
  <img src="https://img.shields.io/badge/PostgreSQL%20(15.x)-4169E1?style=flat-square&logo=PostgreSQL&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma%20ORM-2D3748?style=flat-square&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=Supabase&logoColor=black" alt="Supabase" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white" alt="Docker Compose" />
</p>

*   **Database**: PostgreSQL의 트랜잭션 무결성 및 CTE(Common Table Expressions) 등의 이점을 수용. Supabase의 분산 엣지 환경 대응 적용.
*   **ORM (Prisma)**: 
    *   컴파일 에러를 통해 쿼리 오류를 사전 차단하는 Type-Safe 엔진 구동 (`PrismaClient`).
    *   복잡한 중첩 릴레이션 (`home_team`, `away_team`, `leagues`, `follows`) 관계를 GraphQL 스타일의 Prisma 객체 모델 매핑으로 간소화 구축. 
*   **Containerization**: 멀티-스테이지 빌드(Multi-stage build) 패턴을 따르는 `Dockerfile`로 작성된 Node.js(Alpine 20) 경량 런타임 통합. (`docker-compose.yml` 리소스를 통한 무상태 컨테이너 묶음 오케스트레이션 구성 완료)

---

## 🏗️ 코딩 스탠다드 및 엄격한 개발 원칙 (Coding Standards)

본 프로젝트에 참여하는 팀 단위 컨트리뷰터는 아래 규약을 필수로 준수해야 합니다.

1.  **Strict DTO Rules**: 클라이언트 및 외부 의존성의 모든 입력값은 `@nestjs/common` 파이프에 기반한 `class-transformer` 변환 및 유효성 검증을 거쳐야 합니다. (Any 타입 허용 절대 금지)
2.  **Prisma Anti-Pattern 방지**: 복잡한 집계(Aggregation)를 제외한 로직에서 Raw Query(`$queryRaw`)의 남용을 금지하며, `PrismaService`의 추상화를 활용해 SQL Injection 위험 표면을 완전히 차단합니다.
3.  **Circuit Breaker & Fallback**: 모든 외부 API 요청에는 타임아웃(Timeout) 한도 및 실패(Fallback)에 대비한 보호 로직(`try-catch`)이 강제됩니다.
4.  **Logging**: 에러 발생 시 콜스택(Call-stack) 혼란을 막기 위해 NestJS 자체 `Logger` 인터페이스 인스턴스화를 통한 네임스페이스 로깅(`this.logger`)을 유지합니다.

---

## 🚀 도커 환경 배포 가이드 (Deployment via Docker)

`docker-compose` 구성을 활용해 호스트 머신의 환경(Node버전 차이 등) 제약 없이 즉각적으로 Production 수준의 서버를 기동할 수 있습니다.

### 1) 환경 변수 파일 준비 (`.env`)
프로젝트 루트 또는 각 폴더 최상단에 마스터 `.env` 리소스를 세팅합니다. (Supabase 연결 문자열, JWT 시크릿, 및 각종 API Key 포함)

### 2) 서비스 빌드 및 백그라운드 구동
```bash
# 루트 디렉토리(docker-compose.yml 위치)에서 실행
docker-compose up -d --build
```
*   `--build` 옵션: 최신 소스 변경 사항을 감지하여 Node.js 앱(Standalone)을 새롭게 컴파일 및 빌드합니다.
*   `-d` 옵션: 서버를 백그라운드 환경으로 넘겨 데몬으로 안전하게 유지시킵니다.

### 3) 접속 포트 확인
*   **프론트엔드 (SSR 클라이언트)**: [http://localhost:3000](http://localhost:3000)
*   **백엔드 API 및 Swagger**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### 4) 서비스 상태 점검 및 종료
```bash
# 구동 중인 컨테이너 상태 로그 추적
docker-compose logs -f

# 서비스 완전 종료 및 컨테이너 삭제
docker-compose down
```

---

## 💻 로컬 개발 가이드 (Local Development)

Docker 없이 코드를 직접 실행하고 수정할 때의 절차입니다.

```bash
# 1. 의존성 설치
cd neuproject-back && npm install
cd ../neuproject-front && npm install

# 2. ORM 연동 밑거름 (DB 마이그레이션)
cd ../neuproject-back
npx prisma generate
npx prisma db push

# 3. 핫리로드(HMR) 작동 개발 서버 띄우기
npm run start:dev   # 백엔드

# (다른 터미널 창에서)
cd ../neuproject-front
npm run dev         # 프론트엔드 (3000포트 대기)
```
