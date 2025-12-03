"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Share2 } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { CommentWithReplies, SortOption, Attachment } from "@/types/comments";
import { useAuth } from "@/contexts/AuthContext";
import { getComments, addComment, voteOnComment, deleteComment } from "@/lib/supabase/comments";
import { voteOnSalary, getUserVote } from "@/lib/supabase/salaryVotes";

interface CommentSectionProps {
  salaryId: string;
  upvoteCount?: number;
  downvoteCount?: number;
  initialCommentCount?: number;
  onVoteChange?: () => void;
}

export default function CommentSection({
  salaryId,
  upvoteCount = 91,
  downvoteCount = 6,
  initialCommentCount = 0,
  onVoteChange,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [votes, setVotes] = useState({
    upvotes: upvoteCount,
    downvotes: downvoteCount,
  });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update votes when prop changes (from refresh)
  useEffect(() => {
    setVotes({
      upvotes: upvoteCount,
      downvotes: downvoteCount,
    });
  }, [upvoteCount, downvoteCount]);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Load comments and user vote
  useEffect(() => {
    loadComments();
    loadUserVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryId, sortBy]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(salaryId, sortBy);
      setComments(fetchedComments);
      setCommentCount(fetchedComments.length);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVote = async () => {
    try {
      const vote = await getUserVote(salaryId);
      setUserVote(vote);
    } catch (error) {
      console.error("Error loading user vote:", error);
    }
  };

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    if (isVoting) return;

    try {
      setIsVoting(true);
      console.log("Voting with salaryId:", salaryId, "voteType:", voteType);
      const result = await voteOnSalary(salaryId, voteType);
      console.log("Vote result:", result);

      if (result.success) {
        // Update local vote state
        if (userVote === voteType) {
          // Toggling off - already handled by DB trigger, just update userVote
          setUserVote(null);
        } else if (userVote) {
          // Switching vote type - already handled by DB trigger
          setUserVote(voteType);
        } else {
          // New vote - already handled by DB trigger
          setUserVote(voteType);
        }

        // Notify parent to refresh data after a delay to let DB trigger complete
        if (onVoteChange) {
          setTimeout(() => {
            onVoteChange();
          }, 500);
        }
      } else {
        console.error("Vote failed:", result.message);
        alert(result.message || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("An error occurred while voting");
    } finally {
      setIsVoting(false);
    }
  };

  const generateAnonymousName = () => {
    const adjectives = [
      "Curious",
      "Bright",
      "Clever",
      "Savvy",
      "Smart",
      "Wise",
      "Bold",
    ];
    const nouns = [
      "Analyst",
      "Engineer",
      "Developer",
      "Professional",
      "Expert",
      "Specialist",
    ];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const handleAddComment = async (
    content: string,
    attachments?: Attachment[]
  ) => {
    try {
      const userId = user?.id || null;
      const displayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        generateAnonymousName();
      const photoURL =
        user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

      await addComment(
        salaryId,
        userId,
        displayName,
        photoURL,
        content,
        attachments
      );
      await loadComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  // Reply feature removed

  const handleVoteComment = async (
    commentId: string,
    voteType: "up" | "down"
  ) => {
    if (!user) return;

    try {
      await voteOnComment(commentId, user.id, voteType);
      await loadComments();
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  // Reply feature removed

  const handleDeleteComment = (commentId: string) => {
    setPendingDeleteId(commentId);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      setIsDeleting(true);
      await deleteComment(pendingDeleteId);
      setPendingDeleteId(null);
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reply feature removed

  return (
    <div className="mt-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("up")}
            disabled={isVoting || !user}
            className={`flex items-center gap-1 transition-colors ${
              userVote === "up"
                ? "text-green-600 hover:text-green-700"
                : "text-slate-600 hover:text-slate-800"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span className="text-sm font-medium">{votes.upvotes}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("down")}
            disabled={isVoting || !user}
            className={`flex items-center gap-1 transition-colors ${
              userVote === "down"
                ? "text-red-600 hover:text-red-700"
                : "text-slate-600 hover:text-slate-800"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-sm font-medium">{votes.downvotes}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">
            {commentCount}
          </span>
        </div>

        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors ml-auto">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Comments ({commentCount})
        </h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="best">Sort by: Best</option>
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="top">Sort by: Top</option>
          </select>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <CommentInput onSubmit={handleAddComment} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments
              .slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)
              .map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onVote={handleVoteComment}
                  onDelete={handleDeleteComment}
                />
              ))}
          </div>

          {Math.ceil(comments.length / itemsPerPage) > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 bg-white border border-gray-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(comments.length / itemsPerPage) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-slate-500 text-white shadow-md"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, Math.ceil(comments.length / itemsPerPage)))
                }
                disabled={currentPage === Math.ceil(comments.length / itemsPerPage)}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 bg-white border border-gray-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPendingDeleteId(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-5">
            <h4 className="text-base font-semibold text-slate-900 mb-2">Delete comment?</h4>
            <p className="text-sm text-slate-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
