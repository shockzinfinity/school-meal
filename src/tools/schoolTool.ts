import { z } from 'zod';
import { SchoolService } from '../services/schoolService.js';
import { SchoolKind } from '../types/schoolTypes.js';

const service = new SchoolService();

// 학교 정보 요청 파라미터 타입 정의
export const parameters = z.object({
  Type: z.literal('json').default('json'),
  KEY: z.string(),
  ATPT_OFCDC_SC_CODE: z.string().optional(),
  SD_SCHUL_CODE: z.string().optional(),
  SCHUL_NM: z.string().optional(),
  SCHUL_KND_SC_NM: z.enum([SchoolKind.ELEMENTARY, SchoolKind.MIDDLE, SchoolKind.HIGH, SchoolKind.SPECIAL]).optional(),
  LCTN_SC_NM: z.string().optional(),
  FOND_SC_NM: z.string().optional(),
});

export type SchoolParameters = z.infer<typeof parameters>;

export const getSchool = {
  name: 'getSchool',
  description: '학교 정보를 조회합니다.',
  parameters,
  async execute(params: SchoolParameters) {
    try {
      const result = await service.getSchoolInfo(params);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `학교 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
}; 