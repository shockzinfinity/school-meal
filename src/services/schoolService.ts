import { SchoolRequest, ApiResponse, apiResponseSchema } from '../types/schoolTypes.js';
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

export class SchoolService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.NEIS_API_KEY ?? '';
    this.apiUrl = `${process.env.NEIS_API_URL ?? ''}/schoolInfo`;

    this.validateEnvironment();
  }

  private validateEnvironment(): void {
    if (!this.apiKey) throw new Error('NEIS_API_KEY is not set');
    if (!this.apiUrl) throw new Error('NEIS_API_URL is not set');
  }

  private buildSearchParams(params: SchoolRequest): URLSearchParams {
    const searchParams = new URLSearchParams({
      KEY: this.apiKey,
      Type: params.Type,
    });

    if (params.ATPT_OFCDC_SC_CODE) searchParams.append('ATPT_OFCDC_SC_CODE', params.ATPT_OFCDC_SC_CODE);
    if (params.SD_SCHUL_CODE) searchParams.append('SD_SCHUL_CODE', params.SD_SCHUL_CODE);
    if (params.SCHUL_NM) searchParams.append('SCHUL_NM', params.SCHUL_NM);
    if (params.SCHUL_KND_SC_NM) searchParams.append('SCHUL_KND_SC_NM', params.SCHUL_KND_SC_NM);
    if (params.LCTN_SC_NM) searchParams.append('LCTN_SC_NM', params.LCTN_SC_NM);
    if (params.FOND_SC_NM) searchParams.append('FOND_SC_NM', params.FOND_SC_NM);

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
    const result = data.schoolInfo?.[0]?.head?.[1]?.RESULT;
    if (result && result.CODE !== 'INFO-000') {
      throw new ApiError(result.CODE, result.MESSAGE);
    }
  }

  async getSchoolInfo(params: SchoolRequest): Promise<ApiResponse> {
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