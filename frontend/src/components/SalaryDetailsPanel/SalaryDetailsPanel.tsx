"use client";

import React, { useMemo, useState } from "react";
import CommentSection from "./components/Comments/CommentSection";
import VerifiedSalary from "./components/VerifiedSalary/VerifiedSalary";

interface SalaryData {
  id?: string;
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
  min_salary?: number;
  max_salary?: number;
  avg_salary?: number;
  stipend_min?: number;
  stipend_max?: number;
  stipend_avg?: number;
  yoe?: number;
  reports: number;
  university?: string;
  employment_type?: string;
  duration?: string;
  year?: number;
  base_salary?: number;
  bonus?: number;
  stock_compensation?: number;
  total_compensation?: number;
  upvotes?: number;
  downvotes?: number;
}

interface SalaryDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: SalaryData | null;
  onRefresh?: () => void;
}

export default function SalaryDetailsPanel({
  isOpen,
  onClose,
  data,
  onRefresh,
}: SalaryDetailsPanelProps) {
  const [commentCount, setCommentCount] = useState(0);
  
  // Generate a unique salary ID for comments/votes
  const salaryId = useMemo(() => {
    if (!data) return "";
    // Always use database ID for voting (must be UUID)
    if (data.id) {
      return data.id;
    }
    // Fallback: generate from data for comments
    const company = data.company_name || data.company || "unknown";
    const role = data.designation || data.role || "unknown";
    const location = data.location || "unknown";
    return `${company}-${role}-${location}`.toLowerCase().replace(/\s+/g, "-");
  }, [data]);

  if (!isOpen || !data) return null;

  return (
    <div className="w-[30%] bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex flex-col h-full">
      <div className="flex flex-col flex-1 min-h-0">
        <VerifiedSalary
          data={data}
          onRefresh={onRefresh}
          commentCount={commentCount}
          onCommentCountChange={setCommentCount}
          variant="panel"
          showExpandButton={true}
          showCloseButton={true}
          onClose={onClose}
        />

        {/* Comments Section */}
        <div className="px-6 pt-4 pb-4 border-t border-gray-200 flex-1 min-h-0 overflow-y-auto">
          <CommentSection
            salaryId={salaryId}
            upvoteCount={data.upvotes || 0}
            downvoteCount={data.downvotes || 0}
            onVoteChange={onRefresh}
            onCommentCountChange={setCommentCount}
          />
        </div>
      </div>
    </div>
  );
}

