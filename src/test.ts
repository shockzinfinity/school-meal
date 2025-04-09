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

async function test() {
  try {
    await client.connect(transport);

    const result = await client.callTool({
      name: 'getMeal',
      arguments: {
        KEY: process.env.NEIS_API_KEY,
        ATPT_OFCDC_SC_CODE: process.env.DEFAULT_OFFICE_CODE,
        SD_SCHUL_CODE: process.env.DEFAULT_SCHOOL_CODE,
        MLSV_YMD: '20250409'
      }
    });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

test(); 