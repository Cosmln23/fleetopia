#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function log(type, message) {
  const colors = {
    ok: '\x1b[32m✓\x1b[0m',
    warn: '\x1b[33m⚠\x1b[0m', 
    error: '\x1b[31m✗\x1b[0m',
    info: '\x1b[36mℹ\x1b[0m'
  };
  console.log(`${colors[type]} ${message}`);
}

function fileExists(filePath, name) {
  if (fs.existsSync(filePath)) {
    log('ok', `${name}: found (${filePath})`);
    return true;
  } else {
    log('error', `${name}: missing (${filePath})`);
    return false;
  }
}

function checkTailwindHealth() {
  log('info', 'Fleetopia Tailwind CSS Health Check');
  console.log('─'.repeat(50));
  
  let hasErrors = false;
  
  // 1. Check critical files existence
  const files = [
    ['src/app/layout.tsx', 'Layout file'],
    ['src/app/globals.css', 'Global CSS file'],
    ['tailwind.config.ts', 'Tailwind config'],
    ['postcss.config.js', 'PostCSS config']
  ];
  
  for (const [file, name] of files) {
    if (!fileExists(file, name)) {
      hasErrors = true;
    }
  }
  
  if (hasErrors) return false;
  
  // 2. Check layout imports globals.css
  const layoutPath = 'src/app/layout.tsx';
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes("import './globals.css'")) {
    log('ok', 'layout.tsx imports ./globals.css (relative)');
  } else if (layoutContent.includes('@/app/globals.css')) {
    log('warn', 'layout.tsx uses @/app/globals.css (works but prefer relative)');
  } else {
    log('error', "layout.tsx missing: import './globals.css'");
    hasErrors = true;
  }
  
  // 3. Check globals.css has Tailwind directives
  const globalsPath = 'src/app/globals.css';
  const globalsContent = fs.readFileSync(globalsPath, 'utf8');
  const directives = ['@tailwind base;', '@tailwind components;', '@tailwind utilities;'];
  
  for (const directive of directives) {
    if (globalsContent.includes(directive)) {
      log('ok', `globals.css has ${directive}`);
    } else {
      log('error', `globals.css missing ${directive}`);
      hasErrors = true;
    }
  }
  
  // 4. Check tailwind.config.ts includes src paths
  const configPath = 'tailwind.config.ts';
  const configContent = fs.readFileSync(configPath, 'utf8');
  const requiredPaths = ['./src/app/', './src/components/', './src/pages/'];
  
  for (const pathPattern of requiredPaths) {
    if (configContent.includes(pathPattern)) {
      log('ok', `tailwind.config.ts includes ${pathPattern}`);
    } else {
      log('warn', `tailwind.config.ts missing ${pathPattern} (add to content[])`);
    }
  }
  
  // 5. Check PostCSS config
  const postcssPath = 'postcss.config.js';
  const postcssContent = fs.readFileSync(postcssPath, 'utf8');
  if (postcssContent.includes('tailwindcss') && postcssContent.includes('autoprefixer')) {
    log('ok', 'postcss.config.js has tailwindcss + autoprefixer');
  } else {
    log('error', 'postcss.config.js missing tailwindcss/autoprefixer');
    hasErrors = true;
  }
  
  // 6. Check .next CSS generation
  const cssDir = '.next/static/css';
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    if (cssFiles.length > 0) {
      log('ok', `.next/static/css OK (${cssFiles.length} CSS files)`);
    } else {
      log('warn', '.next/static/css exists but no CSS files (restart dev server)');
    }
  } else {
    log('warn', '.next/static/css not found (start dev server or run build)');
  }
  
  // 7. Check Prisma Windows binary (if exists)
  const schemaPath = 'prisma/schema.prisma';
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    if (schemaContent.includes('windows') && schemaContent.includes('binaryTargets')) {
      log('ok', 'Prisma binaryTargets includes windows');
    } else {
      log('warn', 'Prisma: add binaryTargets = ["native", "windows"] and run prisma generate');
    }
  }
  
  console.log('─'.repeat(50));
  if (hasErrors) {
    log('error', 'Health check found issues. Fix them and restart dev server.');
    return false;
  } else {
    log('ok', 'Health check passed! All systems green.');
    return true;
  }
}

if (require.main === module) {
  const healthy = checkTailwindHealth();
  process.exit(healthy ? 0 : 1);
}

module.exports = { checkTailwindHealth };