import PageHero from "@/components/PageHero";
import ContactPageLayout from "@/components/ContactPageLayout";
import FinancialBacking from "@/components/FinancialBacking";
import { Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description:
    "Talk to Devaicon about a new build or an ongoing project. Reach our Sharjah team by phone or email and we'll get back to you quickly.",
  alternates: {
    canonical: "/contact-us",
  },
};

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
