import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import 'dotenv/config';

const client = new Client({
  name: 'test-client',
  version: '1.0.0'
});

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js']
});

async function testDailyMeal() {
  try {
    const result = await client.callTool({
      name: 'getMeal',
      arguments: {
        KEY: process.env.NEIS_API_KEY,
        ATPT_OFCDC_SC_CODE: process.env.DEFAULT_OFFICE_CODE,
        SD_SCHUL_CODE: process.env.DEFAULT_SCHOOL_CODE,
        MLSV_YMD: '20250409'
      }
    });
    console.log('일일 급식 조회 결과:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('일일 급식 조회 에러:', error);
  }
}

async function testPeriodMeal() {
  try {
    const result = await client.callTool({
      name: 'getMeal',
      arguments: {
        KEY: process.env.NEIS_API_KEY,
        ATPT_OFCDC_SC_CODE: process.env.DEFAULT_OFFICE_CODE,
        SD_SCHUL_CODE: process.env.DEFAULT_SCHOOL_CODE,
        MLSV_FROM_YMD: '20250401',  // 4월 1일부터
        MLSV_TO_YMD: '20250405'     // 4월 5일까지
      }
    });
    console.log('기간별 급식 조회 결과:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('기간별 급식 조회 에러:', error);
  }
}

// 테스트 실행
async function runTests() {
  try {
    // 클라이언트 연결
    await client.connect(transport);

    console.log('=== 일일 급식 정보 조회 테스트 ===');
    await testDailyMeal();
    
    console.log('\n=== 기간별 급식 정보 조회 테스트 ===');
    await testPeriodMeal();

  } catch (error) {
    console.error('테스트 실행 중 에러:', error);
  } finally {
    // 테스트 완료 후 연결 종료
    await client.close();
  }
}

runTests(); 