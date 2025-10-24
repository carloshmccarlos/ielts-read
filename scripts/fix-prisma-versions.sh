#!/bin/bash

echo "🔧 Fixing Prisma version alignment..."

# Remove node_modules and lock files
echo "📦 Cleaning up..."
rm -rf node_modules package-lock.json pnpm-lock.yaml bun.lockb

# Install with exact versions
echo "📥 Installing Prisma packages with aligned versions..."
npm install @prisma/adapter-neon@6.8.2 @prisma/client@6.8.2 --save-exact
npm install prisma@6.8.2 --save-dev --save-exact

# Regenerate Prisma client
echo "🔄 Regenerating Prisma client..."
npx prisma generate

echo "✅ Prisma versions aligned successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install remaining dependencies"
echo "2. Run 'npm run build' to test the build"
echo "3. Deploy to Vercel"