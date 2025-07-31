#!/usr/bin/env node

const { Server } from '@modelcontextprotocol/sdk/server/index.js';
const { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
const fetch = require('node-fetch').default;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const MCP_SERVER_URL = process.env.ANIMAGENT_MCP_SERVER_URL || 'https://api.sumatman.ai/api/mcp';
const USER_ID = process.env.ANIMAGENT_USER_ID;
const USER_EMAIL = process.env.ANIMAGENT_USER_EMAIL;
const DEBUG = process.env.DEBUG === 'true';

// Validate required environment variables
if (!USER_ID || !USER_EMAIL) {
  console.error('Error: Missing required environment variables.');
  console.error('Please set ANIMAGENT_USER_ID and ANIMAGENT_USER_EMAIL in your .env file.');
  process.exit(1);
}

// Debug logging
function debug(...args) {
  if (DEBUG) {
    console.error('[AnimAgent Debug]', ...args);
  }
}

// MCP Server instance
const server = new Server(
  {
    name: 'animagent-mcp-client',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to make requests to the remote MCP server
async function callRemoteMCP(method, params = {}) {
  try {
    debug(`Calling remote MCP: ${method}`, params);
    
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params: {
          ...params,
          // Include authentication
          userId: USER_ID,
          userEmail: USER_EMAIL,
        },
        id: Date.now(),
      }),
    });

    const data = await response.json();
    debug('Remote MCP response:', data);

    if (data.error) {
      throw new Error(data.error.message || 'Remote MCP error');
    }

    return data.result;
  } catch (error) {
    debug('Remote MCP error:', error);
    throw error;
  }
}

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  debug('Listing tools');
  
  try {
    // Get tools from remote server
    const remoteTools = await callRemoteMCP('tools/list');
    
    // Add our authentication to each tool
    const tools = remoteTools.tools.map(tool => ({
      ...tool,
      description: tool.description + '\\n\\nNote: This tool connects to the AnimAgent cloud service.',
    }));

    return { tools };
  } catch (error) {
    // Fallback to hardcoded tools if remote is unavailable
    return {
      tools: [
        {
          name: 'create_story_animation',
          description: 'Create an AI-generated story animation video\\n\\nNote: This tool connects to the AnimAgent cloud service.',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'The story prompt for the animation',
              },
              duration: {
                type: 'integer',
                description: 'Duration of the video in seconds (default: 30)',
                minimum: 10,
                maximum: 300,
              },
              style: {
                type: 'string',
                description: 'Animation style (cartoon, realistic, anime, etc.)',
                enum: ['cartoon', 'realistic', 'anime', 'watercolor', 'sketch'],
              },
              voiceType: {
                type: 'string',
                description: 'Voice type for narration',
                enum: ['male', 'female', 'child', 'narrator'],
              },
              musicStyle: {
                type: 'string',
                description: 'Background music style',
                enum: ['adventure', 'calm', 'dramatic', 'happy', 'mysterious', 'none'],
              },
            },
            required: ['prompt'],
          },
        },
        {
          name: 'check_task_status',
          description: 'Check the status of an animation task\\n\\nNote: This tool connects to the AnimAgent cloud service.',
          inputSchema: {
            type: 'object',
            properties: {
              taskId: {
                type: 'string',
                description: 'The task ID to check',
              },
            },
            required: ['taskId'],
          },
        },
      ],
    };
  }
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  debug('Tool call:', request.params.name, request.params.arguments);

  try {
    // Forward the tool call to the remote server
    const result = await callRemoteMCP('tools/call', {
      name: request.params.name,
      arguments: request.params.arguments,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Main function
async function main() {
  debug('Starting AnimAgent MCP Client');
  debug(`User ID: ${USER_ID}`);
  debug(`User Email: ${USER_EMAIL}`);
  debug(`MCP Server URL: ${MCP_SERVER_URL}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  debug('AnimAgent MCP Client started successfully');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('Failed to start AnimAgent MCP Client:', error);
  process.exit(1);
});

// Export for programmatic use
class AnimAgentClient {
  constructor({ userId, userEmail } = {}) {
    this.userId = userId || USER_ID;
    this.userEmail = userEmail || USER_EMAIL;
    
    if (!this.userId || !this.userEmail) {
      throw new Error('userId and userEmail are required');
    }
  }

  async createStoryAnimation(options) {
    return callRemoteMCP('tools/call', {
      name: 'create_story_animation',
      arguments: options,
    });
  }

  async checkTaskStatus(taskId) {
    return callRemoteMCP('tools/call', {
      name: 'check_task_status',
      arguments: { taskId },
    });
  }
}

module.exports = AnimAgentClient;