"use client";

import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Add your newsletter subscription logic here
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="divider-smoky"></div>
      <div className="container-responsive py-8 sm:py-8 md:py-6 lg:py-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          {/* Left side - Text content */}
          <div className="flex-1 w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Newsletter
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Join us to stay connected with the global trends and technologies
            </p>
          </div>

          {/* Right side - Email form */}
          <div className="flex-1 w-full md:w-auto">
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn-submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
