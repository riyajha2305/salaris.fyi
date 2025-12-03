"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import VoteButtons from "./VoteButtons";
import CommentInput from "./CommentInput";
import AttachmentDisplay from "./AttachmentDisplay";
import { CommentWithReplies, Attachment } from "@/types/comments";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItemProps {
  comment: CommentWithReplies;
  onVote: (commentId: string, voteType: "up" | "down") => void;
  onDelete?: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  onVote,
  onDelete,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isOwner = user?.id === comment.user_id && !comment.is_anonymous;
  const userVote = user ? comment.voted_by?.[user.id] || null : null;

  const timeAgo = comment.created_at
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
    : "just now";

  const handleReply = async (content: string, attachments?: Attachment[]) => {};

  return (
    <div className="bg-white rounded-lg p-3 border border-slate-200">
      {/* Comment Header */}
      <div className="flex gap-3 mb-2">
        <img
          src={comment.user_photo_url || "/default-avatar.png"}
          alt={comment.user_display_name}
          className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-slate-700">
              {comment.user_display_name}
            </span>
            {comment.is_anonymous && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                Anonymous
              </span>
            )}
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed break-words">
            {isExpanded || (comment.content?.length || 0) <= 240
              ? comment.content
              : `${comment.content?.slice(0, 240)}...`}
          </p>
          {(comment.content?.length || 0) > 240 && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="mt-1 text-xs text-slate-500 hover:text-slate-700"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}

          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <AttachmentDisplay attachments={comment.attachments} />
          )}
        </div>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-3 mt-2">
        <VoteButtons
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          userVote={userVote}
          onVote={(voteType) => onVote(comment.id, voteType)}
          isDisabled={!user}
        />


        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="ml-auto p-1.5 rounded hover:bg-red-50 transition-colors"
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
          </button>
        )}
      </div>

      {/* Reply feature removed */}
    </div>
  );
}
