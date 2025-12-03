"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import { Attachment } from "@/types/comments";
import { formatFileSize } from "@/lib/supabase/storage";

interface AttachmentDisplayProps {
  attachments: Attachment[];
}

export default function AttachmentDisplay({ attachments }: AttachmentDisplayProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => (
        <div key={index}>
          {attachment.type === "image" ? (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-sm"
            >
              <img
                src={attachment.url}
                alt={attachment.name}
                className="rounded-lg border border-slate-200 hover:border-slate-300 transition-colors max-h-64 object-cover"
              />
            </a>
          ) : (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors max-w-sm"
            >
              <FileText className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 truncate font-medium">
                  {attachment.name}
                </p>
                <p className="text-xs text-slate-500">{formatFileSize(attachment.size)}</p>
              </div>
              <Download className="w-4 h-4 text-slate-500" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
