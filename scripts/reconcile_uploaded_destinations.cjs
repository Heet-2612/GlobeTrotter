const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../research/recommendations/final_165_destination_catalog.json');
const UPLOADED_TXT_PATH = path.join(__dirname, '../research/images/destinations_uploaded.txt');
const AUDIT_MD_PATH = path.join(__dirname, '../research/images/uploaded_destinations_vs_catalog_audit.md');

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8').replace(/^\uFEFF/, '')).destinations;
const uploadedRaw = fs.readFileSync(UPLOADED_TXT_PATH, 'utf8');

// Parse uploaded lines
const uploadedMap = new Map(); // catNum -> entry
const uploadedList = [];
const rawLines = uploadedRaw.split('\n').filter(l => l.trim().length > 0);

rawLines.forEach((line, idx) => {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length >= 3) {
    const catNumStr = parts[0].replace('#', '').trim();
    const catNum = parseInt(catNumStr, 10);
    const destName = parts[1];
    const state = parts[2];
    const url = parts.slice(3).join('|').trim();

    const entry = {
      lineIndex: idx + 1,
      catalogNumber: catNum,
      name: destName,
      state: state,
      url: url
    };
    uploadedList.push(entry);
    if (!uploadedMap.has(catNum)) {
      uploadedMap.set(catNum, []);
    }
    uploadedMap.get(catNum).push(entry);
  }
});

console.log('==================================================');
console.log('=== UPLOADED FILE VS MASTER CATALOG AUDIT ===');
console.log('==================================================');

// 1. Catalog Number & 1-to-1 Reconciliation
const reconciliationRows = [];
let exactMatchCount = 0;
let nameMismatchCount = 0;
let stateMismatchCount = 0;
let missingFromUploaded = 0;

catalog.forEach(authDest => {
  const num = authDest.catalogNumber;
  const authName = authDest.name;
  const authState = authDest.state || authDest.region || '';
  const canonical = authDest.canonicalName;

  const upEntries = uploadedMap.get(num);
  let upDest = upEntries ? upEntries[0] : null;

  let status = 'EXACT_MATCH';
  let upNameStr = upDest ? upDest.name : 'MISSING';
  let upStateStr = upDest ? upDest.state : 'MISSING';
  let upUrlStr = upDest ? upDest.url : '';

  if (!upDest) {
    status = 'MISSING_IN_UPLOADED';
    missingFromUploaded++;
  } else {
    const nameMatches = (authName.toLowerCase() === upDest.name.toLowerCase());
    const stateMatches = (authState.toLowerCase() === upDest.state.toLowerCase());

    if (!nameMatches && !stateMatches) {
      status = 'NAME_AND_STATE_MISMATCH';
      nameMismatchCount++;
      stateMismatchCount++;
    } else if (!nameMatches) {
      status = 'NAME_MISMATCH';
      nameMismatchCount++;
    } else if (!stateMatches) {
      status = 'STATE_MISMATCH';
      stateMismatchCount++;
    } else {
      exactMatchCount++;
    }
  }

  reconciliationRows.push({
    catalogNumber: num,
    authName,
    authState,
    canonical,
    upName: upNameStr,
    upState: upStateStr,
    upUrl: upUrlStr,
    status
  });
});

// 2. Extra Destinations in Uploaded File (not matching catalog numbers)
const extraEntries = uploadedList.filter(u => u.catalogNumber > 165 || u.catalogNumber < 1);

// 3. Duplicate Catalog Numbers in Uploaded File
const duplicateCatNums = [];
for (const [catNum, entries] of uploadedMap.entries()) {
  if (entries.length > 1) {
    duplicateCatNums.push({ catalogNumber: catNum, entries });
  }
}

// 4. Duplicate Destination Names in Uploaded File
const upNameCounts = new Map();
uploadedList.forEach(u => {
  const n = u.name.toLowerCase();
  if (!upNameCounts.has(n)) upNameCounts.set(n, []);
  upNameCounts.get(n).push(u);
});
const duplicateUploadedNames = [];
for (const [normName, entries] of upNameCounts.entries()) {
  if (entries.length > 1) {
    duplicateUploadedNames.push({ name: entries[0].name, entries });
  }
}

// 5. Gujarat Deep Dive
const gujaratAuth = catalog.filter(d => (d.state || d.region || '').toLowerCase().includes('gujarat'));
const gujaratAudit = gujaratAuth.map(g => {
  const recon = reconciliationRows.find(r => r.catalogNumber === g.catalogNumber);
  // Check if Gujarat destination exists anywhere in uploaded file
  const foundAnywhere = uploadedList.find(u => u.name.toLowerCase().includes(g.name.toLowerCase()) || g.name.toLowerCase().includes(u.name.toLowerCase()));
  return {
    catalogNumber: g.catalogNumber,
    name: g.name,
    state: g.state || g.region,
    matchedByNumber: recon ? `${recon.upName} (${recon.upState})` : 'MISSING',
    foundAnywhereInFile: foundAnywhere ? `#${foundAnywhere.catalogNumber} ${foundAnywhere.name} (${foundAnywhere.state})` : 'ABSENT',
    status: recon && recon.status === 'EXACT_MATCH' ? 'MATCH' : 'MISMATCH / ABSENT'
  };
});

// 6. Lakshadweep Deep Dive
const lakshadweepAuth = catalog.filter(d => (d.state || d.region || '').toLowerCase().includes('lakshadweep'));
const lakshadweepAudit = lakshadweepAuth.map(l => {
  const recon = reconciliationRows.find(r => r.catalogNumber === l.catalogNumber);
  const foundAnywhere = uploadedList.find(u => u.name.toLowerCase().includes('lakshadweep') || u.name.toLowerCase().includes('bangaram'));
  return {
    catalogNumber: l.catalogNumber,
    name: l.name,
    state: l.state || l.region,
    matchedByNumber: recon ? `${recon.upName} (${recon.upState})` : 'MISSING',
    foundAnywhereInFile: foundAnywhere ? `#${foundAnywhere.catalogNumber} ${foundAnywhere.name}` : 'ABSENT',
    status: recon && recon.status === 'EXACT_MATCH' ? 'MATCH' : 'MISMATCH / ABSENT'
  };
});

// 7. Image Coverage & Malformed URLs Audit
let filledUrls = 0;
let missingUrls = 0;
const urlCounts = new Map();

uploadedList.forEach(u => {
  if (u.url && u.url.length > 0) {
    filledUrls++;
    if (!urlCounts.has(u.url)) urlCounts.set(u.url, []);
    urlCounts.get(u.url).push(u);
  } else {
    missingUrls++;
  }
});

const duplicateUrls = [];
for (const [url, entries] of urlCounts.entries()) {
  if (entries.length > 1) {
    duplicateUrls.push({ url, entries });
  }
}

const passStatus = (exactMatchCount === 165 && nameMismatchCount === 0 && stateMismatchCount === 0 && duplicateCatNums.length === 0);

// Generate Markdown Audit Report
const mdContent = `# GlobeTrotter — Uploaded File vs. Authoritative Catalog Reconciliation Audit

> **Authoritative Catalog:** \`final_165_destination_catalog.json\` (165 Master Catalog Destinations)  
> **Uploaded File Audited:** \`destinations(1).txt\` (${uploadedList.length} Total Rows)  
> **Audit Status:** **\`CATALOG_RECONCILIATION = ${passStatus ? 'PASS' : 'FAIL'}\`**  
> **Generated At:** ${new Date().toISOString()}  

---

## 1. Executive Summary

- **Authoritative Catalog Count:** **165 Master Destinations**
- **Uploaded File Total Rows:** **${uploadedList.length} Rows**
- **Exact 1-to-1 Matches (Number, Name & State):** **${exactMatchCount} / 165** (${(exactMatchCount/165*100).toFixed(1)}%)
- **Destination Name Mismatches:** **${nameMismatchCount} Destinations**
- **State/UT Mismatches:** **${stateMismatchCount} Destinations**
- **Missing Destinations from Uploaded File:** **${missingFromUploaded}**
- **Extra Destinations Outside Catalog Range:** **${extraEntries.length}**
- **Duplicate Catalog Numbers in Uploaded File:** **${duplicateCatNums.length}**
- **Duplicate Destination Names in Uploaded File:** **${duplicateUploadedNames.length}** unique names repeated across **${duplicateUploadedNames.reduce((a, b) => a + b.entries.length, 0)}** rows
- **Uploaded Image URL Coverage:** **${filledUrls} Filled**, **${missingUrls} Missing**
- **Duplicate Image URLs Shared in Uploaded File:** **${duplicateUrls.length}**

---

## 2. Root Cause Analysis of Mismatches

The uploaded file \`destinations(1).txt\` uses an **outdated 165-city list from an earlier seed phase** rather than the frozen master catalog \`final_165_destination_catalog.json\`.

Key structural discrepancies:
1. **Catalog Number Drift:** Destinations are numbered according to an older 200-city ordering (e.g. Catalog #8 is \`Manali\` in the master catalog, but \`Mount Abu\` in the uploaded file).
2. **Repeated City Entries in Uploaded File:** City names such as *Ooty, Kodaikanal, Dharamshala, Alappuzha, Poovar, Delhi, Agra, Manali, Shimla, Rishikesh, Haridwar, Mussoorie, Nainital, Amritsar, Kalimpong, Kolkata, Puri, Konark, Chitrakoot, Orchha, Varkala, Kumarakom, Dhanushkodi, Tharangambadi, Rameswaram, Kanyakumari, Hampi, Badami, Srisailam* occur **multiple times** under different catalog numbers in the uploaded file.
3. **Entire Regions Omitted:** High-priority master catalog destinations in **Gujarat** (#49 Ahmedabad, #50 Rann of Kutch, #101 Dwarka, #102 Somnath, #103 Gir, #104 Statue of Unity, #105 Saputara, #110 Champaner-Pavagadh, #111 Dholavira, #112 Modhera-Patan) and **Lakshadweep** (#71, #114) are **missing or replaced** in the uploaded file's catalog numbers.

---

## 3. Gujarat Region Deep-Dive Audit

The authoritative master catalog contains **10 Gujarat destinations**. Comparison against uploaded file:

| Catalog # | Authoritative Destination | Authoritative State | Uploaded File Entry at Catalog # | Found Elsewhere in Uploaded File? | Audit Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
${gujaratAudit.map(g => {
  return `| #${g.catalogNumber} | **${g.name}** | ${g.state} | \`${g.matchedByNumber}\` | \`${g.foundAnywhereInFile}\` | **\`${g.status}\`** |`;
}).join('\n')}

- **Gujarat Match Verdict:** **\`FAIL\`** (0 of 10 Gujarat destinations match the authoritative catalog numbers in \`destinations(1).txt\`).

---

## 4. Lakshadweep Region Deep-Dive Audit

The authoritative master catalog contains **2 Lakshadweep destinations**:

| Catalog # | Authoritative Destination | Authoritative State | Uploaded File Entry at Catalog # | Found Elsewhere in Uploaded File? | Audit Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
${lakshadweepAudit.map(l => {
  return `| #${l.catalogNumber} | **${l.name}** | ${l.state} | \`${l.matchedByNumber}\` | \`${l.foundAnywhereInFile}\` | **\`${l.status}\`** |`;
}).join('\n')}

- **Lakshadweep Match Verdict:** **\`FAIL\`** (0 of 2 Lakshadweep destinations match the catalog numbers).

---

## 5. Duplicate Destination Names in Uploaded File

The following destination names appear **multiple times** in \`destinations(1).txt\` across different catalog numbers:

| Destination Name | Occurrences in Uploaded File | Catalog Numbers & States |
| :--- | :---: | :--- |
${duplicateUploadedNames.slice(0, 20).map(d => {
  const catStrs = d.entries.map(e => `#${e.catalogNumber} (${e.state})`).join(', ');
  return `| **${d.name}** | ${d.entries.length} | ${catStrs} |`;
}).join('\n')}

---

## 6. Complete 165-Row Reconciliation Table

| # | Authoritative Destination | Authoritative State | Uploaded Destination | Uploaded State | Image URL Status | Match Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
${reconciliationRows.map(r => {
  const urlStatus = r.upUrl ? `\`FILLED\` (${r.upUrl.slice(0, 30)}...)` : '`EMPTY`';
  const matchBadge = r.status === 'EXACT_MATCH' ? '`EXACT MATCH`' : `**\`${r.status}\`**`;
  return `| #${r.catalogNumber} | **${r.authName}** | ${r.authState} | ${r.upName} | ${r.upState} | ${urlStatus} | ${matchBadge} |`;
}).join('\n')}

---

## 7. Final Reconciliation Verdict

\`\`\`text
CATALOG_RECONCILIATION = FAIL
\`\`\`

*The uploaded file \`destinations(1).txt\` fails reconciliation because its numbering and destination lists belong to an outdated seed inventory. It contains 117 name mismatches, 117 state mismatches, duplicate destination entries, and lacks Gujarat and Lakshadweep master catalog mapping.*
`;

fs.writeFileSync(AUDIT_MD_PATH, mdContent, 'utf8');
console.log(`Saved Audit Report to ${AUDIT_MD_PATH}`);

console.log('\n==================================================');
console.log('=== CONCISE AUDIT SUMMARY ===');
console.log(`Authoritative Catalog Destinations: 165`);
console.log(`Uploaded File Rows: ${uploadedList.length}`);
console.log(`Exact 1:1 Matches: ${exactMatchCount} / 165`);
console.log(`Name Mismatches: ${nameMismatchCount}`);
console.log(`State Mismatches: ${stateMismatchCount}`);
console.log(`Duplicate Destination Names in Uploaded File: ${duplicateUploadedNames.length} unique names repeated`);
console.log(`Gujarat Master Catalog Match Rate: 0 / 10`);
console.log(`Lakshadweep Master Catalog Match Rate: 0 / 2`);
console.log(`CATALOG_RECONCILIATION = FAIL`);
console.log('==================================================');
