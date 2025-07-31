# AnimAgent MCP Client

A client library for connecting to the AnimAgent MCP (Model Context Protocol) server to create and manage AI-powered story animations.

## Overview

This project provides a simple client interface to connect with the AnimAgent remote MCP server hosted on AWS. It enables users to:

- Create AI-generated story animations
- Monitor task status and progress
- Integrate animation capabilities into Claude Desktop or other MCP-compatible environments

## Prerequisites

- Node.js 18+ installed
- A valid AnimAgent account with:
  - User ID
  - User Email
- Claude Desktop (for MCP integration)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/animagent-mcp-client.git
cd animagent-mcp-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your AnimAgent credentials:
```
ANIMAGENT_USER_ID=your_user_id_here
ANIMAGENT_USER_EMAIL=your_email_here
```

### 4. First-Time Setup

Run the setup script to configure Claude Desktop:

```bash
npm run setup
```

This will automatically configure your Claude Desktop to connect with the AnimAgent MCP server.

### 5. Test the Connection

```bash
npm test
```

## Usage

### As a Standalone Client

```javascript
const AnimAgentClient = require('animagent-mcp-client');

const client = new AnimAgentClient({
  userId: process.env.ANIMAGENT_USER_ID,
  userEmail: process.env.ANIMAGENT_USER_EMAIL
});

// Create a new animation
const task = await client.createStoryAnimation({
  prompt: "A brave knight rescuing a dragon from a princess",
  duration: 30,
  style: "cartoon"
});

// Check task status
const status = await client.checkTaskStatus(task.taskId);
```

### With Claude Desktop

Once configured, you can use natural language in Claude Desktop:

```
"Create a 30-second animation about a magical forest adventure"
"Check the status of my animation task"
```

## Configuration

The client connects to the AnimAgent MCP server at:
- Production: `https://api.sumatman.ai/api/mcp`

## API Reference

### Methods

#### `createStoryAnimation(options)`
Creates a new story animation task.

**Parameters:**
- `prompt` (string, required): The story prompt
- `duration` (number, optional): Video duration in seconds (default: 30)
- `style` (string, optional): Animation style (default: "cartoon")
- `voiceType` (string, optional): Voice type for narration
- `musicStyle` (string, optional): Background music style

**Returns:** Task object with `taskId`

#### `checkTaskStatus(taskId)`
Checks the status of an animation task.

**Parameters:**
- `taskId` (string, required): The task ID to check

**Returns:** Status object with progress information

## Troubleshooting

### Connection Issues
- Ensure your credentials in `.env` are correct
- Check your internet connection
- Verify the MCP server is accessible

### Claude Desktop Integration
- Make sure Claude Desktop is properly installed
- Run `npm run setup` again if configuration issues persist
- Check Claude Desktop logs for MCP connection errors

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/animagent-mcp-client/issues)
- Email: support@sumatman.ai

## Powered By

This client connects to the AnimAgent service by [Sumatman AI](https://sumatman.ai), bringing AI-powered story animation capabilities to developers worldwide.