"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Paper, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { supabase } from "@/lib/supabase/config";
import { generateSalaryUrl } from "@/lib/utils/slug";

interface OtherLevelsPanelProps {
  companyName: string;
  currentDesignation: string;
  location: string;
}

interface LevelData {
  id: string;
  designation: string;
  total_compensation?: number;
  avg_salary?: number;
}

export default function OtherLevelsPanel({
  companyName,
  currentDesignation,
  location,
}: OtherLevelsPanelProps) {
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherLevels = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("salaries")
          .select("id, designation, total_compensation, avg_salary")
          .eq("company_name", companyName)
          .eq("location", location)
          .neq("designation", currentDesignation)
          .order("total_compensation", { ascending: false })
          .limit(10);

        if (error) throw error;
        setLevels(data || []);
      } catch (error) {
        console.error("Error fetching other levels:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyName && location && currentDesignation) {
      fetchOtherLevels();
    }
  }, [companyName, location, currentDesignation]);

  const formatSalary = (amount?: number) => {
    if (!amount) return "N/A";
    if (amount >= 10000000) {
      return `Rs ${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `Rs ${(amount / 100000).toFixed(1)}L`;
    }
    return `Rs ${new Intl.NumberFormat("en-IN").format(amount)}`;
  };

  return (
    <Paper 
      elevation={1} 
      className="p-4 bg-white border border-gray-200 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Salaries at {companyName}
      </h3>
      {loading ? (
        <div className="flex justify-center py-4">
          <CircularProgress size={24} />
        </div>
      ) : levels.length === 0 ? (
        <p className="text-sm text-gray-500">No other roles found</p>
      ) : (
        <List className="p-0">
          {levels.map((level) => {
            const url = generateSalaryUrl({
              company_name: companyName,
              designation: level.designation,
              location: location,
              id: level.id,
            });
            const salary = level.total_compensation || level.avg_salary;

            return (
              <ListItem
                key={level.id}
                className="px-0 py-2 border-b border-gray-100 last:border-b-0"
              >
                <ListItemText
                  primary={
                    <Link
                      href={url}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 no-underline"
                    >
                      {level.designation}
                    </Link>
                  }
                  secondary={
                    <span className="text-xs text-gray-500">
                      {formatSalary(salary)}
                    </span>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}

