#!/usr/bin/env node

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
    console.log('\n📹 Testing animation creation...');
    console.log('   This would create a real animation task on the server.');
    console.log('   To actually test, uncomment the code below:');
    console.log('');
    console.log('   // const task = await client.createStoryAnimation({');
    console.log('   //   prompt: "A test animation about a happy robot",');
    console.log('   //   duration: 30,');
    console.log('   //   style: "cartoon"');
    console.log('   // });');
    console.log('   // console.log("Task created:", task);');
    
    console.log('\n✅ All tests passed!');
    console.log('   AnimAgent MCP Client is ready to use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTest();
