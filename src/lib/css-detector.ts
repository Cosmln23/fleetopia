/**
 * CSS Health Detection Utilities
 * Auto-detects when Tailwind CSS fails to load and provides diagnostics
 */

export function detectTailwindLoading(): boolean {
  if (typeof window === 'undefined') return true; // Server-side, assume OK
  
  try {
    // Create a test element to check if Tailwind classes are applied
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500 text-white p-4 absolute -top-96 opacity-0 pointer-events-none';
    testElement.style.cssText = 'position: absolute !important; top: -9999px !important;';
    
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    const padding = computedStyle.padding;
    
    document.body.removeChild(testElement);
    
    // Check if Tailwind styles are applied (red background, white text, padding)
    const hasRedBackground = backgroundColor.includes('rgb(239, 68, 68)') || backgroundColor.includes('#ef4444');
    const hasWhiteText = color.includes('rgb(255, 255, 255)') || color.includes('#ffffff') || color.includes('white');
    const hasPadding = padding !== '0px' && padding !== '';
    
    return hasRedBackground && hasWhiteText && hasPadding;
  } catch (error) {
    console.warn('CSS detection failed:', error);
    return true; // Fail gracefully, assume CSS is working
  }
}

export function getCSSLoadingStatus() {
  const tailwindWorking = detectTailwindLoading();
  const stylesheets = Array.from(document.styleSheets);
  const nextCSSPresent = stylesheets.some(sheet => 
    sheet.href?.includes('/_next/static/css/') || 
    sheet.href?.includes('/app/layout.css')
  );
  
  return {
    tailwindWorking,
    stylesheetCount: stylesheets.length,
    nextCSSPresent,
    recommendation: !tailwindWorking ? 
      'Run `npm run fix-cache` and restart dev server' : 
      'CSS is working normally'
  };
}

export function logCSSStatus() {
  if (typeof window === 'undefined') return;
  
  const status = getCSSLoadingStatus();
  
  if (!status.tailwindWorking) {
    console.error('🎨 Tailwind CSS not loading properly!', status);
    console.info('💡 Fix: Run `npm run health` to diagnose, then `npm run fix-cache`');
  } else {
    console.log('✅ CSS Status: All stylesheets loaded correctly');
  }
}

// Auto-run CSS detection in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(logCSSStatus, 1000); // Wait 1s after page load
  });
}