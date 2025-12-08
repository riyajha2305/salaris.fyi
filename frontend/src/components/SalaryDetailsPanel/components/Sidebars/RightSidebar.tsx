"use client";

import React from "react";
import { Box } from "@mui/material";
import { AdPanel, RelatedCompaniesPanel } from "./panels";

interface SalaryData {
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
}

interface RightSidebarProps {
  salaryData: SalaryData;
}

export default function RightSidebar({ salaryData }: RightSidebarProps) {
  const companyName = salaryData.company_name || salaryData.company || "";
  const designation = salaryData.designation || salaryData.role || "";
  const location = salaryData.location || "";

  return (
    <Box className="w-full flex flex-col gap-4">
      <AdPanel slotId="top" height="200px" />
      <RelatedCompaniesPanel
        currentCompany={companyName}
        currentDesignation={designation}
        location={location}
      />
      <AdPanel slotId="bottom" height="200px" />
    </Box>
  );
}

