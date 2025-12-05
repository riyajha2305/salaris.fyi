"use client";

import React from "react";

export interface SalaryData {
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
  reports?: number;
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
  data_points_count?: number | null;
  years_of_experience?: number | null;
}

interface HeaderProps {
  data: SalaryData;
  variant: "panel" | "page";
}

export default function Header({ data, variant }: HeaderProps) {
  const isPageVariant = variant === "page";
  const headerPadding = isPageVariant ? "px-6 py-6" : "px-6 py-4";
  const titleSize = isPageVariant ? "text-2xl" : "text-lg";
  const subtitleSize = isPageVariant ? "text-lg" : "text-sm";

  return (
    <div className={`${headerPadding} border-b border-gray-200 ${isPageVariant ? "bg-gradient-to-r from-slate-50 to-slate-100" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className={`${titleSize} font-bold text-gray-900`}>
              {data.company_name || data.company}
            </h1>
            {data.id && (
              <img
                src="/verified_logo.png"
                alt="Verified"
                className={isPageVariant ? "w-10 h-10" : "w-8 h-8"}
              />
            )}
          </div>
          <p className={`${subtitleSize} text-gray-700`}>
            {data.designation || data.role} • {data.location}
          </p>
          {(data.years_of_experience !== null && data.years_of_experience !== undefined) && (
            <p className="text-sm text-gray-600 mt-1">
              {data.years_of_experience} years of experience
            </p>
          )}
          {data.duration && (
            <p className="text-sm text-gray-600 mt-1">
              Duration: {data.duration}
            </p>
          )}
          {data.university && (
            <p className="text-sm text-gray-600 mt-1">
              University: {data.university}
              {data.year && ` • Year: ${data.year}`}
              {data.employment_type && ` • ${data.employment_type}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

