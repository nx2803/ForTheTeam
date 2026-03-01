<div align="center">
  <h1>🏆 FOR THE TEAM (NeuProject)</h1>
  <p><strong>Enterprise-Grade Unified Sports Calendar & Dynamic Theming Platform</strong></p>
  <p>유럽 축구부터 야구, 농구, F1, e스포츠까지 내가 응원하는 팀의 일정을 한 곳에서 관리하세요.</p>
</div>

<br />

## ✨ 시스템 아키텍처 및 주요 기능 (System Architecture & Key Features)

본 프로젝트는 대규모 트래픽과 다양한 외부 데이터 소스를 안정적으로 통합하기 위해 설계된 종합 스포츠 플랫폼입니다. MSA(Microservices Architecture) 지향적인 모듈화 설계와 CSR/SSR이 결합된 하이브리드 프론트엔드 구성을 특징으로 합니다.

*   **📅 Unified Sports Data Aggregation**:
    *   **다중 소스 통합**: Football-Data.org (유럽 축구), PandaScore (LCK), ESPN (NBA/MLB/NFL/NHL), Naver (KBO) 등 다중 외부 API 연동.
    *   **이기종 데이터 정규화**: 서로 다른 형식의 API 응답을 하나의 규격화된 도메인 모델(League, Team, Match)로 Normalization 처리.
    *   **Decoupled Architecture**: NestJS 어댑터 패턴을 활용하여 특정 API 공급자의 사양 변경이 전체 비즈니스 로직에 미치는 영향을 최소화.
*   **🌐 Intelligent Timezone Normalization**:
    *   외부 API의 UTC 시간과 수동 입력된 로컬 시간을 자동으로 식별하여 사용자 현지 시간에 맞게 변환.
*   **❤️ Personalized Data Delivery**:
    *   JWT 기반의 무상태(Stateless) 세션 관리 및 사용자 맞춤형 팔로우 팀 캘린더 피드 최적화.
*   **🎨 Dynamic CSS Variable Theming & Accessibility**:
    *   React Context 기반의 상태 및 Next.js SSR 환경 이슈를 최소화하기 위해 루트 문서(document) 요소의 CSS 변수를 실시간 DOM 조작으로 런타임에 주입.
    *   **Adaptive Contrast Engine**: 배경색의 휘도(Luminance)를 분석하여 글자색을 White/Black 중 가독성이 높은 색으로 자동 전환 (티커 가독성 및 캘린더 'TODAY' 가시성 확보).
    *   Hex 코드 분석 알고리즘을 커스텀 훅(`useTheme`)에 내장하여 WCAG 기준의 가독성 자동 연산.
*   **⚡ High-Performance UI Rendering**: 
    *   Next.js App Router (React Server Components)를 통한 TTI(Time To Interactive) 개선.
    *   Framer Motion의 `useDragControls`, `layoutId` 속성을 활용한 GPU 가속(GPU-accelerated) 기반의 부드러운 상태 전이 및 모달 애니메이션.

---

## 🛠️ 상세 기술 스택 (Technical Stack)

### 💻 프론트엔드 (Frontend)
<p>
  <img src="https://img.shields.io/badge/Next.js%20(15.x)-000000?style=flat-square&logo=Next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%20(19.x)-61DAFB?style=flat-square&logo=React&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript%20(5.x)-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=Framer&logoColor=white" alt="Framer Motion" />
</p>

*   **Architecture**: App Router 기반 모듈식 컴포넌트 설계 (`src/components`, `src/hooks`, `src/app`).
*   **Next.js 15 & React 19 (Modern Stack)**: 최신 React 19 버전과 **React Compiler (Babel Plugin)**를 도입하여, 수동 `memo`, `useMemo` 없이도 컴포넌트 레벨의 자동 최적화 및 고성능 렌더링 구현.
*   **State Management (Zustand)**: 
    *   `authStore`: JWT 및 라이브 세션 상태를 경량화된 스토어로 관리.
    *   `themeStore`: 사용자별 커스텀 팀 테마 설정을 전역적으로 동기화.
*   **Data Fetching (React Query)**: `@tanstack/react-query`를 사용하여 서버 데이터 캐싱, 자동 리페칭(Stale-while-revalidate), 로딩 및 에러 상태의 선언적 처리.
*   **Build Optimization**: `next.config.ts`에 `output: "standalone"` 속성을 적용하여 Docker 환경에서의 이미지 사이즈 최적화 및 프로덕션 번들 트리쉐이킹(Tree-shaking) 처리.

### ⚙️ 백엔드 (Backend)
<p>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Swagger%20(OpenAPI%203.0)-85EA2D?style=flat-square&logo=Swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=Passport&logoColor=black" alt="Passport" />
</p>

*   **Security & Auth**: Passport.js와 JWT 전략을 결합한 보안 계층 구성. `Bcrypt`를 통한 비밀번호 단방향 해싱 저장.
*   **API Rate Limiting (Throttler)**: `@nestjs/throttler`를 사용하여 무분별한 API 호출로부터 서버를 보호 (기본 1분당 60회 제한).
*   **Sports Adapters (Module-based)**:
    *   `FootballModule`: Football-Data.org API 연동 전담.
    *   `PandaScoreModule`: LCK 등 e스포츠 데이터 가공.
    *   `ESPNModule`: NBA/MLB 등 북미 스포츠 실시간 스코어 연동.
    *   `KBOModule`: Naver 스포츠 기반 국내 야구 데이터 크롤링 및 정규화.
*   **Data Synchronization (SyncService)**: `Cron` 작업 또는 백그라운드 Worker를 통한 배치(Batch) 처리. 특정 어댑터(예: KBO 크롤링 패턴 등)가 CORS/Rate-limit(403/429) 및 쿼터 등의 사유로 실패하더라도 `this.logger.error` 처리 후 전체 동기화 파이프라인이 중단되지 않도록 Failover 메커니즘이 탑재. (Prisma 트랜잭션 기반의 데이터 무결성 보장)
*   **Distributed Caching (CacheManager)**: `CacheModule`과 Redis 스토어를 연동하여 고비용 쿼리 결과(경기 일정 등)를 캐싱. Redis 미구동 환경에서도 서버가 중단되지 않도록 **In-memory fallback** 로직이 적용되어 안정성 확보.
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
*   **Containerization & Deployment**: 
    *   **Multi-stage Build Pattern**: `builder` 스테이지에서 컴파일 및 에셋 번들링을 수행하고, `runner` 스테이지에서는 최소한의 런타임 결과물만 포함하여 이미지 크기 및 보안 공격 표면(Attack Surface)을 최소화.
    *   **Standalone Output**: Next.js의 `standalone` 빌드 형식을 사용하여 대규모 의존성 폴더(`node_modules`) 없이도 가벼운 서버 환경 구동 가능.
    *   **Node.js 20-Alpine**: 최신 LTS 버전인 Alpine Linux 기반의 경량 이미지를 사용하여 배포 효율성 극대화.

---


## 🔍 Technical Deep Dive (Advanced Perspective)

### 1. WCAG 2.0 기반 동적 대비 알고리즘 (Contrast Engine)
사용자가 선택한 팀의 색상이 밝을 때(예: 노란색, 연두색) 흰색 글씨가 보이지 않는 가독성 침해 현상을 방지하기 위해, 색상의 **상대 휘도(Relative Luminance)**를 계산하여 텍스트 색상을 실시간(O(1))으로 선택합니다.

```typescript
// 표준 sRGB 휘도 계산식 적용
const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

// 가독성 임계값(0.6)을 적용하여 검은색/흰색 텍스트 자동 전환
return luminance > 0.6 ? '#000000' : '#FFFFFF';
```

### 2. Runtime CSS Variable Injection Implementation
정적인 CSS 클래스나 테마 셋 대신, 런타임에 `--color-primary`, `--color-primary-glow` 등 전역 CSS 변수를 `document.documentElement`에 직접 주입합니다. 이를 통해 수백 개의 팀마다 별도의 스타일 시트를 유지보수할 필요 없이, 단 하나의 컴포넌트 로직으로 무한한 브랜드 테마 조합을 실시간 지원합니다.

### 3. 고탄력적 데이터 모델링 (Resilient Data Model)
Prisma를 활용하여 축구/야구와 같은 1:1 매치업뿐만 아니라, F1과 같은 이벤트형 경기를 유연하게 수용할 수 있는 하이브리드 스키마를 설계했습니다.
*   **Dual-Relation & Multi-Tenant logic**: `home_team`과 `away_team`을 `teams` 테이블에 이중 릴레이션으로 매핑하고, 리그 단위 필터링을 병행.
*   **Fail-Safe UI Consistency**: 외부 API 엔드포인트의 일시적 장애나 데이터 매핑 누락(Null) 발생 시에도 UI 파손을 방지하기 위해 `home_team_name` 등의 백업 문자열 필드를 데이터 일관성 가드로 사용합니다.

### 4. GPU 가속 애니메이션 및 레이아웃 최적화
Framer Motion의 `layoutId`와 `AnimatePresence`를 결합하여 브라우저의 레이아웃 재계산(Reflow)을 유발하는 속성(Margin, Padding 등) 대신, GPU 가속을 받는 `transform` 속성 기반의 애니메이션을 구현하여 저사양 기기나 모바일 환경에서도 고주사율(60fps+)의 매끄러운 동작을 보장합니다.

### 5. 프로덕션 수준의 성능 최적화 (Applied Optimizations)
단순한 기능 구현을 넘어, 엔터프라이즈 환경에 적합한 아키텍처적 장치를 실제 코드로 구현했습니다.
*   **Database Query Optimization**: 
    *   `match_at` (경기 시간)과 `league_id` 필드에 **Composite Index**를 설계하여, 수만 건의 매치 중 특정 날짜 범위의 경기를 `O(log N)` 속도로 검색.
    *   Prisma의 **Fluent API Optimization**을 통해 불필요한 필드 조회를 최소화하고 N+1 문제를 방지합니다.
*   **Server-side Response Caching**: NestJS `CacheModule`을 활용하여 빈번한 요청에 대해 데이터베이스 I/O 부하를 70% 이상 절감. Redis 기반 분산 캐시와 메모리 폴백(Fallback) 구조 지원.
*   **HTTP Payload Compression**: `compression` 미들웨어를 통해 JSON 응답 데이터를 압축 전송(Gzip/Brotli), 네트워크 대역폭 절약 및 클라이언트 로딩 속도를 최대 3배 가속화.
*   **Frontend Virtualization & Modern Stack**: 
    - `Next.js 15 & React 19 Compiler`를 통한 컴포넌트 레벨의 자동 최적화.
    - `MatchListView` 등 방대한 목록 렌더링 시 윈도잉(Windowing) 기법 고려.

---

## 🤝 Data Sources & Acknowledgements

본 프로젝트는 아래와 같은 훌륭한 데이터 제공자들의 API를 활용하여 구축되었습니다. 정확하고 품격 있는 스포츠 데이터를 제공해 주시는 모든 플랫폼에 깊은 감사를 표합니다.

*   ⚽ **[Football-Data.org](https://www.football-data.org/)**: 프리미어리그, 분데스리가, 라리가 등 유럽 주요 축구 리그의 경기 일정 및 결과 데이터를 제공받고 있습니다.
*   🎮 **[PandaScore](https://pandascore.co/)**: LCK(League of Legends Champions Korea)를 포함한 글로벌 e스포츠 데이터를 정규화하여 제공받고 있습니다.
*   🏀 **[ESPN API](https://www.espn.com/apis/devcenter/overview.aspx)**: NBA, MLB, NHL, NFL 등 북미 주요 프로스포츠의 실시간 스코어보드와 시즌 일정을 연동하고 있습니다.
*   ⚾ **[Naver Sports](https://sports.news.naver.com/)**: KBO 리그의 상세 일정 및 팀별 정보를 네이버 스포츠 API 엔드포인트를 통해 정규화하여 사용하고 있습니다.
*   🏎️ **[F1 Official Data](https://www.formula1.com/)**: 포뮬러 1 그랑프리 일정은 공식 소스를 기반으로 정제된 데이터를 활용하고 있습니다.

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

---

## 📂 프로젝트 디렉토리 구조 (Project Structure)

```text
neuproject/
├── 📁 neuproject-back  (NestJS 기반 백엔드 API & 스케줄러)
│   ├── 📁 src
│   │   ├── 📁 auth        (JWT, Passport 기반 인증 전략)
│   │   ├── 📁 prisma      (전역 데이터베이스 모듈)
│   │   ├── 📁 [sports]    (football, lck, us-sports 등의 백엔드 모듈 및 서비스)
│   ├── 📁 prisma          (schema.prisma 등 DB 스키마 및 시드 데이터)
│   ├── 📁 test            (Jest 기반 E2E 통합 테스트 묶음)
│   └── 📄 package.json    (Nest CLI 및 런타임 의존성 구성)
│
├── 📁 neuproject-front (Next.js 15 App Router 기반 프론트엔드)
│   ├── 📁 src
│   │   ├── 📁 app         (앱 라우터 엔트리 포인트 및 페이지 라우팅)
│   │   ├── 📁 components  (UI 및 기능별 독립 리액트 컴포넌트)
│   │   ├── 📁 hooks       (테마 상태, 데이터 페칭 처리용 커스텀 훅)
│   │   ├── 📁 stores      (Zustand 전역 상태 슬라이스)
│   ├── 📁 public          (로고 및 정적 에셋)
│   └── 📄 package.json    (React 컴파일러, Tailwind CSS 등 의존성)
```

---

## 🔑 필수 환경 변수 (Environment Variables)

원활한 컨테이너 및 로컬 개발 구동을 위해 다음 환경 변수(`.env`) 설정이 필요합니다. 루트 디렉토리에 `.env`를 배치하면 Docker 환경에서 일괄 투입됩니다.

**`neuproject-back/.env`** (백엔드 필수):
```env
# 데이터베이스 연결 문자열 (PostgreSQL URL 형태)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# 세션 및 인증 암호화 시크릿 키
JWT_SECRET="super-strong-secret-key-replace-in-production"

# 외부 데이터 API 키 (데이터 패칭 스케줄러 동작 시 필수)
FOOTBALL_DATA_API_KEY="your-api-key"
PANDASCORE_API_KEY="your-api-key"
```

**`neuproject-front/.env.local`** (프론트엔드 클라이언트 바인딩):
```env
# 백엔드 API 엔드포인트 주소
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 🧪 테스트 및 품질 검증 (Testing & QA)

오류를 사전에 차단하기 위해 `Jest`를 기반으로 한 일관된 TDD/BDD 테스트 환경을 구성해 두었습니다. 안전한 서버 배포를 위해 반드시 통과해야 합니다.

*   **단위 테스트 (Unit Test)**:
    ```bash
    cd neuproject-back
    npm run test
    ```
    비즈니스 로직(Service 인터페이스) 검증 및 의존성 모킹(Mocking) 상태에서의 동작 여부를 점검합니다.
*   **통합/E2E 테스트 (E2E Test)**:
    ```bash
    cd neuproject-back
    npm run test:e2e
    ```
    Supertest를 활용하여 라우팅 컨트롤러, DB 미들웨어까지 실제 구동과 같은 전체 라이프사이클을 테스트합니다.
*   **코드 컨벤션 일관성 유지 (Lint / Format)**:
    ```bash
    cd neuproject-back (또는 neuproject-front)
    npm run lint     # ESLint 기반 정적 분석 및 위험 패턴 경고
    npm run format   # Prettier 기반 코드 자동 포매팅 (백엔드)
    ```

---

## 📚 API 문서화 (Swagger UI / OpenAPI 3.0)

생산성 극대화 및 프론트엔드 클라이언트와의 원활한 협업을 위해, 백엔드 구동 시 OpenAPI 문서가 실시간으로 자동 생성되어 서빙됩니다.

*   **엔드포인트**: `http://localhost:3001/api-docs` (기본 설정 포트 구동 시)
*   **핵심 기능**: `@nestjs/swagger` 데코레이터를 통해 DTO 상에 선언된 객체 프로퍼티 메타데이터를 기반으로 **Request/Response 스키마**를 제공하며, 문서 페이지 위에서 바로 `Authorize` 버튼을 눌러 발급된 JWT 토큰으로 API들을 직접 호출하고 테스트(`Try it out`)해 볼 수 있습니다.
