"use client";

import React from "react";
import { X, Maximize2 } from "lucide-react";

interface ActionButtonOverlayProps {
  variant: "panel" | "page";
  showExpandButton: boolean;
  showCloseButton: boolean;
  dataId?: string;
  onExpand: (e: React.MouseEvent) => void;
  onClose?: () => void;
}

export default function ActionButtonOverlay({
  variant,
  showExpandButton,
  showCloseButton,
  dataId,
  onExpand,
  onClose,
}: ActionButtonOverlayProps) {
  if (variant === "page") return null;

  if (!showExpandButton && !showCloseButton) return null;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
      {showExpandButton && dataId && (
        <button
          onClick={onExpand}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer bg-white/80 backdrop-blur-sm"
          title="Expand to full page"
          type="button"
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      )}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors bg-white/80 backdrop-blur-sm"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </div>
  );
}

