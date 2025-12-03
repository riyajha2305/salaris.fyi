import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-700">Our Story</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent mb-4">
            About Us
          </h2>

          <div className="space-y-4 text-gray-700">
            <p className="text-sm leading-relaxed">
              Welcome to{" "}
              <span className="font-semibold text-slate-600">salaris.fyi</span>,
              your trusted source for salary insights and compensation data
              across top companies.
            </p>

            <p className="leading-relaxed">
              We believe in transparency when it comes to compensation. Our
              platform aggregates and presents salary information to help
              professionals make informed career decisions, negotiate better
              offers, and understand their market value.
            </p>

            <div className="pt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-sm leading-relaxed">
                To empower professionals with accurate, comprehensive salary
                data that promotes fair compensation and informed career
                decisions across the tech industry.
              </p>
            </div>

            

            
          </div>
        </div>
      </div>

    </div>
  );
}
