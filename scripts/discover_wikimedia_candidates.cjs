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
  'location', 'chart', 'symbol', 'stamp', 'portrait', 'coin', 'banknote',
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

async function fetchWikimediaQuery(searchQuery, limit = 20, verbose = false) {
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
  
  if (verbose) {
    console.log(`[QUERY] ${searchQuery}`);
    console.log(`[REQUEST] ${url}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second hard timeout per request

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (verbose) {
      console.log(`[RESPONSE] HTTP ${res.status}`);
    }

    if (!res.ok) {
      console.warn(`[WARN] Wikimedia API HTTP ${res.status} for query: ${searchQuery}`);
      return [];
    }

    const data = await res.json();
    if (!data || !data.query || !data.query.pages) {
      if (verbose) console.log(`[RESULT] 0 Wikimedia results`);
      return [];
    }

    const pages = Object.values(data.query.pages);
    if (verbose) console.log(`[RESULT] ${pages.length} Wikimedia raw results`);
    return pages;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error(`[ERROR] Wikimedia API timeout (8s) for query: '${searchQuery}'`);
    } else {
      console.error(`[ERROR] Wikimedia API request failed for '${searchQuery}': ${err.message}`);
    }
    return [];
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  let targetDest = null;
  let rangeStart = null;
  let rangeEnd = null;

  for (const arg of args) {
    if (arg.startsWith('--destination=')) {
      targetDest = arg.split('=')[1].trim();
    } else if (arg.startsWith('--range=')) {
      const parts = arg.split('=')[1].split('-');
      rangeStart = parseInt(parts[0], 10);
      rangeEnd = parseInt(parts[1], 10);
    }
  }

  console.log('==================================================');
  console.log('=== WIKIMEDIA CANDIDATE DISCOVERY PIPELINE ===');
  console.log('==================================================');

  const catalogRaw = fs.readFileSync(CATALOG_PATH, 'utf8').replace(/^\uFEFF/, '');
  const catalogJson = JSON.parse(catalogRaw);
  let destinations = catalogJson.destinations;

  if (targetDest) {
    destinations = destinations.filter(d => d.name.toLowerCase() === targetDest.toLowerCase());
    console.log(`Filtering for single target destination: '${targetDest}' (${destinations.length} found).`);
  } else if (rangeStart !== null && rangeEnd !== null) {
    destinations = destinations.filter(d => d.catalogNumber >= rangeStart && d.catalogNumber <= rangeEnd);
    console.log(`Filtering for catalog range #${rangeStart} to #${rangeEnd} (${destinations.length} destinations).`);
  } else {
    console.log(`Loaded all ${destinations.length} destinations from master catalog.`);
  }

  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    } catch (e) {}
  }

  const results = [];
  const verbose = targetDest || (rangeStart !== null);

  const startTime = Date.now();

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const catNum = dest.catalogNumber;
    const destName = dest.name;
    const stateName = dest.state || dest.region || '';

    if (verbose) {
      console.log(`[START] Destination #${catNum}: ${destName} (${stateName})`);
    } else {
      console.log(`[${i + 1}/${destinations.length}] Processing Destination #${catNum}: '${destName}' (${stateName})...`);
    }

    // If running range or single test, bypass cache to verify live API behavior
    if (!verbose && cache[catNum]) {
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
      const pages = await fetchWikimediaQuery(q, 15, verbose);

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

      await sleep(100); // 100ms delay between queries
      if (candidateMap.size >= 15) break;
    }

    const candidateList = Array.from(candidateMap.values());
    if (!verbose) {
      cache[catNum] = candidateList;
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
    }

    results.push({
      catalogNumber: catNum,
      destination: destName,
      state: stateName,
      candidates: candidateList
    });

    if (verbose) {
      console.log(`[DONE] Destination #${catNum}: ${destName} (${candidateList.length} candidates retained)`);
      console.log('--------------------------------------------------');
    } else {
      console.log(`  └─ Retained ${candidateList.length} candidates.`);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Execution Completed in ${durationSec} seconds.`);
}

main().catch(console.error);
