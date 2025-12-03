"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { signInWithGoogle, signOut as supabaseSignOut, onAuthStateChange } from "@/lib/supabase/auth";
import AuthModal from "@/components/auth/AuthModal";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const subscription = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      // The redirect happens automatically, so we don't close the modal here
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseSignOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
