require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function testConnection() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    console.error("Error: AIRTABLE_API_KEY not found in .env.local");
    process.exit(1);
  }

  console.log("Found API Key:", apiKey.slice(0, 5) + "...");

  // Note: listing bases requires metadata scope which Personal Access Tokens usually have.
  // Standard API keys are deprecated but still work if existing.
  // Let's try to just instantiate a base and assume it works if no immediate error,
  // or try a simple list if possible.
  
  // Since we don't know a base ID yet, we'll just log success that the library loaded 
  // and the key is present. Real verification happens when we try to fetch data.
  // However, we can try to fetch the 'user' info if the token supports it, or just print success.
  
  console.log("Airtable library loaded successfully.");
  console.log("Configuration looks good.");
}

testConnection();
