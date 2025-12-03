"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      await signInWithGoogle();
      onClose(); // Close modal on successful sign in
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={true}>
      <div className="text-center">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Welcome to Salaris.fyi
        </h2>
        <p className="text-slate-600 mb-8">
          Sign in with your Google account to continue
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {isSigningIn ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-slate-500 mb-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Features */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">
            What you'll get:
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Personal Dashboard</p>
                <p className="text-xs text-slate-600">
                  Track your salary insights and preferences
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Save Favorites</p>
                <p className="text-xs text-slate-600">
                  Bookmark interesting salary data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Get Notifications</p>
                <p className="text-xs text-slate-600">
                  Stay updated on new salary data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
