'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface SubscriptionGateProps {
  children: React.ReactNode;
  proOnly?: boolean;
  fallback?: React.ReactNode;
}

interface UserRole {
  role: string;
  subscriptionEnd?: string;
}

export default function SubscriptionGate({ 
  children, 
  proOnly = false, 
  fallback 
}: SubscriptionGateProps) {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Simulez data de la database pentru acum
      // În implementarea reală, va fi fetch din User table
      const mockUserData: UserRole = {
        role: user.publicMetadata?.role as string || 'Trial',
        subscriptionEnd: user.publicMetadata?.subscriptionEnd as string
      };
      
      setUserRole(mockUserData);
      setIsLoading(false);
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return fallback || (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400">Trebuie să fii autentificat pentru a accesa această funcționalitate.</p>
      </div>
    );
  }

  const isPro = userRole?.role === 'Pro';
  const hasAccess = proOnly ? isPro : true; // Trial users au acces dacă nu e proOnly

  if (!hasAccess) {
    return fallback || (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
        <h3 className="text-amber-400 font-medium mb-2">Funcționalitate Pro</h3>
        <p className="text-amber-300/80 mb-4">
          Această funcționalitate este disponibilă doar pentru utilizatorii Pro.
        </p>
        <button className="bg-amber-600 hover:bg-amber-700 transition px-4 py-2 rounded-lg text-white font-medium">
          Upgrade la Pro
        </button>
      </div>
    );
  }

  return <>{children}</>;
}