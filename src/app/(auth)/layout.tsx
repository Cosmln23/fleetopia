import React from 'react';
import AuthExchangeFallback from './AuthExchangeFallback';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'radial-gradient(1200px 600px at 10% -20%, rgba(255,255,255,0.08), rgba(0,0,0,0) 60%), radial-gradient(1200px 600px at 90% 120%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(10,12,15,1), rgba(10,12,15,0.96))',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Client-side fallback: if code tokens present, ensure exchange happens */}
        <AuthExchangeFallback />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span
            style={{
              fontSize: 24,
              letterSpacing: 0.5,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Fletopia
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}


