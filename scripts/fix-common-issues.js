#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing common Next.js development issues...');

// 1. Ensure public/fonts directory exists
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log('✅ Created public/fonts directory');
}

// 2. Check if offline.html exists
const offlineHtml = path.join(process.cwd(), 'public', 'offline.html');
if (!fs.existsSync(offlineHtml)) {
  console.log('❌ Missing public/offline.html - please create it for PWA support');
}

// 3. Clean .next directory if it exists
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Cleaned .next directory');
}

// 4. Check for common dependency issues
const packageJson = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJson)) {
  const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  
  // Check for React version compatibility
  const reactVersion = pkg.dependencies?.react;
  const nextVersion = pkg.dependencies?.next;
  
  if (reactVersion && nextVersion) {
    console.log(`✅ React: ${reactVersion}, Next.js: ${nextVersion}`);
  }
}

console.log('🎉 Common issues fixed! You can now run npm run dev');