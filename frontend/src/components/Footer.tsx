"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-200 to-slate-300 border-t border-slate-300/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-slate-600 text-sm">
            © 2025 salaris.fyi. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm">
            <Link 
              href="/" 
              className="text-slate-600 font-medium hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-600 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              About us
            </Link>
            <Link
              href="/community"
              className="text-slate-600 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              Community
            </Link>
            <Link
              href="/contact"
              className="text-slate-600 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
