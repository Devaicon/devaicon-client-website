"use client";

import Image from "next/image";
import ContactPageLayout from "../../components/ContactPageLayout";
import FinancialBacking from "../../components/FinancialBacking";

const ContactUs = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-75 sm:h-88 md:h-100 lg:h-112 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/contactus-bgimg.png"
          alt="Contact Us Background"
          fill
          priority
          className="object-cover brightness-[1.05] contrast-[1.15] saturate-[1.1]"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, rgba(61, 35, 75, 0.9) 0%, rgba(40, 19, 51, 0.9) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Let&apos;s Talk Business
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl">
            Whether you&apos;re looking to build something new and exciting or
            need our help with an ongoing project, we&apos;ve got you covered.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <ContactPageLayout />

      {/* Financial Backing Section */}
      <FinancialBacking />
    </>
  );
};

export default ContactUs;
