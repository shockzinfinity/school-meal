import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getMeal } from './tools/mealTool.js';
import { getSchool } from './tools/schoolTool.js';
import 'dotenv/config';

const server = new McpServer({
  name: 'school-meal',
  version: '1.0.0'
});

// 도구 등록
server.tool(
  'getMeal',
  getMeal.parameters.shape,
  async (params) => {
    try {
      const result = await getMeal.execute(params);
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `급식 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

server.tool(
  'getSchool',
  getSchool.parameters.shape,
  async (params) => {
    try {
      const result = await getSchool.execute(params);
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `학교 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// 서버 시작
const transport = new StdioServerTransport();
await server.connect(transport);
