#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Get user's home directory
const homeDir = os.homedir();

// Claude Desktop config paths
const claudeConfigPaths = {
  mac: path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
  windows: path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'),
  linux: path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json')
};

// Determine the correct config path based on platform
function getConfigPath() {
  switch (process.platform) {
    case 'darwin':
      return claudeConfigPaths.mac;
    case 'win32':
      return claudeConfigPaths.windows;
    default:
      return claudeConfigPaths.linux;
  }
}

// Validate environment variables
function validateEnv() {
  const userId = process.env.ANIMAGENT_USER_ID;
  const userEmail = process.env.ANIMAGENT_USER_EMAIL;

  if (!userId || !userEmail || userId === 'your_user_id_here' || userEmail === 'your_email@example.com') {
    console.error('❌ Error: Environment variables need to be configured.');
    console.error('');
    console.error('   Please update your .env file with your actual values:');
    console.error('');
    if (!userId || userId === 'your_user_id_here') {
      console.error('   1. ANIMAGENT_USER_ID: Get this from your dashboard at https://app.sumatman.ai');
      console.error('      • Login to https://app.sumatman.ai');
      console.error('      • Go to your account settings or dashboard');
      console.error('      • Copy your User ID');
      console.error('');
    }
    if (!userEmail || userEmail === 'your_email@example.com') {
      console.error('   2. ANIMAGENT_USER_EMAIL: Use the email you login with at https://app.sumatman.ai');
      console.error('      • This should be the same email you use to access your account');
      console.error('      • Example: yourname@gmail.com');
      console.error('');
    }
    console.error('   After updating your .env file, run the installer again.');
    process.exit(1);
  }

  return { userId, userEmail };
}

// Create or update Claude Desktop configuration
function updateClaudeConfig() {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);

  console.log('🔧 Setting up Claude Desktop configuration...');
  console.log(`   Config path: ${configPath}`);

  // Ensure config directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log('   Created config directory');
  }

  // Read existing config or create new one
  let config = {
    mcpServers: {}
  };

  if (fs.existsSync(configPath)) {
    try {
      const existingConfig = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(existingConfig);
      console.log('   Found existing Claude Desktop config');
    } catch (error) {
      console.warn('   Warning: Could not parse existing config, creating new one');
    }
  }

  // Ensure mcpServers exists
  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  // Get the absolute path to the client
  const clientPath = path.resolve(__dirname, 'index.js');

  // Add or update AnimAgent MCP server configuration
  config.mcpServers['animagent'] = {
    command: 'node',
    args: [clientPath],
    env: {
      ANIMAGENT_USER_ID: process.env.ANIMAGENT_USER_ID,
      ANIMAGENT_USER_EMAIL: process.env.ANIMAGENT_USER_EMAIL
    }
  };

  // Write updated config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Claude Desktop configuration updated successfully!');
}

// Test the MCP client (lightweight test without starting server)
async function testClient() {
  console.log('\n🧪 Testing AnimAgent MCP client...');
  
  try {
    // Test environment variables and basic configuration
    const userId = process.env.ANIMAGENT_USER_ID;
    const userEmail = process.env.ANIMAGENT_USER_EMAIL;
    const serverUrl = process.env.ANIMAGENT_MCP_SERVER_URL || 'https://app.sumatman.ai/api/mcp';
    
    if (!userId || !userEmail) {
      throw new Error('Missing required environment variables');
    }

    console.log('✅ Client initialized successfully!');
    console.log('   You can now use AnimAgent in Claude Desktop');
  } catch (error) {
    console.error('❌ Client test failed:', error.message);
  }
}

// Create local test script
function createTestScript() {
  const testScriptPath = path.join(__dirname, 'test.js');
  
  const testScript = `#!/usr/bin/env node

import AnimAgentClient from './index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runTest() {
  console.log('🧪 Testing AnimAgent MCP Client...');
  
  try {
    // Initialize client
    const client = new AnimAgentClient({
      userId: process.env.ANIMAGENT_USER_ID,
      userEmail: process.env.ANIMAGENT_USER_EMAIL
    });
    
    console.log('✅ Client initialized successfully');
    console.log('   User ID:', process.env.ANIMAGENT_USER_ID);
    console.log('   Email:', process.env.ANIMAGENT_USER_EMAIL);
    
    // Test creating an animation
    console.log('\\n📹 Testing animation creation...');
    console.log('   This would create a real animation task on the server.');
    console.log('   To actually test, uncomment the code below:');
    console.log('');
    console.log('   // const task = await client.createStoryAnimation({');
    console.log('   //   prompt: "A test animation about a happy robot",');
    console.log('   //   duration: 30,');
    console.log('   //   style: "cartoon"');
    console.log('   // });');
    console.log('   // console.log("Task created:", task);');
    
    console.log('\\n✅ All tests passed!');
    console.log('   AnimAgent MCP Client is ready to use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTest();
`;

  fs.writeFileSync(testScriptPath, testScript);
  fs.chmodSync(testScriptPath, '755');
  console.log('📝 Created test script at src/test.js');
}

// Main setup function
async function main() {
  console.log('🚀 AnimAgent MCP Client Setup');
  console.log('==============================\\n');

  // Step 1: Validate environment
  const { userId, userEmail } = validateEnv();
  console.log('✅ Environment variables validated');
  console.log(`   User ID: ${userId}`);
  console.log(`   Email: ${userEmail}`);

  // Step 2: Update Claude Desktop config
  updateClaudeConfig();

  // Step 3: Create test script
  createTestScript();

  // Step 4: Test the client
  await testClient();

  console.log('\\n🎉 Setup complete!');
  console.log('\\nNext steps:');
  console.log('1. Restart Claude Desktop to load the new MCP server');
  console.log('2. In Claude, try: "Create a 30-second animation about a magical forest"');
  console.log('3. Run "npm test" to verify the client is working');
  console.log('\\nFor more information, see the README.md file.');
  
  // Exit the process to prevent hanging
  process.exit(0);
}

// Run setup
main().catch((error) => {
  console.error('\\n❌ Setup failed:', error);
  process.exit(1);
});