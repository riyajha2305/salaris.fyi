"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Share2, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import VoteButtons from "../../Comments/VoteButtons";
import { generateSalaryUrl } from "@/lib/utils/slug";
import { SalaryData } from "./Header";

interface InteractionBarProps {
  data: SalaryData;
  variant: "panel" | "page";
  votes: {
    upvotes: number;
    downvotes: number;
  };
  userVote: "up" | "down" | null;
  isVoting: boolean;
  commentCount: number;
  onVote: (voteType: "up" | "down") => void;
}

export default function InteractionBar({
  data,
  variant,
  votes,
  userVote,
  isVoting,
  commentCount,
  onVote,
}: InteractionBarProps) {
  const { user } = useAuth();
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const shareButtonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  const isPageVariant = variant === "page";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = data?.id ? uuidRegex.test(data.id) : false;
  const isDisabled = isVoting || !data?.id || !isValidUuid;

  useEffect(() => {
    if (showShareMenu && shareButtonRef.current) {
      const rect = shareButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showShareMenu]);

  return (
    <>
      <div className="px-6 py-3 flex items-center gap-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <VoteButtons
            upvotes={votes.upvotes}
            downvotes={votes.downvotes}
            userVote={userVote}
            onVote={onVote}
            isDisabled={isDisabled}
          />
          {user && !isValidUuid && data?.id && (
            <span className="text-xs text-gray-500 italic">
              (Voting only for verified entries)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {commentCount || 0}
          </span>
        </div>

        <div className="relative ml-auto" ref={shareButtonRef}>
          <button
            onClick={() => {
              if (!data?.id) return;
              setShowShareMenu(!showShareMenu);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Share this salary"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {showShareMenu && data?.id && typeof window !== "undefined" && createPortal(
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              />

              {/* Share menu dropdown */}
              <div 
                className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2"
                style={{
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Native Share Option */}
                {navigator.share && (
                  <button
                    onClick={async () => {
                      if (!data.id) return;
                      const url = generateSalaryUrl({
                        company_name: data.company_name || data.company,
                        designation: data.designation || data.role,
                        location: data.location,
                        id: data.id,
                      });
                      const fullUrl = `${window.location.origin}${url}`;

                      try {
                        await navigator.share({
                          title: `${data.designation || data.role} Salary at ${data.company_name || data.company} in ${data.location}`,
                          text: `Check out this salary data on salaris.fyi!`,
                          url: fullUrl,
                        });
                        setShowShareMenu(false);
                      } catch (err) {
                        setShowShareMenu(false);
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share via...</span>
                  </button>
                )}

                {/* Copy Link Option */}
                <button
                  onClick={async () => {
                    if (!data.id) return;
                    const url = generateSalaryUrl({
                      company_name: data.company_name || data.company,
                      designation: data.designation || data.role,
                      location: data.location,
                      id: data.id,
                    });
                    const fullUrl = `${window.location.origin}${url}`;

                    try {
                      await navigator.clipboard.writeText(fullUrl);
                      setShareCopied(true);
                      setShowShareMenu(false);
                      setShowToast(true);
                      setTimeout(() => {
                        setShareCopied(false);
                        setShowToast(false);
                      }, 3000);
                    } catch (err) {
                      console.error("Failed to copy URL:", err);
                      alert("Failed to copy URL. Please copy manually.");
                      setShowShareMenu(false);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </>,
            document.body
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <Check className="w-5 h-5" />
          <span className="font-medium">Link copied to clipboard!</span>
        </div>
      )}
    </>
  );
}

