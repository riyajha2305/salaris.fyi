"use client";

import React from "react";
import { SalaryData } from "./Header";

interface CTCBreakupProps {
  data: SalaryData;
  variant: "panel" | "page";
  formatCurrencyCompact: (amount: number) => string;
  interactionBar?: React.ReactNode;
}

export function calculateCTCBreakup(data: SalaryData) {
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
}

export default function CTCBreakup({
  data,
  variant,
  formatCurrencyCompact,
  interactionBar,
}: CTCBreakupProps) {
  const isPageVariant = variant === "page";
  const ctcBreakup = calculateCTCBreakup(data);

  if (isPageVariant) {
    return (
      <div className="px-6 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Compensation Details
        </h2>
        {ctcBreakup && (
          <div className="space-y-3">
            {ctcBreakup.components.map((component, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">
                  {component.name}
                </span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrencyCompact(component.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {component.percentage}%
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-4 bg-gray-200 rounded-lg border-2 border-gray-300 mt-4">
              <span className="text-base font-bold text-gray-900">
                Total CTC
              </span>
              <span className="text-base font-bold text-gray-900">
                {formatCurrencyCompact(ctcBreakup.total)}
              </span>
            </div>
          </div>
        )}
        {/* Interaction Bar - Rendered after Total CTC */}
        <div className="mt-4">
          {interactionBar}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-0 flex flex-col">
      <div className="px-6 py-4 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Compensation Details
        </h3>
        {ctcBreakup && (
          <div className="w-full space-y-2">
            {ctcBreakup.components.map((component, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <span className="text-sm text-gray-700 font-medium">
                  {component.name}
                </span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrencyCompact(component.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {component.percentage}%
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-200 rounded-lg border-2 border-gray-300 mt-2">
              <span className="text-sm font-bold text-gray-900">
                Total CTC
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrencyCompact(ctcBreakup.total)}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Interaction Bar - Rendered after Total CTC */}
      <div className="mt-2">
        {interactionBar}
      </div>
    </div>
  );
}

