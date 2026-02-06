const BadgesSection = () => {
  return (
    <section className="section-bg-brand py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container-responsive">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-7">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Your Vision, Our Expertise
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90">
            if You Can Imagine It, We Can Build It
          </p>
        </div>
        <div></div>

        {/* First Row - 9 badges */}
        <div className="badge-grid">
          {/* Clutch Rating */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="text-3xl font-bold mb-1">Clutch</div>
              <div className="text-sm text-orange-500 flex items-center justify-center gap-1">
                4.9/5.0 <span className="text-orange-500">★★★★★</span>
              </div>
            </div>
          </div>

          {/* AWS Partner */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="border-2 border-orange-400 rounded p-2">
                <div className="text-orange-500 font-bold text-xs">aws</div>
                <div className="text-gray-700 font-semibold text-xs mt-1">
                  PARTNER
                </div>
              </div>
            </div>
          </div>

          {/* LearnHub */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="bg-black text-white px-3 py-2 rounded font-bold text-sm">
                Learn<span className="text-red-500">Hub</span>
              </div>
            </div>
          </div>

          {/* Clutch Top Rated */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="border-2 border-gray-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <div className="text-xs font-semibold">
                  <div className="text-gray-700">Clutch</div>
                  <div className="text-gray-500 text-[10px]">TOP RATED</div>
                  <div className="text-gray-400 text-[8px]">2023</div>
                </div>
              </div>
            </div>
          </div>

          {/* Zyte */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="text-4xl font-bold text-purple-600">zyte</div>
            </div>
          </div>

          {/* ISO 27001 */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="border-2 border-blue-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <div className="text-xs font-semibold text-[#281333]">
                  <div className="text-[10px]">ISO/IEC</div>
                  <div className="text-lg font-bold">27001</div>
                  <div className="text-[8px]">Certified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Clutch B2B Companies */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="bg-gray-700 text-white px-2 py-3 rounded">
                <div className="text-white font-bold text-xs mb-1">Clutch</div>
                <div className="text-[10px] text-gray-300">B2B COMPANIES</div>
                <div className="text-[8px] text-gray-400">2023</div>
              </div>
            </div>
          </div>

          {/* Top Android App */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="border-2 border-red-400 px-2 py-2 rounded">
                <div className="text-red-500 text-xs mb-1">▼</div>
                <div className="text-xs font-bold">TOP</div>
                <div className="text-[10px] text-gray-600">Android App</div>
                <div className="text-[10px] text-gray-600">Developers</div>
                <div className="border-t-2 border-red-400 mt-1 pt-1">
                  <div className="text-[8px] text-gray-500">2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Clutch Champion */}
          <div className="badge-card">
            <div className="text-center w-full">
              <div className="bg-linear-to-b from-amber-400 to-amber-600 text-white px-2 py-2 rounded-lg">
                <div className="text-white font-bold text-xs mb-1">Clutch</div>
                <div className="text-[10px]">CHAMPION</div>
                <div className="text-[8px] mt-1">Fall 2023</div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - 5 badges centered */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 max-w-200 mx-auto">
          {/* Clutch Global */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 aspect-square w-24 sm:w-28 md:w-32">
            <div className="text-center w-full">
              <div className="bg-teal-700 text-white px-2 py-3 rounded">
                <div className="text-white font-bold text-xs mb-1">Clutch</div>
                <div className="text-[10px]">GLOBAL</div>
                <div className="text-[8px] text-teal-200 mt-1">Fall 2023</div>
              </div>
            </div>
          </div>

          {/* Top Software */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 aspect-square w-24 sm:w-28 md:w-32">
            <div className="text-center w-full">
              <div className="border-2 border-red-400 px-2 py-2 rounded">
                <div className="text-red-500 text-xs mb-1">▼</div>
                <div className="text-xs font-bold">TOP</div>
                <div className="text-[10px] text-gray-600">Software</div>
                <div className="text-[10px] text-gray-600">Developers</div>
                <div className="border-t-2 border-red-400 mt-1 pt-1">
                  <div className="text-[8px] text-gray-500">2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Best of Clutch */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 aspect-square w-24 sm:w-28 md:w-32">
            <div className="text-center w-full">
              <div className="bg-yellow-400 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center border-4 border-yellow-500">
                <div className="text-xs font-bold">
                  <div className="text-black text-[8px] sm:text-[10px]">
                    Best of
                  </div>
                  <div className="text-black font-bold text-[10px] sm:text-xs">
                    CLUTCH
                  </div>
                  <div className="text-black text-[8px] sm:text-[10px]">
                    Websites
                  </div>
                  <div className="text-black text-[7px] sm:text-[8px]">
                    2023
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Databricks */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 aspect-square w-24 sm:w-28 md:w-32">
            <div className="text-center w-full">
              <div className="bg-slate-700 text-white px-2 py-3 rounded">
                <div className="text-teal-400 text-xs">●●</div>
                <div className="text-white font-semibold text-[10px] mb-1">
                  databricks
                </div>
                <div className="text-[9px] text-gray-300">CONSULTING</div>
                <div className="text-[9px] text-gray-300">PARTNER</div>
              </div>
            </div>
          </div>

          {/* GoodFirms */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 aspect-square w-24 sm:w-28 md:w-32">
            <div className="text-center w-full">
              <div className="border-2 border-blue-400 px-2 py-2 rounded">
                <div className="text-blue-500 text-xs mb-1">◆</div>
                <div className="text-xs font-bold text-[#281333]">
                  GoodFirms
                </div>
                <div className="bg-orange-500 text-white text-[10px] py-1 mt-1 rounded">
                  <div>RESEARCH</div>
                  <div>PARTNER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BadgesSection;
