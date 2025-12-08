"use client";

import React from "react";
import { Paper } from "@mui/material";

interface AdPanelProps {
  slotId?: string;
  height?: string;
}

export default function AdPanel({ 
  slotId = "default",
  height = "250px" 
}: AdPanelProps) {
  return (
    <Paper 
      elevation={1} 
      className="bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center"
      style={{ minHeight: height }}
    >
      <div className="text-center p-4">
        <p className="text-sm font-medium text-gray-500">Ad</p>
        {slotId !== "default" && (
          <p className="text-xs text-gray-400 mt-1">Slot: {slotId}</p>
        )}
      </div>
    </Paper>
  );
}

