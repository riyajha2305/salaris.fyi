"use client";

import React, { useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { CommentSection } from "./comments";

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

  // Debug logging
  useEffect(() => {
    if (salaryId && data) {
      console.log(
        "SalaryDetailsPanel - salaryId:",
        salaryId,
        "data.id:",
        data.id
      );
    }
  }, [salaryId, data]);

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

  const calculateCTCBreakup = () => {
    if (!data) return null;

    const isInternship = !!data.stipend_avg;

    if (isInternship) {
      const stipend = data.stipend_avg || 0;
      return {
        total: stipend,
        components: [
          { name: "Monthly Stipend", amount: stipend, percentage: 100 },
        ],
      };
    }

    // Use real data from database if available
    const total = data.total_compensation || data.avg_salary || 0;
    const base = data.base_salary || 0;
    const bonus = data.bonus || 0;
    const stock = data.stock_compensation || 0;

    // If we have the actual breakdown from database, use it
    if (base > 0) {
      const components = [];

      if (base > 0) {
        const basePercent = total > 0 ? Math.round((base / total) * 100) : 0;
        components.push({
          name: "Base Salary",
          amount: base,
          percentage: basePercent,
        });
      }

      if (bonus > 0) {
        const bonusPercent = total > 0 ? Math.round((bonus / total) * 100) : 0;
        components.push({
          name: "Bonus",
          amount: bonus,
          percentage: bonusPercent,
        });
      }

      if (stock > 0) {
        const stockPercent = total > 0 ? Math.round((stock / total) * 100) : 0;
        components.push({
          name: "Stock",
          amount: stock,
          percentage: stockPercent,
        });
      }

      if (components.length > 0) {
        return { total, components };
      }
    }

    // Fallback: calculate estimated breakdown if no detailed data
    const estimatedBase = Math.round(total * 0.7);
    const estimatedHra = Math.round(total * 0.2);
    const estimatedAllowances = total - estimatedBase - estimatedHra;

    return {
      total,
      components: [
        { name: "Base Salary", amount: estimatedBase, percentage: 70 },
        { name: "HRA", amount: estimatedHra, percentage: 20 },
        {
          name: "Other Allowances",
          amount: estimatedAllowances,
          percentage: 10,
        },
      ],
    };
  };

  const ctcBreakup = calculateCTCBreakup();

  if (!isOpen || !data) return null;

  return (
    <div className="w-[30%] bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {data.company_name || data.company}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              {data.designation || data.role} • {data.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* CTC Breakup Section */}
          <div className="px-6 py-3">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                CTC Breakup
              </h3>
              {ctcBreakup && (
                <div className="w-full space-y-2">
                  {ctcBreakup.components.map((component, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm h-12"
                    >
                      <span className="text-xs text-gray-700 font-medium">
                        {component.name}
                      </span>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-gray-900">
                          {formatCurrencyCompact(component.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {component.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-200 rounded-md border-2 border-slate-300 h-12">
                    <span className="text-xs font-bold text-gray-900">
                      Total CTC
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrencyCompact(ctcBreakup.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="px-6 pb-4">
            <CommentSection
              salaryId={salaryId}
              upvoteCount={data.upvotes || 0}
              downvoteCount={data.downvotes || 0}
              onVoteChange={onRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
