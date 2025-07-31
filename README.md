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

This project provides a lightweight passthrough client that bridges Claude Desktop with the AnimAgent remote MCP server. The client acts as a pure proxy, forwarding all requests to the server without any local business logic or validation.

**Design Philosophy**: The client is intentionally kept minimal - all tool definitions, validations, and business logic reside on the server side. This ensures consistency and allows server-side updates without requiring client updates.

It enables users to:

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
2. The client forwards the request to the AnimAgent server
3. The server processes the animation task
4. Results are returned back through the same chain

**Note**: All parameters and options are defined by the server. The client simply passes through your requests without modification.

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
- GitHub Issues: [Create an issue](https://github.com/preangelleo/animagent-mcp-client/issues)
- Email: atmansum@gmail.com
- Website: https://app.sumatman.ai

## Powered By

This client connects to the AnimAgent service by [Sumatman AI](https://app.sumatman.ai), bringing AI-powered story animation capabilities to developers worldwide.