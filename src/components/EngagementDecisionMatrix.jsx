"use client";

/**
 * Decision Matrix Component - Shows which engagement model matches client requirements
 *
 * This component displays:
 * 1. A table showing client requirements vs. engagement models
 * 2. Checkmarks (✓) for compatible matches
 * 3. Minus signs (−) for incompatible matches
 * 4. Summary cards showing total matches for each model
 */
const EngagementDecisionMatrix = ({
  description = "Alternatively, answer these simple questions to quickly determine the best engagement model based on your preferences for control, management, and project requirements.",
  requirements = [],
  modelNames = [],
  modelDescriptions = [],
}) => {
  // Count how many requirements match each model
  // Loop through all requirements and count compatible vs not compatible for each model
  const matches = modelNames.map((_, modelIndex) => {
    let perfect = 0;
    let notSuitable = 0;

    // Check each requirement for this model
    requirements.forEach((req) => {
      if (req.compatibility[modelIndex]) {
        perfect = perfect + 1; // Compatible
      } else {
        notSuitable = notSuitable + 1; // Not compatible
      }
    });

    return { perfect, notSuitable };
  });

  // Checkmark icon SVG
  const CheckIcon = () => (
    <svg
      className="w-7 h-7 text-white"
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
  );

  // Minus icon SVG
  const MinusIcon = () => (
    <svg
      className="w-7 h-7 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M20 12H4"
      />
    </svg>
  );

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Description Text */}
        <div className="mx-auto text-center mb-12 sm:mb-16">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-300 overflow-visible">
          {/* TABLE HEADER (Desktop Only) */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] bg-gradient-to-br from-purple-50 to-blue-50 border-b-2 border-gray-400 sticky top-6 z-50 rounded-t-2xl shadow-lg">
            {/* First Column: "Client Requirements" */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-r border-gray-300 flex items-center">
              <h3 className="text-sm font-bold text-gray-900">
                Client Requirements
              </h3>
            </div>

            {/* Remaining Columns: Model Names */}
            {modelNames.map((name, index) => {
              const modelNumber = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={index}
                  className="p-4 border-r border-gray-300 last:border-r-0"
                >
                  <div className="text-center mb-1">
                    <span className="text-[0.625rem] font-semibold text-gray-500 uppercase tracking-wider">
                      MODEL {modelNumber}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 text-center mb-2">
                    {name}
                  </h4>
                  <p className="text-[0.6875rem] text-gray-600 text-center leading-relaxed">
                    {modelDescriptions[index]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* TABLE BODY - List of Requirements */}
          <div>
            {requirements.map((req, rowIndex) => {
              const rowNumber = String(rowIndex + 1).padStart(2, "0");

              return (
                <div key={rowIndex}>
                  {/* MOBILE VIEW */}
                  <div className="lg:hidden border-b border-purple-200 last:border-b-0">
                    {/* Requirement Title */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-900 font-bold text-sm">
                            {rowNumber}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.requirement}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Icons (Mobile) */}
                    <div className="grid grid-cols-3 gap-px bg-purple-200">
                      {req.compatibility.map((isCompatible, idx) => {
                        const bgColor = isCompatible
                          ? "bg-green-50"
                          : "bg-red-50";
                        const iconBgColor = isCompatible
                          ? "bg-teal-500"
                          : "bg-red-500";
                        const firstWord = modelNames[idx]?.split(" ")[0];

                        return (
                          <div
                            key={idx}
                            className={`p-4 flex flex-col items-center justify-center ${bgColor}`}
                          >
                            <div className="mb-2 text-xs font-semibold text-gray-700 text-center">
                              {firstWord}
                            </div>
                            <div
                              className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}
                            >
                              {isCompatible ? <CheckIcon /> : <MinusIcon />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  <div className="hidden lg:grid lg:grid-cols-[280px_1fr_1fr_1fr] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                    {/* Requirement Column */}
                    <div className="p-6 bg-white border-r border-gray-200 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-900 font-bold text-base">
                          {rowNumber}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {req.requirement}
                      </p>
                    </div>

                    {/* Compatibility Columns */}
                    {req.compatibility.map((isCompatible, idx) => {
                      const bgColor = isCompatible
                        ? "bg-green-50"
                        : "bg-red-50";
                      const iconBgColor = isCompatible
                        ? "bg-teal-500"
                        : "bg-red-500";

                      return (
                        <div
                          key={idx}
                          className={`p-6 border-r border-gray-200 last:border-r-0 flex items-center justify-center ${bgColor}`}
                        >
                          <div
                            className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform`}
                          >
                            {isCompatible ? <CheckIcon /> : <MinusIcon />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY SECTION - Perfect Matches & Not Suitable Count */}
          <div className="border-t-2 border-gray-400">
            {/* Desktop Summary */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              {modelNames.map((name, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-white border-b-2 border-gray-300 p-6 h-28 flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-gray-900 text-center mb-3">
                      {name}
                    </h4>
                    <div className="h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  </div>

                  {/* Card Content - Numbers */}
                  <div className="p-8">
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      {/* Perfect Matches */}
                      <div className="text-center pr-4">
                        <div className="text-5xl font-bold text-teal-600 mb-2">
                          {matches[index].perfect}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Perfect Matches
                        </div>
                      </div>

                      {/* Not Suitable */}
                      <div className="text-center pl-4">
                        <div className="text-5xl font-bold text-red-600 mb-2">
                          {matches[index].notSuitable}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Not Suitable
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Summary */}
            <div className="lg:hidden p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">
              {modelNames.map((name, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border-2 border-purple-200 overflow-hidden"
                >
                  <div className="bg-white border-b-2 border-purple-200 p-4">
                    <h4 className="text-lg font-bold text-gray-900 text-center">
                      {name}
                    </h4>
                  </div>
                  <div className="p-4 flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-teal-600 mb-1">
                        {matches[index].perfect}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase">
                        Perfect Matches
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 mb-1">
                        {matches[index].notSuitable}
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase">
                        Not Suitable
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LEGEND - Explains what icons mean */}
            <div className="p-6 bg-white border-t border-gray-300">
              <div className="flex items-center justify-center gap-8">
                {/* Green Checkmark Legend */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Perfect Match for This Requirement
                  </span>
                </div>

                {/* Red Minus Legend */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M20 12H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Not Suitable for This Requirement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementDecisionMatrix;
