const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../research/recommendations/final_165_destination_catalog.json');
const PART1_PATH = path.join(__dirname, '../research/images/manual_image_curation_part_1.txt');
const PART2_PATH = path.join(__dirname, '../research/images/manual_image_curation_part_2.txt');
const TEMPLATE_PATH = path.join(__dirname, '../research/images/manual_image_curation_template.txt');

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8').replace(/^\uFEFF/, '')).destinations;

console.log('==================================================');
console.log('=== GENERATING MANUAL CURATION WORKLISTS ===');
console.log('==================================================');

const part1Lines = [];
const part2Lines = [];
const masterLines = [];

catalog.forEach(dest => {
  const line = `#${dest.catalogNumber} | ${dest.name} | ${dest.state || dest.region || ''} | `;
  masterLines.push(line);

  if (dest.catalogNumber <= 83) {
    part1Lines.push(line);
  } else {
    part2Lines.push(line);
  }
});

// Write files
fs.writeFileSync(PART1_PATH, part1Lines.join('\n') + '\n', 'utf8');
fs.writeFileSync(PART2_PATH, part2Lines.join('\n') + '\n', 'utf8');
fs.writeFileSync(TEMPLATE_PATH, masterLines.join('\n') + '\n', 'utf8');

console.log(`Saved Part 1 worklist (${part1Lines.length} destinations) to ${PART1_PATH}`);
console.log(`Saved Part 2 worklist (${part2Lines.length} destinations) to ${PART2_PATH}`);
console.log(`Saved Master Template (${masterLines.length} destinations) to ${TEMPLATE_PATH}`);

// Validation
console.log('\nRunning Worklist Validation...');
const p1Count = part1Lines.length;
const p2Count = part2Lines.length;
const totalCount = masterLines.length;

const seenCatNums = new Set();
let dupes = 0;
let nameMismatches = 0;

catalog.forEach(d => {
  if (seenCatNums.has(d.catalogNumber)) dupes++;
  seenCatNums.add(d.catalogNumber);
});

console.log('Validation Results:');
console.log(`  - Part 1 Destinations Count: ${p1Count} (Expected: 83)`);
console.log(`  - Part 2 Destinations Count: ${p2Count} (Expected: 82)`);
console.log(`  - Total Combined Destinations: ${totalCount} (Expected: 165)`);
console.log(`  - Unique Catalog Numbers (1-165): ${seenCatNums.size} / 165`);
console.log(`  - Duplicate Catalog Numbers: ${dupes}`);

if (p1Count !== 83 || p2Count !== 82 || totalCount !== 165 || seenCatNums.size !== 165 || dupes > 0) {
  console.error('Validation FAILED!');
  process.exit(1);
}

console.log('\n==================================================');
console.log('=== MANUAL_CURATION_WORKLIST = PASS ===');
console.log('==================================================');
