import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerContactCard from "@/components/PartnerContactCard";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <PartnerContactCard />
      <Footer />
    </>
  );
}
