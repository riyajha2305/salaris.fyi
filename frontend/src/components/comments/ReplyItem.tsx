"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import VoteButtons from "./VoteButtons";
import AttachmentDisplay from "./AttachmentDisplay";
import { Reply } from "@/types/comments";
import { useAuth } from "@/contexts/AuthContext";

interface ReplyItemProps {
  reply: Reply;
  onVote: (replyId: string, voteType: "up" | "down") => void;
  onDelete?: (replyId: string) => void;
}

export default function ReplyItem({ reply, onVote, onDelete }: ReplyItemProps) {
  const { user } = useAuth();
  const isOwner = user?.id === reply.user_id && !reply.is_anonymous;
  const userVote = user ? reply.voted_by?.[user.id] || null : null;

  const timeAgo = reply.created_at
    ? formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })
    : "just now";

  return (
    <div className="flex gap-3 py-3">
      {/* User Avatar */}
      <img
        src={reply.user_photo_url || "/default-avatar.png"}
        alt={reply.user_display_name}
        className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0"
      />

      {/* Reply Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-slate-700">
            {reply.user_display_name}
          </span>
          {reply.is_anonymous && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
              Anonymous
            </span>
          )}
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">{timeAgo}</span>
        </div>

        <p className="text-sm text-slate-700 mb-2">{reply.content}</p>

        {/* Attachments */}
        {reply.attachments && reply.attachments.length > 0 && (
          <AttachmentDisplay attachments={reply.attachments} />
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <VoteButtons
            upvotes={reply.upvotes}
            downvotes={reply.downvotes}
            userVote={userVote}
            onVote={(voteType) => onVote(reply.id, voteType)}
            isDisabled={!user}
          />

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(reply.id)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
