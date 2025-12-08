"use client";

import React from "react";
import { Box } from "@mui/material";
import { OtherLevelsPanel, InterviewResourcesPanel } from "./panels";

interface SalaryData {
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
}

interface LeftSidebarProps {
  salaryData: SalaryData;
}

export default function LeftSidebar({ salaryData }: LeftSidebarProps) {
  const companyName = salaryData.company_name || salaryData.company || "";
  const designation = salaryData.designation || salaryData.role || "";
  const location = salaryData.location || "";

  return (
    <Box className="w-full flex flex-col gap-4">
      <OtherLevelsPanel
        companyName={companyName}
        currentDesignation={designation}
        location={location}
      />
      <InterviewResourcesPanel
        companyName={companyName}
        designation={designation}
        location={location}
      />
    </Box>
  );
}

