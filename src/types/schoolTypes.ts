import { z } from 'zod';

// 기본 상수 정의
export const SchoolKind = {
  ELEMENTARY: '초등학교',
  MIDDLE: '중학교',
  HIGH: '고등학교',
  SPECIAL: '특수학교'
} as const;

export type SchoolKindType = typeof SchoolKind[keyof typeof SchoolKind];

// API 요청 타입
export interface SchoolRequest {
  Type: 'json';
  ATPT_OFCDC_SC_CODE?: string;
  SD_SCHUL_CODE?: string;
  SCHUL_NM?: string;
  SCHUL_KND_SC_NM?: SchoolKindType;
  LCTN_SC_NM?: string;
  FOND_SC_NM?: string;
}

// API 응답 타입
export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ENG_SCHUL_NM: string;
  SCHUL_KND_SC_NM: string;
  LCTN_SC_NM: string;
  JU_ORG_NM: string;
  FOND_SC_NM: string;
  ORG_RDNZC: string;
  ORG_RDNMA: string;
  ORG_RDNDA: string;
  ORG_TELNO: string;
  HMPG_ADRES: string;
  COEDU_SC_NM: string;
  ORG_FAXNO: string;
  HS_SC_NM: string | null;
  INDST_SPECL_CCCCL_EXST_YN: string;
  HS_GNRL_BUSNS_SC_NM: string | null;
  SPCLY_PURPS_HS_ORD_NM: string | null;
  ENE_BFE_SEHF_SC_NM: string;
  DGHT_SC_NM: string;
  FOND_YMD: string;
  FOAS_MEMRD: string;
  LOAD_DTM: string;
}

export interface ApiResponse {
  schoolInfo?: Array<{
    head?: Array<{
      list_total_count?: number;
      RESULT?: {
        CODE: string;
        MESSAGE: string;
      };
    }>;
    row?: SchoolInfo[];
  }>;
}

// Zod 스키마 정의
export const schoolRequestSchema = z.object({
  Type: z.literal('json').default('json'),
  ATPT_OFCDC_SC_CODE: z.string().optional(),
  SD_SCHUL_CODE: z.string().optional(),
  SCHUL_NM: z.string().optional(),
  SCHUL_KND_SC_NM: z.enum([SchoolKind.ELEMENTARY, SchoolKind.MIDDLE, SchoolKind.HIGH, SchoolKind.SPECIAL]).optional(),
  LCTN_SC_NM: z.string().optional(),
  FOND_SC_NM: z.string().optional(),
});

// 학교 정보 스키마
export const schoolInfoSchema = z.object({
  ATPT_OFCDC_SC_CODE: z.string().describe('시도교육청코드'),
  ATPT_OFCDC_SC_NM: z.string().describe('시도교육청명'),
  SD_SCHUL_CODE: z.string().describe('행정표준코드'),
  SCHUL_NM: z.string().describe('학교명'),
  ENG_SCHUL_NM: z.string().describe('영문학교명'),
  SCHUL_KND_SC_NM: z.string().describe('학교종류명'),
  LCTN_SC_NM: z.string().describe('시도명'),
  JU_ORG_NM: z.string().describe('관할조직명'),
  FOND_SC_NM: z.string().describe('설립명'),
  ORG_RDNZC: z.string().describe('도로명우편번호'),
  ORG_RDNMA: z.string().describe('도로명주소'),
  ORG_RDNDA: z.string().describe('도로명상세주소'),
  ORG_TELNO: z.string().describe('전화번호'),
  HMPG_ADRES: z.string().describe('홈페이지주소'),
  COEDU_SC_NM: z.string().describe('남녀공학구분명'),
  ORG_FAXNO: z.string().describe('팩스번호'),
  HS_SC_NM: z.string().nullable().describe('고등학교구분명'),
  INDST_SPECL_CCCCL_EXST_YN: z.string().describe('산업체특별학급존재여부'),
  HS_GNRL_BUSNS_SC_NM: z.string().nullable().describe('고등학교일반전문구분명'),
  SPCLY_PURPS_HS_ORD_NM: z.string().nullable().describe('특수목적고등학교계열명'),
  ENE_BFE_SEHF_SC_NM: z.string().describe('입시전후기구분명'),
  DGHT_SC_NM: z.string().describe('주야구분명'),
  FOND_YMD: z.string().describe('설립일자'),
  FOAS_MEMRD: z.string().describe('개교기념일'),
  LOAD_DTM: z.string().describe('수정일자'),
});

// NEIS API 결과 스키마
export const neisResultSchema = z.object({
  CODE: z.string(),
  MESSAGE: z.string()
});

// 학교 정보 API 응답 스키마
export const apiResponseSchema = z.object({
  schoolInfo: z.array(
    z.union([
      z.object({
        head: z.array(
          z.union([
            z.object({ list_total_count: z.number() }),
            z.object({ RESULT: neisResultSchema })
          ])
        )
      }),
      z.object({
        row: z.array(schoolInfoSchema)
      })
    ])
  ).optional()
});

// 기본 API 파라미터 스키마
export const baseParamsSchema = z.object({
  KEY: z.string(),
  Type: z.enum(['json']).default('json'),
  pIndex: z.number().default(1),
  pSize: z.number().default(100),
});

export type BaseParams = z.infer<typeof baseParamsSchema>;
export type SchoolParameters = Omit<SchoolRequest, 'KEY' | 'Type'>;

export const schoolParametersSchema = z.object({
  ATPT_OFCDC_SC_CODE: z.string().optional(),
  SD_SCHUL_CODE: z.string().optional(),
  SCHUL_NM: z.string().optional(),
  SCHUL_KND_SC_NM: z.enum([SchoolKind.ELEMENTARY, SchoolKind.MIDDLE, SchoolKind.HIGH, SchoolKind.SPECIAL]).optional(),
  LCTN_SC_NM: z.string().optional(),
  FOND_SC_NM: z.string().optional(),
}).transform(params => ({ ...params, Type: 'json' as const })); 