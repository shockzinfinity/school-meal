# School Meal MCP Server

NEIS 교육행정정보시스템의 급식 식단 정보를 조회하는 MCP(Model Context Protocol) 서버입니다.

## 기능

- 학교 급식 정보 조회
  - 일일 식단 조회
  - 기간별 식단 조회
  - 조식/중식/석식 구분 조회
  - 영양 정보 및 원산지 정보 포함

## 기술 스택

- TypeScript
- Node.js
- MCP SDK
- Zod (스키마 검증)
- dotenv (환경 변수 관리)

## 설치 방법

```bash
# 저장소 클론
git clone https://github.com/shockzinfinity/school-meal.git

# 디렉토리 이동
cd school-meal

# 의존성 설치
npm install
```

## 환경 설정

1. 환경 변수 파일 생성:

```bash
# .env.sample 파일을 .env로 복사
cp .env.sample .env
```

2. `.env` 파일을 열어 실제 값으로 수정:

```env
# NEIS Open API 설정
NEIS_API_KEY=your_api_key_here
NEIS_API_URL=https://open.neis.go.kr/hub/mealServiceDietInfo

# 기본 학교 정보
DEFAULT_OFFICE_CODE=B10  # 예: B10 (서울특별시교육청)
DEFAULT_SCHOOL_CODE=7031138  # 학교 고유 코드
```

필수 환경 변수:

- `NEIS_API_KEY`: NEIS Open API 인증 키 (https://open.neis.go.kr/portal/guide/actKeyPage.do 에서 발급)
- `NEIS_API_URL`: NEIS API 엔드포인트 (기본값 사용 권장)
- `DEFAULT_OFFICE_CODE`: 시도교육청코드 (예: 'B10'은 서울특별시교육청)
- `DEFAULT_SCHOOL_CODE`: 학교코드 (NEIS에서 제공하는 표준 학교코드)

## 실행 방법

```bash
# 빌드
npm run build

# 서버 실행
npm start

# 개발 모드 실행 (자동 재시작)
npm run dev
```

## 테스트

```bash
# 테스트 실행
node dist/test.js
```

## API 사용 예시

```typescript
const result = await client.callTool({
  name: 'getMeal',
  arguments: {
    ATPT_OFCDC_SC_CODE: 'B10', // 시도교육청코드
    SD_SCHUL_CODE: '7010569', // 학교코드
    MLSV_YMD: '20250409', // 급식일자
    MMEAL_SC_CODE: '2', // 1: 조식, 2: 중식, 3: 석식
  },
});
```

## 프로젝트 구조

```
src/
├── services/
│   └── mealService.ts     # NEIS API 통신 서비스
├── tools/
│   └── mealTool.ts        # MCP 도구 정의
├── types/
│   └── mealTypes.ts       # 타입 정의
├── resources/             # 리소스 파일
├── index.ts              # 서버 엔트리포인트
└── test.ts               # 테스트 코드
```

## 라이선스

ISC

## 작성자

shockzinfinity
