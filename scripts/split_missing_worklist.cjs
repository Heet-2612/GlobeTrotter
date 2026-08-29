const fs = require('fs');
const path = require('path');

const SOURCE_PATH = path.join(__dirname, '../research/images/missing_destination_image_worklist.txt');
const PART1_PATH = path.join(__dirname, '../research/images/missing_image_worklist_part1.txt');
const PART2_PATH = path.join(__dirname, '../research/images/missing_image_worklist_part2.txt');

const rawContent = fs.readFileSync(SOURCE_PATH, 'utf8');
const lines = rawContent.split('\n').filter(l => l.trim().length > 0);

console.log('==================================================');
console.log('=== SPLITTING 57-ROW MISSING WORKLIST ===');
console.log('==================================================');
console.log(`Source Total Rows: ${lines.length}`);

if (lines.length !== 57) {
  console.error(`ERROR: Expected 57 rows in source file, but found ${lines.length}`);
  process.exit(1);
}

const part1Lines = lines.slice(0, 28);
const part2Lines = lines.slice(28, 57);

fs.writeFileSync(PART1_PATH, part1Lines.join('\n') + '\n', 'utf8');
fs.writeFileSync(PART2_PATH, part2Lines.join('\n') + '\n', 'utf8');

console.log(`Saved Part 1 (${part1Lines.length} rows) to ${PART1_PATH}`);
console.log(`Saved Part 2 (${part2Lines.length} rows) to ${PART2_PATH}`);

// Validation
const catNums1 = part1Lines.map(l => parseInt(l.split('|')[0].replace('#', '').trim(), 10));
const catNums2 = part2Lines.map(l => parseInt(l.split('|')[0].replace('#', '').trim(), 10));
const combinedSet = new Set([...catNums1, ...catNums2]);

console.log('\n--- VALIDATION CHECKLIST ---');
console.log(`Total Source Rows: ${lines.length} (Expected: 57)`);
console.log(`Part 1 Rows: ${part1Lines.length} (Expected: 28)`);
console.log(`Part 2 Rows: ${part2Lines.length} (Expected: 29)`);
console.log(`Combined Unique Catalog Numbers: ${combinedSet.size} (Expected: 57)`);
console.log(`Missing Rows: ${57 - combinedSet.size}`);
console.log(`Duplicate Rows: ${57 - combinedSet.size}`);
console.log('-----------------------------\n');

if (part1Lines.length !== 28 || part2Lines.length !== 29 || combinedSet.size !== 57) {
  console.error('Validation FAILED!');
  process.exit(1);
}

console.log('Validation Status: PASS');
