"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    console.log("Access Key:", accessKey ? "Key is set" : "Key is missing");

    try {
      const payload = {
        access_key: accessKey || "YOUR_ACCESS_KEY_HERE",
        name: formData.name,
        email: formData.email,
        message: formData.message,
        from_name: "salaris.fyi Contact Form",
        subject: "New Contact Form Submission from salaris.fyi",
      };

      console.log("Submitting form with payload:", {
        ...payload,
        access_key: "***hidden***",
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Web3Forms Response:", result);

      if (result.success) {
        console.log("✅ Form submitted successfully!");
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        console.error("❌ Form submission failed:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-700">Let's Talk</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-6 leading-relaxed text-center">
            Have questions, suggestions, or feedback? We'd love to hear from
            you.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-0.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-0.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-gray-700 mb-0.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Tell us more..."
              />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                Oops! Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-500 text-white py-2.5 px-5 rounded-lg hover:bg-slate-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

{/* Footer */ }
<footer className="bg-[#80A1BA] border-t border-[#6B8BA0] mt-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-[#F0F0F0] text-sm">
        © 2024 salaris.fyi. All rights reserved.
      </div>
      <div className="flex gap-6 text-sm">
        <Link
          href="/"
          className="text-[#F0F0F0] hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-[#F0F0F0] hover:text-white transition-colors"
        >
          About
        </Link>
        <Link href="/contact" className="text-[#F0F0F0] font-medium hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </div>
  </div>
</footer>
