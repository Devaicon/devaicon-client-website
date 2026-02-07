const CallNowTab = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Call Now
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Get instant support from our team of experts.
        </p>
      </div>
      <p className="text-gray-600 text-xs sm:text-sm md:text-base">
        Speak directly with our expert team and get immediate answers to your
        questions.
      </p>
      <div>
        <a
          href="tel:03336224007"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand hover:text-[#3d234b] transition-colors break-all"
        >
          03336224007
        </a>
      </div>
      <button className="btn btn-primary rounded-md group text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-3">
        Call Now
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
      <div className="border-l-4 border-[#281333] pl-4 py-2">
        <h3 className="font-bold text-gray-900 mb-2">Available:</h3>
        <p className="text-gray-700">Monday - Friday</p>
        <p className="text-gray-700">6:00 AM - 3:00 PM PT</p>
      </div>
    </div>
  );
};

export default CallNowTab;
