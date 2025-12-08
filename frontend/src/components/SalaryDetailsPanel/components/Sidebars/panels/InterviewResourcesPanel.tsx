"use client";

import React, { useState } from "react";
import { Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from "@mui/material";
import { ChevronDown, ExternalLink, BookOpen, FileText, Search } from "lucide-react";

interface InterviewResourcesPanelProps {
  companyName: string;
  designation: string;
  location: string;
}

export default function InterviewResourcesPanel({
  companyName,
  designation,
  location,
}: InterviewResourcesPanelProps) {
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Placeholder data - can be replaced with actual data fetching
  const interviewExperiences = [
    { title: "Interview Experience 1", url: "#" },
    { title: "Interview Experience 2", url: "#" },
  ];

  const preparationMaterials = [
    { title: "System Design Guide", url: "#" },
    { title: "DSA Practice Problems", url: "#" },
    { title: "Behavioral Questions", url: "#" },
  ];

  const scraperUrl = `#`; // Placeholder for scraper URL

  return (
    <Paper 
      elevation={1} 
      className="p-4 bg-white border border-gray-200 rounded-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Interview Resources
      </h3>

      {/* Past Interview Experiences */}
      <Accordion 
        expanded={expanded === "panel1"} 
        onChange={handleChange("panel1")}
        className="mb-2 shadow-none border border-gray-200"
      >
        <AccordionSummary
          expandIcon={<ChevronDown className="text-gray-600" />}
          className="min-h-[48px]"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-gray-900">
              Past Interview Experiences
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails className="pt-0">
          <List className="p-0">
            {interviewExperiences.map((exp, index) => (
              <ListItem key={index} className="px-0 py-1">
                <ListItemText
                  primary={
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-slate-900 no-underline flex items-center gap-1"
                    >
                      {exp.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  }
                />
              </ListItem>
            ))}
            {interviewExperiences.length === 0 && (
              <p className="text-xs text-gray-500 py-2">No experiences available</p>
            )}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Materials to Prepare */}
      <Accordion 
        expanded={expanded === "panel2"} 
        onChange={handleChange("panel2")}
        className="mb-2 shadow-none border border-gray-200"
      >
        <AccordionSummary
          expandIcon={<ChevronDown className="text-gray-600" />}
          className="min-h-[48px]"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-gray-900">
              Materials to Prepare
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails className="pt-0">
          <List className="p-0">
            {preparationMaterials.map((material, index) => (
              <ListItem key={index} className="px-0 py-1">
                <ListItemText
                  primary={
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-slate-900 no-underline flex items-center gap-1"
                    >
                      {material.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Interview Topics Scraper */}
      <div className="mt-2">
        <a
          href={scraperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 no-underline p-2 rounded hover:bg-gray-50 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Scraper to get topics asked in interviews</span>
          <ExternalLink className="w-3 h-3 ml-auto" />
        </a>
      </div>
    </Paper>
  );
}

