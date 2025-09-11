# Fleetopia Stability Tools

## Quick Commands for CSS/Development Issues

### 🔍 Health Check
```bash
npm run health
```
Verifies:
- Tailwind CSS configuration
- File imports and paths  
- Cache status
- Prisma Windows compatibility

### 🧹 Fix Broken CSS
```bash
npm run fix-cache
npm run dev
```
Safely clears corrupted cache and regenerates CSS.

### 🔧 Full Recovery
If styles completely disappear:
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clear cache
npm run fix-cache
# 3. Health check
npm run health  
# 4. Restart
npm run dev
```

## Auto-Detection Features

### Development Mode
- **Auto CSS Detection**: Warns in console if Tailwind stops working
- **Health Logging**: Shows CSS load status after page loads
- **Prisma Auto-Generate**: Runs `prisma generate` after `npm install`

### Prevention
- **Surgical Cache Clearing**: Only removes corrupted files, preserves trace/types
- **Windows Compatibility**: Prisma configured with Windows binary targets
- **Path Validation**: Health check ensures all imports are correct

## Files Added
- `tools/health-check.js` - Diagnostic script
- `src/lib/css-detector.ts` - Runtime CSS detection
- `package.json` scripts: `health`, `fix-cache`, `postinstall`

## When Styles Break
1. **Don't panic** - run `npm run health` first
2. **Check console** - auto-detection shows warnings
3. **Surgical fix** - use `npm run fix-cache`, never delete entire `.next`
4. **Verify** - run `npm run health` again after restart

This prevents the need for manual debugging when CSS mysteriously disappears.