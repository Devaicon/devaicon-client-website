"use client";

/**
 * Reusable Engagement Model Comparison Table Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Main section title
 * @param {string} props.highlightText - Text to highlight in title
 * @param {string} props.highlightColor - Color for highlighted text (default: "#3d234b")
 * @param {string} props.description - Section description
 * @param {Array<Object>} props.headers - Table header data (columns)
 * @param {Array<Object>} props.rows - Table row data (criteria)
 * @param {Array<Object>} props.bestSuited - Best suited use cases for each model
 */
const EngagementModelComparison = ({
  title = "How to Choose the Right Engagement Model?",
  highlightText = "Engagement Model?",
  highlightColor = "#3d234b",
  description = "Understand how each engagement model differs based on project complexity, cost, and risk management, and pick the one that aligns with your business goals.",
  headers = [],
  rows = [],
  bestSuited = [],
}) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        {/* Header Section */}
        <div className="mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
            {title.replace(highlightText, "")}
            <span style={{ color: highlightColor }}>{highlightText}?</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Comparison Container */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-300 overflow-visible ">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] bg-gradient-to-br from-purple-50 to-blue-50 border-b-2 border-gray-400 sticky top-6 z-50 rounded-t-2xl shadow-lg">
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#3d234b]">
                Evaluation Criteria
              </h3>
            </div>
            {headers.map((header, index) => (
              <div key={index} className="p-8 border-l border-gray-300">
                <h3 className="text-xl font-bold text-[#3d234b] mb-2">
                  {header.title}
                </h3>
                <p className="text-sm text-gray-700 mb-3">{header.subtitle}</p>
                <span className="inline-block px-4 py-1.5 bg-white border-2 border-[#3d234b] rounded-full text-xs font-semibold text-[#3d234b] uppercase tracking-wide">
                  {header.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex}>
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#3d234b] p-6 border-b border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 border-2 border-purple-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-300 font-bold text-lg">
                        {String(rowIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">
                      {row.criteria}
                    </h4>
                  </div>
                </div>

                {/* Desktop Row */}
                <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                  {/* Row Header */}
                  <div className="p-8 bg-white border-r border-gray-200 flex items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border-2 border-[#3d234b] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#3d234b] font-bold text-lg">
                          {String(rowIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {row.criteria}
                      </h4>
                    </div>
                  </div>

                  {/* Row Cells */}
                  {row.values.map((value, cellIndex) => (
                    <div
                      key={cellIndex}
                      className="p-8 border-r border-gray-200 last:border-r-0 bg-white"
                    >
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {value.text}
                      </p>
                      {value.tags && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {value.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {value.badge && (
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded mt-3 text-xs font-semibold ${
                            value.badge.type === "low"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : value.badge.type === "medium"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                : value.badge.type === "high"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : value.badge.type === "fixed"
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-purple-100 text-purple-800 border border-purple-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              value.badge.type === "low"
                                ? "bg-green-500"
                                : value.badge.type === "medium"
                                  ? "bg-yellow-500"
                                  : value.badge.type === "high"
                                    ? "bg-red-500"
                                    : value.badge.type === "fixed"
                                      ? "bg-blue-500"
                                      : "bg-purple-500"
                            }`}
                          ></span>
                          {value.badge.text}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Cells */}
                <div className="lg:hidden">
                  {row.values.map((value, cellIndex) => (
                    <div
                      key={cellIndex}
                      className="p-6 border-b border-purple-200 bg-white"
                    >
                      <h5 className="text-sm font-semibold text-[#3d234b] mb-3">
                        {headers[cellIndex]?.title}
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {value.text}
                      </p>
                      {value.tags && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {value.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {value.badge && (
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded mt-3 text-xs font-semibold ${
                            value.badge.type === "low"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : value.badge.type === "medium"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                : value.badge.type === "high"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : value.badge.type === "fixed"
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-purple-100 text-purple-800 border border-purple-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              value.badge.type === "low"
                                ? "bg-green-500"
                                : value.badge.type === "medium"
                                  ? "bg-yellow-500"
                                  : value.badge.type === "high"
                                    ? "bg-red-500"
                                    : value.badge.type === "fixed"
                                      ? "bg-blue-500"
                                      : "bg-purple-500"
                            }`}
                          ></span>
                          {value.badge.text}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Best Suited Section */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] bg-white border-t-2 border-gray-400">
            <div className="p-10 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center">
              <h3 className="text-xl font-bold text-[#3d234b]">
                Ideal Use Cases
              </h3>
            </div>
            {bestSuited.map((item, index) => (
              <div
                key={index}
                className="p-10 bg-white border-r border-gray-200 last:border-r-0"
              >
                <ul className="space-y-4">
                  {item.cases.map((useCase, caseIndex) => (
                    <li
                      key={caseIndex}
                      className="relative pl-8 text-sm text-gray-700 leading-relaxed border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="absolute left-0 top-1 w-5 h-5 bg-[#3d234b] rounded flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Best Suited */}
          <div className="lg:hidden border-t-4 border-purple-300">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="text-xl font-bold text-[#3d234b]">
                Ideal Use Cases
              </h3>
            </div>
            {bestSuited.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white border-b border-purple-200"
              >
                <h4 className="text-base font-semibold text-[#3d234b] mb-4">
                  {headers[index]?.title}
                </h4>
                <ul className="space-y-4">
                  {item.cases.map((useCase, caseIndex) => (
                    <li
                      key={caseIndex}
                      className="relative pl-8 text-sm text-gray-700 leading-relaxed border-b border-purple-200 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="absolute left-0 top-1 w-5 h-5 bg-[#3d234b] rounded flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementModelComparison;
