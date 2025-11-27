// src/viewmodels/auth/useAuthViewModel.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

export const useAuthViewModel = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [initializing]);

  return {
    user,
    initializing,
    isAuthenticated: !!user,
  };
};