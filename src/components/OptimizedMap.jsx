"use client";

import { useState, useEffect, useRef } from "react";

const OptimizedMap = ({
  src = "https://maps.google.com/maps?q=Business+Center,+Sharjah+Publishing+City+Free+Zone,+Sharjah&output=embed",
  title = "Office Location Map",
  height = "400px",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // Intersection Observer to load map only when it's near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before map enters viewport
        threshold: 0.01,
      },
    );

    const currentRef = mapRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [shouldLoad]);

  return (
    <div
      ref={mapRef}
      className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
      style={{ height }}
    >
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map iframe - only render when should load */}
      {shouldLoad && (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default OptimizedMap;
