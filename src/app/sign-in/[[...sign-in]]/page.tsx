'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(11, 11, 15, 0.3), rgba(11, 11, 15, 0.7)), url('/wallpaper.jpg')",
        filter: 'contrast(1.2) brightness(1.1)'
      }}
    >
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-8">
        <SignIn />
      </div>
    </div>
  );
}