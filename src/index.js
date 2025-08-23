#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const MCP_SERVER_URL = process.env.ANIMAGENT_MCP_SERVER_URL || 'https://app.sumatman.ai/api/mcp';
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
    name: 'animagent-mcp-server',
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
    
    // Build the request body based on the method
    let requestBody;
    if (method === 'tools/list') {
      requestBody = JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: Date.now(),
      });
    } else if (method === 'tools/call') {
      requestBody = JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: params,
        id: Date.now(),
      });
    } else {
      requestBody = JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now(),
      });
    }
    
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AnimAgent-User-ID': USER_ID,
        'X-AnimAgent-User-Email': USER_EMAIL,
      },
      body: requestBody,
    });

    const text = await response.text();
    debug('Remote MCP raw response:', text);
    
    // Parse newline-delimited JSON responses
    const lines = text.trim().split('\n');
    let result = null;
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const data = JSON.parse(line);
          if (data.error) {
            throw new Error(data.error.message || 'Remote MCP error');
          }
          if (data.result) {
            result = data.result;
          }
        } catch (e) {
          debug('Failed to parse line:', line, e);
        }
      }
    }
    
    return result;
  } catch (error) {
    debug('Remote MCP error:', error);
    throw error;
  }
}

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  debug('Listing tools');
  
  try {
    // Get tools from remote server - always use remote as source of truth
    const remoteTools = await callRemoteMCP('tools/list');
    return { tools: remoteTools.tools || [] };
  } catch (error) {
    debug('Failed to get tools from remote server:', error);
    // Return empty tools list if cannot connect to server
    // This forces the client to be a pure passthrough
    return { tools: [] };
  }
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  debug('Tool call:', request.params.name, request.params.arguments);

  try {
    // Local validation for edit_animation_task
    if (request.params.name === 'edit_animation_task') {
      const args = request.params.arguments || {};
      if (!args.task_id || args.task_id.trim() === '') {
        return {
          content: [
            {
              type: 'text',
              text: `❌ **Client Validation Error**

🚨 **TASK_ID IS MANDATORY**: You must provide the task_id parameter when editing a task.

📋 **Usage**: Use get_task_details first to find the task_id, then provide it in the edit call:
\`\`\`
edit_animation_task({
  "task_id": "web_1234567890_abc123",
  ...other fields to change
})
\`\`\`

💡 **Tip**: Only provide the fields you want to change - unchanged fields will keep their original values.`,
            },
          ],
        };
      }
    }

    // Local validation for repeat_animation_task
    if (request.params.name === 'repeat_animation_task') {
      const args = request.params.arguments || {};
      if (!args.task_id || args.task_id.trim() === '') {
        return {
          content: [
            {
              type: 'text',
              text: `❌ **Client Validation Error**

🚨 **TASK_ID IS MANDATORY**: You must provide the task_id parameter when repeating a task.

📋 **Usage**: Use get_task_details first to find a completed task_id, then provide it in the repeat call:
\`\`\`
repeat_animation_task({
  "task_id": "web_1234567890_abc123",
  "input_story": "Your new story content here",
  "code_name": "New unique task title"
})
\`\`\`

💡 **Tip**: The task_id must be from a COMPLETED task to copy its settings. You also need to provide new input_story and code_name.`,
            },
          ],
        };
      }
    }

    // Local validation for delete_animation_task
    if (request.params.name === 'delete_animation_task') {
      const args = request.params.arguments || {};
      if (!args.task_id || args.task_id.trim() === '') {
        return {
          content: [
            {
              type: 'text',
              text: `❌ **Client Validation Error**

🚨 **TASK_ID IS MANDATORY**: You must provide the task_id parameter when deleting a task.

📋 **Usage**: Use get_task_details first to find the task_id, then provide it in the delete call:
\`\`\`
delete_animation_task({
  "task_id": "web_1234567890_abc123"
})
\`\`\`

💡 **Tip**: Only tasks with "pending" status can be deleted. The server will reject deletion of completed, processing, or failed tasks.`,
            },
          ],
        };
      }
    }

    // Pure passthrough - forward exactly what we receive
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
    // Pure passthrough - let server handle all validation and defaults
    return callRemoteMCP('tools/call', {
      name: 'create_animation_task',
      arguments: options,
    });
  }

  async checkTaskStatus(taskId) {
    // Pure passthrough
    return callRemoteMCP('tools/call', {
      name: 'get_task_details',
      arguments: { task_id: taskId },
    });
  }
}

export default AnimAgentClient;