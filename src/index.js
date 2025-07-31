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
        'X-Sumatman-User-ID': USER_ID,
        'X-Sumatman-User-Email': USER_EMAIL,
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