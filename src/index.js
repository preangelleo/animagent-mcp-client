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
    // Map client tool names to server tool names
    let toolName = request.params.name;
    if (toolName === 'create_story_animation') {
      toolName = 'create_animation_task';
    } else if (toolName === 'check_task_status') {
      toolName = 'get_task_details';
    }
    
    // Forward the tool call to the remote server
    const result = await callRemoteMCP('tools/call', {
      name: toolName,
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
    // Map client options to server parameter names
    const mappedOptions = {
      input_story: options.prompt || options.input_story,
      story_type: options.storyType || options.story_type || 'fairytale_story',
      video_length_minutes: options.duration || options.video_length_minutes || 30,
      dimension_type: options.dimensionType || options.dimension_type || 'landscape',
      voice_language: options.voiceLanguage || options.voice_language || 'english',
      voice_id: options.voiceId || options.voice_id,
      illustration_style: options.style || options.illustration_style || 'Japanese Ghibli-inspired Style',
      audience_age: options.audienceAge || options.audience_age || 'adults',
      audience_gender: options.audienceGender || options.audience_gender || 'all_genders',
      audience_location: options.audienceLocation || options.audience_location || 'global',
      narrator_name: options.narratorName || options.narrator_name,
      thematic_purpose: options.thematicPurpose || options.thematic_purpose,
      signature_phrases: options.signaturePhrases || options.signature_phrases,
      youtube_channel_description: options.youtubeChannelDescription || options.youtube_channel_description,
      fixed_character_name: options.fixedCharacterName || options.fixed_character_name,
      copy_to_email: options.copyToEmail || options.copy_to_email,
      search_keywords: options.searchKeywords || options.search_keywords,
      system_prompt_story_writing: options.systemPromptStoryWriting || options.system_prompt_story_writing,
      system_prompt_image_generation: options.systemPromptImageGeneration || options.system_prompt_image_generation,
    };
    
    // Remove undefined values
    Object.keys(mappedOptions).forEach(key => {
      if (mappedOptions[key] === undefined) {
        delete mappedOptions[key];
      }
    });
    
    return callRemoteMCP('tools/call', {
      name: 'create_animation_task',
      arguments: mappedOptions,
    });
  }

  async checkTaskStatus(taskId) {
    return callRemoteMCP('tools/call', {
      name: 'get_task_details',
      arguments: { task_id: taskId },
    });
  }
}

export default AnimAgentClient;