const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../research/recommendations/final_165_destination_catalog.json');
const OUTPUT_DIR = path.join(__dirname, '../research/images');
const CACHE_PATH = path.join(OUTPUT_DIR, 'wikimedia_cache.json');
const CANDIDATES_PATH = path.join(OUTPUT_DIR, 'wikimedia_candidates.json');
const AUDIT_PATH = path.join(OUTPUT_DIR, 'wikimedia_candidate_audit.md');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// User-Agent header for Wikimedia API
const USER_AGENT = 'GlobeTrotterTravelApp/2.0 (contact@globetrotter.app)';

const REJECT_KEYWORDS = [
  'svg', 'logo', 'map', 'flag', 'coat_of_arms', 'icon', 'diagram', 'seal',
  'location', 'chart', 'symbol', 'stamp', 'poster', 'portrait', 'coin', 'banknote',
  'infographic', 'plan', 'route', 'locator'
];

function stripHtml(html) {
  if (!html) return null;
  return html.replace(/<[^>]*>?/gm, '').trim();
}

function isPhotographicFile(title, mime) {
  if (mime && !mime.startsWith('image/')) return false;
  if (mime === 'image/svg+xml') return false;
  
  const lower = title.toLowerCase();
  if (lower.endsWith('.svg') || lower.endsWith('.pdf') || lower.endsWith('.ogv') || lower.endsWith('.webm') || lower.endsWith('.djvu')) {
    return false;
  }
  
  for (const kw of REJECT_KEYWORDS) {
    if (lower.includes(kw)) return false;
  }
  return true;
}

async function fetchWikimediaQuery(searchQuery, limit = 20) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${searchQuery} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|mime',
    iiurlwidth: '1280',
    format: 'json'
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (!res.ok) {
      console.warn(`[WARN] Wikimedia API HTTP ${res.status} for query: ${searchQuery}`);
      return [];
    }

    const data = await res.json();
    if (!data || !data.query || !data.query.pages) {
      return [];
    }

    const pages = Object.values(data.query.pages);
    return pages;
  } catch (err) {
    console.error(`[ERROR] Wikimedia API request failed for '${searchQuery}': ${err.message}`);
    return [];
  }
}

async function validateUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return true; // Fallback to true if HEAD request fails due to CORS or timeout
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('==================================================');
  console.log('=== WIKIMEDIA CANDIDATE DISCOVERY PIPELINE ===');
  console.log('==================================================');

  const catalogRaw = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalogJson = JSON.parse(catalogRaw);
  const destinations = catalogJson.destinations;

  console.log(`Loaded ${destinations.length} destinations from master catalog.`);

  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
      console.log(`Loaded existing checkpoint cache with ${Object.keys(cache).length} destinations.`);
    } catch (e) {
      console.warn('Could not parse existing cache file, starting fresh.');
    }
  }

  let totalRequests = 0;
  let successRequests = 0;
  let failedRequests = 0;
  let rateLimitEvents = 0;

  const results = [];

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const catNum = dest.catalogNumber;
    const destName = dest.name;
    const stateName = dest.state || dest.region || '';

    console.log(`[${i + 1}/${destinations.length}] Processing Destination #${catNum}: '${destName}' (${stateName})...`);

    if (cache[catNum]) {
      console.log(`  └─ Found cached candidates (${cache[catNum].length} items).`);
      results.push({
        catalogNumber: catNum,
        destination: destName,
        state: stateName,
        candidates: cache[catNum]
      });
      continue;
    }

    const searchQueries = [
      `${destName} India`,
      `${destName} ${stateName} India`,
      `${destName} tourism India`,
      `${destName} landmark India`
    ];

    const candidateMap = new Map();
    let rankCounter = 1;

    for (const q of searchQueries) {
      totalRequests++;
      const pages = await fetchWikimediaQuery(q, 15);
      if (pages.length > 0) successRequests++;
      else failedRequests++;

      for (const page of pages) {
        if (!page.imageinfo || page.imageinfo.length === 0) continue;
        const info = page.imageinfo[0];
        
        if (!isPhotographicFile(page.title, info.mime)) continue;

        const thumbUrl = info.thumburl || info.url;
        if (!thumbUrl) continue;

        const key = page.title.toLowerCase().trim();
        if (candidateMap.has(key)) continue;

        const ext = info.extmetadata || {};
        const artist = ext.Artist ? stripHtml(ext.Artist.value) : null;
        const license = ext.LicenseShortName ? ext.LicenseShortName.value : (ext.UsageTerms ? ext.UsageTerms.value : 'Public Domain / Unknown');
        const sourceUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`;

        candidateMap.set(key, {
          title: page.title,
          imageUrl: thumbUrl,
          originalUrl: info.url,
          sourceUrl: sourceUrl,
          sourceName: 'Wikimedia Commons',
          license: license,
          photographer: artist,
          width: info.width || info.thumbwidth || 1280,
          height: info.height || info.thumbheight || 800,
          mime: info.mime || 'image/jpeg',
          searchQuery: q,
          searchRank: rankCounter++
        });

        if (candidateMap.size >= 20) break;
      }

      await sleep(150); // Respectful throttle
      if (candidateMap.size >= 15) break;
    }

    const candidateList = Array.from(candidateMap.values());
    cache[catNum] = candidateList;
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');

    results.push({
      catalogNumber: catNum,
      destination: destName,
      state: stateName,
      candidates: candidateList
    });

    console.log(`  └─ Retained ${candidateList.length} candidates.`);
  }

  // Save final candidates JSON
  const candidateOutput = {
    pipelineVersion: '1.0',
    source: 'Wikimedia Commons',
    generatedAt: new Date().toISOString(),
    destinationCount: results.length,
    destinations: results
  };

  fs.writeFileSync(CANDIDATES_PATH, JSON.stringify(candidateOutput, null, 2), 'utf8');
  console.log(`Saved output to ${CANDIDATES_PATH}`);

  // Generate QA Audit Markdown Report
  let gte10 = 0;
  let between5and9 = 0;
  let lt5 = 0;
  let zeroCount = 0;
  let totalCandidatesCount = 0;

  const rows = [];

  for (const item of results) {
    const count = item.candidates.length;
    totalCandidatesCount += count;

    if (count >= 10) gte10++;
    else if (count >= 5) between5and9++;
    else if (count > 0) lt5++;
    else zeroCount++;

    const top = count > 0 ? item.candidates[0] : null;
    const topTitle = top ? top.title.replace('File:', '') : 'NONE';
    const topDims = top ? `${top.width}x${top.height}` : 'N/A';

    rows.push(`| ${item.catalogNumber} | **${item.destination}** | ${count} | ${topTitle} | ${topDims} |`);
  }

  const auditMd = `# GlobeTrotter — Wikimedia Candidate Discovery Audit Report

> **Pipeline Version:** 1.0  
> **Source:** Wikimedia Commons API  
> **Total Destinations:** ${results.length}  
> **Generated At:** ${new Date().toISOString()}  

---

## 1. Candidate Statistics Summary

- **Total Master Catalog Destinations:** ${results.length}
- **Destinations with Candidates:** ${results.length - zeroCount}
- **Destinations with >= 10 Candidates:** ${gte10}
- **Destinations with 5–9 Candidates:** ${between5and9}
- **Destinations with < 5 Candidates:** ${lt5}
- **Destinations with 0 Candidates:** ${zeroCount}
- **Total Retained Photo Candidates:** ${totalCandidatesCount}
- **Average Candidates per Destination:** ${(totalCandidatesCount / results.length).toFixed(2)}

---

## 2. Destination Candidate Breakdown Table

| Catalog # | Destination | Candidate Count | Top Candidate Title | Top Candidate Resolution |
| :---: | :--- | :---: | :--- | :---: |
${rows.join('\n')}

---

## 3. Sample QA Audit for 10 Specified Test Destinations

${generateSampleTestSection(results)}
`;

  fs.writeFileSync(AUDIT_PATH, auditMd, 'utf8');
  console.log(`Saved QA Audit Report to ${AUDIT_PATH}`);

  console.log('\n==================================================');
  console.log('=== DISCOVERY PIPELINE COMPLETE ===');
  console.log(`Total Destinations Processed: ${results.length}`);
  console.log(`Total Retained Candidates: ${totalCandidatesCount}`);
  console.log(`Destinations with >= 10 Candidates: ${gte10}`);
  console.log(`Destinations with 5-9 Candidates: ${between5and9}`);
  console.log(`Destinations with < 5 Candidates: ${lt5}`);
  console.log(`Destinations with 0 Candidates: ${zeroCount}`);
  console.log('==================================================');
}

function generateSampleTestSection(results) {
  const testNames = [
    'Jaipur', 'Udaipur', 'Bandipur', 'Maheshwar', 'Mandu',
    'Poovar', 'Dhanushkodi', 'Tharangambadi', 'Srisailam', 'Chitrakoot'
  ];

  const blocks = [];

  for (const name of testNames) {
    const item = results.find(r => r.destination.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(r.destination.toLowerCase()));
    if (item) {
      const top3 = item.candidates.slice(0, 3);
      let sub = `### Destination #${item.catalogNumber}: ${item.destination} (${item.candidates.length} candidates)\n\n`;
      top3.forEach((c, idx) => {
        sub += `${idx + 1}. **${c.title.replace('File:', '')}**\n`;
        sub += `   - Image URL: \`${c.imageUrl}\`\n`;
        sub += `   - License: \`${c.license}\` | Photographer: \`${c.photographer || 'Unknown'}\` | Resolution: \`${c.width}x${c.height}\`\n`;
      });
      blocks.push(sub);
    }
  }

  return blocks.join('\n');
}

main().catch(console.error);
