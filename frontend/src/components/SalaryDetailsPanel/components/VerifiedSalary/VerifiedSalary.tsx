"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { voteOnSalary, getUserVote } from "@/lib/supabase/salaryVotes";
import { generateSalaryUrl } from "@/lib/utils/slug";
import Header, { SalaryData } from "./components/Header";
import ActionButtonOverlay from "./components/ActionButtonOverlay";
import CTCBreakup from "./components/CTCBreakup";
import InteractionBar from "./components/InteractionBar";

interface VerifiedSalaryProps {
  data: SalaryData;
  onRefresh?: () => void;
  commentCount?: number;
  onCommentCountChange?: (count: number) => void;
  variant?: "panel" | "page";
  showExpandButton?: boolean;
  onExpand?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function VerifiedSalary({
  data,
  onRefresh,
  commentCount: externalCommentCount,
  onCommentCountChange,
  variant = "panel",
  showExpandButton = true,
  onExpand,
  showCloseButton = true,
  onClose,
}: VerifiedSalaryProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [votes, setVotes] = useState({
    upvotes: data?.upvotes || 0,
    downvotes: data?.downvotes || 0,
  });
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const commentCount = externalCommentCount !== undefined ? externalCommentCount : 0;

  const salaryId = data?.id || "";

  // Update votes when data changes
  useEffect(() => {
    if (data) {
      setVotes({
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
      });
    }
  }, [data?.id, data?.upvotes, data?.downvotes]);

  const loadUserVote = async () => {
    try {
      const vote = await getUserVote(salaryId);
      setUserVote(vote);
    } catch (error) {
      console.error("Error loading user vote:", error);
      setUserVote(null);
    }
  };

  // Load user vote
  useEffect(() => {
    if (salaryId && data?.id && user) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(data.id)) {
        loadUserVote();
      } else {
        setUserVote(null);
      }
    } else {
      setUserVote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salaryId, data?.id, user]);

  const handleVote = async (voteType: "up" | "down") => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (isVoting || !data?.id) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.id)) {
      alert("Voting is only available for verified salary entries");
      return;
    }

    try {
      setIsVoting(true);
      const result = await voteOnSalary(salaryId, voteType);

      if (result.success) {
        if (result.upvotes !== undefined && result.downvotes !== undefined) {
          setVotes({
            upvotes: result.upvotes,
            downvotes: result.downvotes,
          });
        }

        if (result.userVote !== undefined) {
          setUserVote(result.userVote);
        }

        if (onRefresh) {
          setTimeout(() => {
            onRefresh();
          }, 700);
        }
      } else {
        if (result.message) {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("An error occurred while voting. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 10000000) {
      return `Rs ${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `Rs ${(amount / 100000).toFixed(1)}L`;
    }
    return formatCurrency(amount);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!data?.id) {
      console.log("No ID found in data");
      return;
    }

    // Check if it's a valid UUID (database entry)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(data.id)) {
      // Database entry - generate SEO-friendly URL and navigate
      const url = generateSalaryUrl({
        company_name: data.company_name || data.company,
        designation: data.designation || data.role,
        location: data.location,
        id: data.id,
      });
      router.push(url);
    } else {
      // TODO: Remove this else block once hardcoded data for internships and university is no longer used
      // Hardcoded entry - pass data via sessionStorage
      const expandedData = {
        id: data.id,
        company_name: data.company_name || data.company,
        designation: data.designation || data.role,
        location: data.location,
        yoe: data.yoe || 0,
        avg_salary: data.avg_salary || data.stipend_avg || data.total_compensation || 0,
        data_points_count: data.reports || 1,
        reports: data.reports || 1,
        base_salary: data.base_salary,
        bonus: data.bonus,
        stock_compensation: data.stock_compensation,
        total_compensation: data.total_compensation || data.avg_salary || data.stipend_avg,
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
        stipend_avg: data.stipend_avg,
        duration: data.duration,
        university: data.university,
        employment_type: data.employment_type,
        year: data.year,
        additional_data: data.duration ? { duration: data.duration } : undefined,
        job_type: data.stipend_avg ? "internship" : undefined,
      };
      // Store data in sessionStorage for the expanded page to retrieve
      sessionStorage.setItem(`salary_${data.id}`, JSON.stringify(expandedData));
      // Navigate to the page (old format for hardcoded data)
      router.push(`/salaries/${data.id}`);
    }
  };

  const isPageVariant = variant === "page";

  return (
    <>
      {/* Header Section */}
      <div className="relative">
        <Header
          data={data}
          variant={variant}
        />

        {/* Action Buttons Overlay */}
        <ActionButtonOverlay
          variant={variant}
          showExpandButton={showExpandButton}
          showCloseButton={showCloseButton}
          dataId={data?.id}
          onExpand={handleExpand}
          onClose={onClose}
        />
      </div>

      {/* Content - CTC Breakup Section */}
      <CTCBreakup
        data={data}
        variant={variant}
        formatCurrencyCompact={formatCurrencyCompact}
        interactionBar={
          <InteractionBar
            data={data}
            variant={variant}
            votes={votes}
            userVote={userVote}
            isVoting={isVoting}
            commentCount={commentCount}
            onVote={handleVote}
          />
        }
      />
    </>
  );
}

