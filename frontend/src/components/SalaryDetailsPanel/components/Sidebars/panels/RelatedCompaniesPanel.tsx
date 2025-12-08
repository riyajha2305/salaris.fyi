"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Paper, List, ListItem, ListItemText, CircularProgress, Chip } from "@mui/material";
import { supabase } from "@/lib/supabase/config";
import { generateSalaryUrl } from "@/lib/utils/slug";

interface RelatedCompaniesPanelProps {
  currentCompany: string;
  currentDesignation: string;
  location: string;
}

interface RelatedCompany {
  id: string;
  company_name: string;
  designation: string;
  total_compensation?: number;
  avg_salary?: number;
}

export default function RelatedCompaniesPanel({
  currentCompany,
  currentDesignation,
  location,
}: RelatedCompaniesPanelProps) {
  const [companies, setCompanies] = useState<RelatedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedCompanies = async () => {
      try {
        setLoading(true);
        // Fetch companies with similar designation and location
        const { data, error } = await supabase
          .from("salaries")
          .select("id, company_name, designation, total_compensation, avg_salary")
          .eq("designation", currentDesignation)
          .eq("location", location)
          .neq("company_name", currentCompany)
          .order("total_compensation", { ascending: false })
          .limit(8);

        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error("Error fetching related companies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentCompany && location && currentDesignation) {
      fetchRelatedCompanies();
    }
  }, [currentCompany, location, currentDesignation]);

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
        Related Companies
      </h3>
      {loading ? (
        <div className="flex justify-center py-4">
          <CircularProgress size={24} />
        </div>
      ) : companies.length === 0 ? (
        <p className="text-sm text-gray-500">No related companies found</p>
      ) : (
        <List className="p-0">
          {companies.map((company) => {
            const url = generateSalaryUrl({
              company_name: company.company_name,
              designation: company.designation,
              location: location,
              id: company.id,
            });
            const salary = company.total_compensation || company.avg_salary;

            return (
              <ListItem
                key={company.id}
                className="px-0 py-2 border-b border-gray-100 last:border-b-0"
              >
                <ListItemText
                  primary={
                    <div className="flex items-center gap-2">
                      <Link
                        href={url}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 no-underline"
                      >
                        {company.company_name}
                      </Link>
                    </div>
                  }
                  secondary={
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatSalary(salary)}
                      </span>
                    </div>
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

