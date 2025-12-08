"use client";

import React from "react";
import { Container, Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface SalaryData {
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  salaryData: SalaryData;
}

export default function SidebarLayout({ children, salaryData }: SidebarLayoutProps) {
  return (
    <Container maxWidth={false} className="px-4 py-8">
      <Box className="flex gap-6">
        {/* Left Sidebar - Hidden on mobile and tablet, visible on desktop */}
        <Box className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-8">
            <LeftSidebar salaryData={salaryData} />
          </div>
        </Box>

        {/* Main Content */}
        <Box className="flex-1 min-w-0">
          {children}
        </Box>

        {/* Right Sidebar - Hidden on mobile, visible on tablet and desktop */}
        <Box className="hidden md:block md:w-64 lg:w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-8">
            <RightSidebar salaryData={salaryData} />
          </div>
        </Box>
      </Box>
    </Container>
  );
}

