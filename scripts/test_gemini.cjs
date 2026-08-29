const fs = require('fs');
const path = require('path');

// Read .env manually
const envRaw = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
let apiKey = null;
envRaw.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v && (k.trim() === 'GEMINI_API_KEY' || k.trim() === 'GOOGLE_API_KEY' || k.trim() === 'GOOGLE_MAPS_API_KEY')) {
    apiKey = v.trim();
  }
});

console.log('Testing Gemini API key from .env (Key present:', !!apiKey, ')');

async function testCall() {
  if (!apiKey) {
    console.error('No API key found!');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello, confirm you are working." }] }]
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data).slice(0, 200));
}

testCall();
