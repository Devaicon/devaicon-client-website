"use client";

import PageHero from "../../components/PageHero";
import ContactPageLayout from "../../components/ContactPageLayout";
import FinancialBacking from "../../components/FinancialBacking";
import { Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Let's Talk Business"
        subtitle="Whether you're looking to build something new and exciting or need our help with an ongoing project, we've got you covered."
        icon={<Phone className="w-7 h-7 text-white" />}
        label="Get In Touch"
        showButton={false}
        backgroundImage="/contact-card-helper.webp"
      />

      {/* Contact Form and Info Section */}
      <ContactPageLayout />

      {/* Financial Backing Section */}
      <FinancialBacking />
    </>
  );
};

export default ContactUs;
