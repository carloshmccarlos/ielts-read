#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating configuration files...');

// Check Next.js config
try {
  const nextConfig = require('../next.config.ts');
  console.log('✅ Next.js config is valid');
} catch (error) {
  console.error('❌ Next.js config error:', error.message);
}

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check if deprecated prisma config is removed
  if (packageJson.prisma) {
    console.warn('⚠️  Deprecated prisma config found in package.json');
  } else {
    console.log('✅ Package.json is clean (no deprecated prisma config)');
  }
  
  // Check required scripts
  const requiredScripts = ['build', 'dev', 'start'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length === 0) {
    console.log('✅ All required scripts are present');
  } else {
    console.warn('⚠️  Missing scripts:', missingScripts.join(', '));
  }
} catch (error) {
  console.error('❌ Package.json error:', error.message);
}

// Check Prisma schema
try {
  const prismaSchema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  if (prismaSchema.includes('previewFeatures = ["driverAdapters"]')) {
    console.warn('⚠️  Deprecated driverAdapters preview feature found in schema.prisma');
  } else {
    console.log('✅ Prisma schema is up to date');
  }
} catch (error) {
  console.error('❌ Prisma schema error:', error.message);
}

// Check environment files
const envFiles = ['.env.example'];
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.warn(`⚠️  ${file} is missing`);
  }
});

// Check critical files
const criticalFiles = [
  'public/manifest.json',
  'public/sw.js',
  'public/robots.txt',
  'components/seo/SEOOptimizer.tsx'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.warn(`⚠️  ${file} is missing`);
  }
});

console.log('\n🎉 Configuration validation complete!');
console.log('\nNext steps:');
console.log('1. Copy .env.example to .env.local and fill in your values');
console.log('2. Run "npm run build" to test the build');
console.log('3. Run "npm run dev" to start development server');
console.log('4. Run "npm run analyze" to analyze bundle size');