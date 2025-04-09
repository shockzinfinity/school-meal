import { MealRequest, ApiResponse, apiResponseSchema } from '../types/mealTypes.js';
import 'dotenv/config';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class MealService {
  private apiKey: string;
  private apiUrl: string;
  private officeCode: string;
  private schoolCode: string;

  constructor() {
    this.apiKey = process.env.NEIS_API_KEY ?? '';
    this.apiUrl = process.env.NEIS_API_URL ?? '';
    this.officeCode = process.env.DEFAULT_OFFICE_CODE ?? '';
    this.schoolCode = process.env.DEFAULT_SCHOOL_CODE ?? '';

    this.validateEnvironment();
  }

  private validateEnvironment(): void {
    if (!this.apiKey) throw new Error('NEIS_API_KEY is not set');
    if (!this.apiUrl) throw new Error('NEIS_API_URL is not set');
    if (!this.officeCode) throw new Error('DEFAULT_OFFICE_CODE is not set');
    if (!this.schoolCode) throw new Error('DEFAULT_SCHOOL_CODE is not set');
  }

  private buildSearchParams(params: MealRequest): URLSearchParams {
    const searchParams = new URLSearchParams({
      KEY: this.apiKey,
      Type: params.Type,
      ATPT_OFCDC_SC_CODE: params.ATPT_OFCDC_SC_CODE || this.officeCode,
      SD_SCHUL_CODE: params.SD_SCHUL_CODE || this.schoolCode,
    });

    if (params.MMEAL_SC_CODE) searchParams.append('MMEAL_SC_CODE', params.MMEAL_SC_CODE);
    if (params.MLSV_YMD) searchParams.append('MLSV_YMD', params.MLSV_YMD);
    if (params.MLSV_FROM_YMD) searchParams.append('MLSV_FROM_YMD', params.MLSV_FROM_YMD);
    if (params.MLSV_TO_YMD) searchParams.append('MLSV_TO_YMD', params.MLSV_TO_YMD);

    return searchParams;
  }

  private async fetchData(url: string): Promise<unknown> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private validateApiResponse(data: ApiResponse): void {
    const result = data.mealServiceDietInfo?.[0]?.head?.[1]?.RESULT;
    if (result && result.CODE !== 'INFO-000') {
      throw new ApiError(result.CODE, result.MESSAGE);
    }
  }

  async getMealInfo(params: MealRequest): Promise<ApiResponse> {
    const searchParams = this.buildSearchParams(params);
    const url = `${this.apiUrl}?${searchParams.toString()}`;
    
    console.log('Request URL:', url);
    console.log('Request Parameters:', params);

    const rawData = await this.fetchData(url);
    console.log('Raw API Response:', JSON.stringify(rawData, null, 2));

    // API 응답 검증
    const validatedData = apiResponseSchema.parse(rawData);
    this.validateApiResponse(validatedData);

    return validatedData;
  }
} 