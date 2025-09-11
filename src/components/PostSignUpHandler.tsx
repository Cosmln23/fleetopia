'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCreateUser } from '@/hooks/useCreateUser';

export default function PostSignUpHandler() {
  const { user, isLoaded } = useUser();
  const { createUser } = useCreateUser();

  useEffect(() => {
    const handleUserCreation = async () => {
      if (!isLoaded || !user) return;

      // Check if this is a new user (first login)
      const isNewUser = user.createdAt && 
        (Date.now() - new Date(user.createdAt).getTime()) < 60000; // Within last minute

      if (isNewUser && user.primaryEmailAddress) {
        try {
          await createUser({
            email: user.primaryEmailAddress.emailAddress,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
          });
          console.log('User and Stripe customer created successfully');
        } catch (error) {
          console.error('Failed to create user:', error);
        }
      }
    };

    handleUserCreation();
  }, [isLoaded, user, createUser]);

  return null; // This component doesn't render anything
}