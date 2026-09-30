/**
 * ASTRA VISION Frontend Verification Script
 * Built by Preetham Alawandimath
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('============================================================');
console.log('ASTRA VISION FRONTEND VERIFICATION SUITE');
console.log('Built by Preetham Alawandimath');
console.log('------------------------------------------------------------');

const distDir = path.join(__dirname, 'dist');
const indexHtml = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

let passed = 0;
let total = 0;

// Test 1: Dist index.html exists
total++;
if (fs.existsSync(indexHtml)) {
  const htmlContent = fs.readFileSync(indexHtml, 'utf-8');
  if (htmlContent.includes('ASTRA VISION') && htmlContent.includes('Preetham Alawandimath')) {
    console.log('✓ Test 1: dist/index.html exists and contains verified creator attribution');
    passed++;
  } else {
    console.error('✗ Test 1: dist/index.html missing required metadata or attribution');
  }
} else {
  console.error('✗ Test 1: dist/index.html does not exist');
}

// Test 2: Assets directory has bundle JS and CSS
total++;
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  if (jsFiles.length > 0 && cssFiles.length > 0) {
    console.log(`✓ Test 2: dist/assets verified (${jsFiles.length} JS, ${cssFiles.length} CSS bundles found)`);
    passed++;
  } else {
    console.error('✗ Test 2: Missing JS or CSS bundles in dist/assets');
  }
} else {
  console.error('✗ Test 2: dist/assets does not exist');
}

// Test 3: Check bundle size
total++;
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  let totalAssetBytes = 0;
  for (const f of files) {
    totalAssetBytes += fs.statSync(path.join(assetsDir, f)).size;
  }
  const totalAssetKb = (totalAssetBytes / 1024).toFixed(1);
  if (totalAssetBytes < 2 * 1024 * 1024) {
    console.log(`✓ Test 3: Total bundle size is lightweight: ${totalAssetKb} KB (< 2 MB)`);
    passed++;
  } else {
    console.error(`✗ Test 3: Bundle size exceeds lightweight budget: ${totalAssetKb} KB`);
  }
}

console.log('------------------------------------------------------------');
console.log(`ALL FRONTEND TESTS PASSED: ${passed}/${total}`);
console.log('============================================================');

if (passed !== total) {
  process.exit(1);
}
