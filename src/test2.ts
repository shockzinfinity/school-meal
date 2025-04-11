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

async function testSchoolInfo() {
  try {

    const result = await client.callTool({
      name: 'getSchool',
      arguments: {
        KEY: process.env.NEIS_API_KEY,
        pSize: 10
      }
    });
    console.log('학교 정보 조회 결과:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('학교 정보 조회 에러:', error);
  }
}

async function testSchoolSearch() {
  try {
    const result = await client.callTool({
      name: 'getSchool',
      arguments: {
        KEY: process.env.NEIS_API_KEY,
        pSize: 10,
        ATPT_OFCDC_SC_CODE: process.env.DEFAULT_OFFICE_CODE,
        SCHUL_NM: '서울'
    }
    });
    console.log('학교 검색 결과:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('학교 검색 에러:', error);
  }
}

// 테스트 실행
async function runTests() {
  try {
    await client.connect(transport);

    console.log('\n=== 학교 정보 조회 테스트 ===');
    await testSchoolInfo();

    console.log('\n=== 학교 검색 테스트 ===');
    await testSchoolSearch();
  } catch (error) {
    console.error('테스트 실행 중 에러:', error);
  } finally {
    console.log('테스트 종료, 연결 종료');
    await client.close();
  }
}

runTests(); 