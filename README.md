# AnimAgent MCP Client

A client library for connecting to the AnimAgent MCP (Model Context Protocol) server to create and manage AI-powered story animations.

## 🚀 Quick Install (One Command!)

### macOS/Linux:
```bash
git clone https://github.com/preangelleo/animagent-mcp-client.git
cd animagent-mcp-client
./install.sh
```

### Windows:
```cmd
git clone https://github.com/preangelleo/animagent-mcp-client.git
cd animagent-mcp-client
install.bat
```

That's it! The installer will:
- ✅ Check Node.js installation
- ✅ Install dependencies
- ✅ Ask for your credentials
- ✅ Configure Claude Desktop automatically

## Overview

This project provides a lightweight passthrough client that bridges Claude Desktop with the AnimAgent remote MCP server. The client includes smart local validation to catch common errors before they reach the server.

**⚡ Enhanced with Client-Side Validation**: While maintaining the core passthrough design, the client now performs critical parameter validation for edit, repeat, and delete operations. This provides instant feedback and prevents common user errors, while still keeping all business logic on the server side.

It enables users to:

- Create AI-generated story animations
- Monitor task status and progress  
- Edit, repeat, and delete animation tasks with smart validation
- Get instant error feedback for missing required parameters
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
git clone https://github.com/preangelleo/animagent-mcp-client.git
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

**Where to find your credentials:**
- **Email**: The email you use to log in to https://app.sumatman.ai
- **User ID**: After logging in to https://app.sumatman.ai, you can find and copy your User ID from the dashboard

### 4. First-Time Setup

Run the setup script to configure Claude Desktop:

```bash
npm run setup
```

This will automatically configure your Claude Desktop to connect with the AnimAgent MCP server.


## Usage


### With Claude Desktop

Once configured, you can use natural language in Claude Desktop:

```
"Create a 30-second animation about a magical forest adventure"
"Check the status of my animation task"
```


## How It Works

This client acts as a bridge between Claude Desktop and the AnimAgent MCP server. When you use animation commands in Claude:

1. Claude Desktop sends the request to this local client via MCP protocol
2. **⚡ NEW**: Client performs local validation for critical parameters (edit/repeat/delete operations)
3. If validation passes, the client forwards the request to the AnimAgent server
4. The server processes the animation task
5. Results are returned back through the same chain

**Dual-Layer Validation**: 
- **Client-Side**: Catches missing `task_id` parameters instantly with helpful error messages
- **Server-Side**: Handles business logic validation (task status, permissions, etc.)

**Note**: All tool definitions and business parameters are still defined by the server. The client only validates critical required fields.

## Troubleshooting

### Client Validation Errors ⚡ New

**"❌ Client Validation Error - TASK_ID IS MANDATORY"**
- **Cause**: Trying to edit, repeat, or delete a task without providing the `task_id` parameter
- **Solution**: Always use `get_task_details` first to find the task ID, then provide it in your request
- **Example**: 
  ```
  "First, check my task details for task_id: web_1234567890_abc123"
  "Now edit that task to change the story to: [new story content]"
  ```

### Connection Issues
- Ensure your credentials in `.env` are correct
- Check your internet connection
- Verify the MCP server is accessible

### Claude Desktop Integration
- Make sure Claude Desktop is properly installed
- Run `npm run setup` again if configuration issues persist
- Check Claude Desktop logs for MCP connection errors

### Advanced Troubleshooting

**Local vs Server Errors**:
- **Client errors** (⚡): Show "Client Validation Error" - these are caught locally
- **Server errors**: Show "Backend Error" - these come from the remote server
- **Network errors**: Show "Connection Error" - these indicate connectivity issues

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
- GitHub Issues: [Create an issue](https://github.com/preangelleo/animagent-mcp-client/issues)
- Email: atmansum@gmail.com
- Website: https://app.sumatman.ai

## Features

### ⚡ Smart Local Validation (v2.1.0)
- **Instant Error Detection**: Catches missing `task_id` parameters before sending requests
- **Helpful Error Messages**: Provides clear usage examples and troubleshooting tips
- **Reduced Network Traffic**: Invalid requests blocked locally, saving bandwidth
- **Better User Experience**: No waiting for server roundtrips on obvious errors

### 🔧 Parameter Mapping Fix (Latest Update)
- **Fully Working Edit Operations**: Edit, repeat, and delete functions now work correctly
- **Fixed Parameter Mapping**: Resolved backend parameter name mapping issues
- **Reliable Task Management**: All task operations (create/edit/repeat/delete) fully functional
- **Consistent Behavior**: Same parameter handling across all operation modes

### 🔄 Pure Passthrough Design
- **Server-First Architecture**: All business logic and tool definitions from server
- **Automatic Updates**: New server features available without client updates
- **Dual-Layer Validation**: Client validates required fields, server handles business logic

## Powered By

This client connects to the AnimAgent service by [Sumatman AI](https://app.sumatman.ai), bringing AI-powered story animation capabilities to developers worldwide.