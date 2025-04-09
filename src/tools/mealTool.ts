import { z } from 'zod';
import { MealService } from '../services/mealService.js';

const service = new MealService();

// 급식 요청 파라미터 타입 정의
export const parameters = z.object({
  Type: z.literal('json').default('json'),
  ATPT_OFCDC_SC_CODE: z.string(),
  SD_SCHUL_CODE: z.string(),
  MLSV_YMD: z.string().optional(),
  MMEAL_SC_CODE: z.enum(['1', '2', '3']).optional(),
  MLSV_FROM_YMD: z.string().optional(),
  MLSV_TO_YMD: z.string().optional(),
});

export type MealParameters = z.infer<typeof parameters>;

export const getMeal = {
  name: 'getMeal',
  description: '학교 급식 정보를 조회합니다.',
  parameters,
  async execute(params: MealParameters) {
    try {
      const result = await service.getMealInfo(params);
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
          text: `급식 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
}; 