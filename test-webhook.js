#!/usr/bin/env node

/**
 * Make Webhook Integration Test Script
 * Tests the webhook integration without requiring Jest
 */

const https = require('https');

// Test data
const testPayload = {
  name: 'Test User',
  email: 'test@example.com',
  optInEmails: true,
  quiz: {
    segment: 'consulting',
    teamSize: '2-5',
    sentiment: 'curious',
    tools: ['Slack', 'Zoom'],
    pain: 'time_waste',
    valuePerMonth: 1500,
    urgency: 'quarter',
  },
  profile: {
    segment: 'consulting',
    score: 65,
    tier: 'mid',
    offer: 'Playbook Pro',
    identity_maturity: 1,
    integration_score: 2,
    pain_intensity: 2,
    budget_score: 2,
    urgency_score: 1,
  },
  timestamp: new Date().toISOString(),
  source: 'email_capture_form',
};

const webhookUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/dw9vllqgy7yvlpq92bnuxogf7ee58rrb';

console.log('🚀 Testing Make Webhook Integration');
console.log('=====================================');
console.log(`📡 Webhook URL: ${webhookUrl}`);
console.log(`📊 Test Payload:`, JSON.stringify(testPayload, null, 2));

// Function to send webhook
function sendWebhook(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'X-Webhook-Source': 'questionnaire-app',
        'X-Webhook-Timestamp': new Date().toISOString(),
      },
      timeout: 10000, // 10 second timeout
    };

    console.log('📤 Sending webhook request...');
    
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Webhook response: ${res.statusCode} ${res.statusMessage}`);
        if (responseData) {
          console.log('📄 Response data:', responseData);
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, data: responseData });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Webhook request failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Webhook request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

// Test function with retry logic
async function testWebhookWithRetry(payload, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`\n🔄 Attempt ${attempt}/${maxRetries}`);
      
      const result = await sendWebhook(webhookUrl, payload);
      
      console.log(`🎉 Success on attempt ${attempt}!`);
      return result;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error(`💥 All ${maxRetries} attempts failed`);
        throw error;
      }
      
      const delay = attempt * 1000; // Exponential backoff
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Main test execution
async function runTests() {
  try {
    console.log('\n🧪 Test 1: Single webhook delivery');
    await testWebhookWithRetry(testPayload);
    
    console.log('\n🧪 Test 2: Different payload (high-tier user)');
    const highTierPayload = {
      ...testPayload,
      name: 'Enterprise User',
      email: 'enterprise@example.com',
      quiz: {
        ...testPayload.quiz,
        segment: 'finance',
        teamSize: '21+',
        sentiment: 'daily',
        tools: ['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Notion'],
        valuePerMonth: 8000,
        urgency: 'asap',
      },
      profile: {
        ...testPayload.profile,
        segment: 'finance',
        score: 92,
        tier: 'high',
        offer: 'Playbook Plus',
        identity_maturity: 2,
        integration_score: 3,
        budget_score: 3,
        urgency_score: 2,
      },
    };
    await testWebhookWithRetry(highTierPayload);
    
    console.log('\n🧪 Test 3: Different payload (low-tier user)');
    const lowTierPayload = {
      ...testPayload,
      name: 'Startup User',
      email: 'startup@example.com',
      optInEmails: false,
      quiz: {
        ...testPayload.quiz,
        segment: 'other',
        teamSize: 'solo',
        sentiment: 'starting',
        tools: [],
        valuePerMonth: 200,
        urgency: 'research',
      },
      profile: {
        ...testPayload.profile,
        segment: 'other',
        score: 15,
        tier: 'low',
        offer: 'Plinko Pocket',
        identity_maturity: 0,
        integration_score: 1,
        budget_score: 0,
        urgency_score: 0,
      },
    };
    await testWebhookWithRetry(lowTierPayload);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Make webhook integration is working correctly');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
console.log('Starting Make webhook integration tests...\n');
runTests().then(() => {
  console.log('\n✨ Test execution completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Test execution failed:', error.message);
  process.exit(1);
});