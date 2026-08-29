const fs = require('fs');
const path = require('path');

// 1. Read API Key from .env
const envRaw = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
let apiKey = null;
envRaw.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v && (k.trim() === 'GEMINI_API_KEY' || k.trim() === 'GOOGLE_API_KEY')) {
    apiKey = v.trim();
  }
});

if (!apiKey) {
  console.error('STEP_6C_SINGLE_IMAGE_TEST = FAIL');
  console.error('Reason: Configuration failure - GEMINI_API_KEY not found in .env');
  process.exit(1);
}

async function runSingleImageTest() {
  try {
    // Stage 1: Profile loaded
    const profiles = JSON.parse(fs.readFileSync(path.join(__dirname, '../research/images/destination_visual_profiles.json'), 'utf8'));
    const jaipurProfile = profiles.find(p => p.catalogNumber === 1);
    if (!jaipurProfile) throw new Error('Jaipur visual profile not found');
    console.log('[1] Profile loaded: Jaipur (#1)');

    // Stage 2: Candidate loaded
    const reviewQueueData = JSON.parse(fs.readFileSync(path.join(__dirname, '../research/images/gemini_review_queue.json'), 'utf8')).destinations;
    const jaipurQueue = reviewQueueData.find(d => d.catalogNumber === 1);
    if (!jaipurQueue || !jaipurQueue.candidates || jaipurQueue.candidates.length === 0) throw new Error('Jaipur candidate queue not found');
    const firstCandidate = jaipurQueue.candidates[0];
    console.log('[2] Candidate loaded:', firstCandidate.title);

    // Stage 3: Candidate image URL
    console.log('[3] Candidate image URL:', firstCandidate.imageUrl);

    // Stage 4: Downloading image...
    console.log('[4] Downloading image...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const imgRes = await fetch(firstCandidate.imageUrl, {
      headers: { 'User-Agent': 'GlobeTrotterTravelApp/2.0 (contact@globetrotter.app)' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    // Stage 5: Image HTTP status
    console.log('[5] Image HTTP status:', imgRes.status);
    if (!imgRes.ok) throw new Error(`Image download failed with HTTP ${imgRes.status}`);

    const buffer = await imgRes.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Stage 6 & 7: Image byte size & MIME type
    console.log('[6] Image byte size:', buffer.byteLength, 'bytes');
    const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
    console.log('[7] MIME type:', mimeType);

    // Stage 8: Send actual image bytes to Gemini
    const model = 'gemini-3.6-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const promptText = `
Evaluate this image for destination Jaipur (Rajasthan).
Visual Profile:
- Hero Subjects: ${JSON.stringify(jaipurProfile.heroSubjects)}
- Primary Landmarks: ${JSON.stringify(jaipurProfile.primaryLandmarks)}

Return strictly valid JSON with schema:
{
  "decision": "STRONG" | "ACCEPTABLE" | "WEAK" | "REJECT",
  "overall": <number 0-100>,
  "reason": "<Detailed 2-3 sentence visual explanation>",
  "confidence": "HIGH" | "MEDIUM" | "LOW"
}
`;

    const geminiController = new AbortController();
    const geminiTimeout = setTimeout(() => geminiController.abort(), 30000);

    const gemRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inlineData: { mimeType: mimeType, data: base64Data } }
          ]
        }]
      }),
      signal: geminiController.signal
    });
    clearTimeout(geminiTimeout);

    console.log('[8] Gemini HTTP status:', gemRes.status);

    if (!gemRes.ok) {
      const errBody = await gemRes.text();
      throw new Error(`Gemini HTTP Error ${gemRes.status}: ${errBody.slice(0, 300)}`);
    }

    const gemData = await gemRes.json();
    const rawText = gemData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('\n--- RAW GEMINI RESPONSE ---');
    console.log(rawText);
    console.log('---------------------------\n');

    const cleanJson = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const parsed = JSON.parse(cleanJson);

    console.log('Parsed Evaluation Struct:');
    console.log(JSON.stringify({
      decision: parsed.decision,
      overall: parsed.overall,
      reason: parsed.reason,
      confidence: parsed.confidence
    }, null, 2));

    console.log('\nSTEP_6C_SINGLE_IMAGE_TEST = PASS');

  } catch (err) {
    console.error('\nSTEP_6C_SINGLE_IMAGE_TEST = FAIL');
    console.error('Exact Failure Reason:', err.message);
    process.exit(1);
  }
}

runSingleImageTest();
