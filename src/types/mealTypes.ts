import { z } from 'zod';

// 기본 상수 정의
export const MealCode = {
  BREAKFAST: '1',
  LUNCH: '2',
  DINNER: '3'
} as const;

export type MealCodeType = typeof MealCode[keyof typeof MealCode];

// API 요청 타입
export interface MealRequest {
  Type: 'json';
  ATPT_OFCDC_SC_CODE: string;
  SD_SCHUL_CODE: string;
  MMEAL_SC_CODE?: MealCodeType;
  MLSV_YMD?: string;
  MLSV_FROM_YMD?: string;
  MLSV_TO_YMD?: string;
}

// API 응답 타입
export interface MealInfo {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string;
  MMEAL_SC_NM: string;
  MLSV_YMD: string;
  MLSV_FGR: number;
  DDISH_NM: string;
  ORPLC_INFO: string;
  CAL_INFO: string;
  NTR_INFO: string;
  MLSV_FROM_YMD: string;
  MLSV_TO_YMD: string;
  LOAD_DTM: string;
}

export interface ApiResponse {
  mealServiceDietInfo?: Array<{
    head?: Array<{
      list_total_count?: number;
      RESULT?: {
        CODE: string;
        MESSAGE: string;
      };
    }>;
    row?: MealInfo[];
  }>;
}

// Zod 스키마 정의
export const mealRequestSchema = z.object({
  Type: z.literal('json').default('json'),
  ATPT_OFCDC_SC_CODE: z.string().min(1, '시도교육청코드는 필수입니다'),
  SD_SCHUL_CODE: z.string().min(1, '학교코드는 필수입니다'),
  MMEAL_SC_CODE: z.enum([MealCode.BREAKFAST, MealCode.LUNCH, MealCode.DINNER]).optional(),
  MLSV_YMD: z.string().regex(/^\d{8}$/, '급식일자는 YYYYMMDD 형식이어야 합니다').optional(),
  MLSV_FROM_YMD: z.string().regex(/^\d{8}$/, '시작일자는 YYYYMMDD 형식이어야 합니다').optional(),
  MLSV_TO_YMD: z.string().regex(/^\d{8}$/, '종료일자는 YYYYMMDD 형식이어야 합니다').optional(),
});

export const apiResponseSchema = z.object({
  mealServiceDietInfo: z.array(
    z.object({
      head: z.array(
        z.object({
          list_total_count: z.number().optional(),
          RESULT: z.object({
            CODE: z.string(),
            MESSAGE: z.string()
          }).optional()
        })
      ).optional(),
      row: z.array(z.object({
        ATPT_OFCDC_SC_CODE: z.string(),
        ATPT_OFCDC_SC_NM: z.string(),
        SD_SCHUL_CODE: z.string(),
        SCHUL_NM: z.string(),
        MMEAL_SC_CODE: z.string(),
        MMEAL_SC_NM: z.string(),
        MLSV_YMD: z.string(),
        MLSV_FGR: z.number().or(z.string()).transform(val => 
          typeof val === 'string' ? parseInt(val, 10) : val
        ),
        DDISH_NM: z.string(),
        ORPLC_INFO: z.string(),
        CAL_INFO: z.string(),
        NTR_INFO: z.string(),
        MLSV_FROM_YMD: z.string(),
        MLSV_TO_YMD: z.string(),
        LOAD_DTM: z.string()
      })).optional()
    })
  ).optional()
});

// 기본 API 파라미터 스키마
export const baseParamsSchema = z.object({
  KEY: z.string(),
  Type: z.enum(['json']).default('json'),
  pIndex: z.number().default(1),
  pSize: z.number().default(100),
});

// 급식 정보 스키마
export const mealInfoSchema = z.object({
  ATPT_OFCDC_SC_CODE: z.string().describe('시도교육청코드'),
  ATPT_OFCDC_SC_NM: z.string().describe('시도교육청명'),
  SD_SCHUL_CODE: z.string().describe('행정표준코드'),
  SCHUL_NM: z.string().describe('학교명'),
  MMEAL_SC_CODE: z.string().describe('식사코드'),
  MMEAL_SC_NM: z.string().describe('식사명'),
  MLSV_YMD: z.string().describe('급식일자'),
  MLSV_FGR: z.number().or(z.string()).describe('급식인원수'),
  DDISH_NM: z.string().describe('요리명'),
  ORPLC_INFO: z.string().describe('원산지정보'),
  CAL_INFO: z.string().describe('칼로리정보'),
  NTR_INFO: z.string().describe('영양정보'),
  MLSV_FROM_YMD: z.string().describe('급식시작일자'),
  MLSV_TO_YMD: z.string().describe('급식종료일자'),
  LOAD_DTM: z.string().describe('수정일자')
});

// NEIS API 결과 스키마
export const neisResultSchema = z.object({
  CODE: z.string(),
  MESSAGE: z.string()
});

// 급식 API 응답 스키마
export const mealServiceResponseSchema = z.object({
  mealServiceDietInfo: z.array(
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
        row: z.array(mealInfoSchema)
      })
    ])
  ).optional()
});

export type BaseParams = z.infer<typeof baseParamsSchema>;
export type MealServiceResponse = z.infer<typeof mealServiceResponseSchema>;

export interface MealParameters {
  ATPT_OFCDC_SC_CODE: string;
  SD_SCHUL_CODE: string;
  MLSV_YMD?: string;
  MMEAL_SC_CODE?: '1' | '2' | '3';
  MLSV_FROM_YMD?: string;
  MLSV_TO_YMD?: string;
}

export const mealParametersSchema = z.object({
  ATPT_OFCDC_SC_CODE: z.string(),
  SD_SCHUL_CODE: z.string(),
  MLSV_YMD: z.string().optional(),
  MMEAL_SC_CODE: z.enum(['1', '2', '3']).optional(),
  MLSV_FROM_YMD: z.string().optional(),
  MLSV_TO_YMD: z.string().optional(),
}).transform(params => ({ ...params, Type: 'json' as const })); 