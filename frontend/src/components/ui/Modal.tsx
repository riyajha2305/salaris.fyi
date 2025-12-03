"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl";
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "md",
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
