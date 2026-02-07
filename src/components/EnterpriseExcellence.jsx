import { CircleCheck } from "lucide-react";

const EnterpriseExcellence = () => {
  return (
    <section className="w-full min-h-128 sm:min-h-150 md:min-h-170 lg:h-186 bg-brand-primary flex flex-col items-center justify-center rounded-none sm:rounded-lg lg:rounded-xl py-8 sm:py-12 md:py-16 lg:py-0 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-7xl box-border flex flex-col items-start justify-center gap-3 sm:gap-4 lg:gap-5">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold text-white leading-[1.1] sm:leading-[1.05] lg:leading-[0.95]">
          Microsoft-Aligned Enterprise Excellence
        </h2>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-normal text-white/90 mt-2 sm:mt-3 lg:mt-5">
          As a trusted Microsoft partner, we deliver world-class solutions that
          drive digital transformation and business growth across the GCC
          region.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-2.5 mt-4 sm:mt-5 lg:mt-5 w-full">
          <div className="flex items-start gap-3 sm:gap-4">
            <CircleCheck className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white m-0">
                Proven Track Record
              </h3>
              <p className="text-base sm:text-lg lg:text-2xl font-normal text-white/80 m-0">
                Delivering enterprise success
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <CircleCheck className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white m-0">
                Regional Expertise
              </h3>
              <p className="text-base sm:text-lg lg:text-2xl font-normal text-white/80 m-0">
                Deep UAE & GCC knowledge
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <CircleCheck className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white m-0">
                24/7 Support
              </h3>
              <p className="text-base sm:text-lg lg:text-2xl font-normal text-white/80 m-0">
                Always here when you need us
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseExcellence;
