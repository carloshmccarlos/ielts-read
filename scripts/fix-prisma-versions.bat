@echo off
echo 🔧 Fixing Prisma version alignment...

REM Remove node_modules and lock files
echo 📦 Cleaning up...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist bun.lockb del bun.lockb

REM Install with exact versions
echo 📥 Installing Prisma packages with aligned versions...
call npm install @prisma/adapter-neon@6.8.2 @prisma/client@6.8.2 --save-exact
call npm install prisma@6.8.2 --save-dev --save-exact

REM Regenerate Prisma client
echo 🔄 Regenerating Prisma client...
call npx prisma generate

echo ✅ Prisma versions aligned successfully!
echo.
echo Next steps:
echo 1. Run 'npm install' to install remaining dependencies
echo 2. Run 'npm run build' to test the build
echo 3. Deploy to Vercel

pause