import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerContactCard from "@/components/PartnerContactCard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://withdevaicon.cloud"),
  title: {
    default: "Devaicon - Value Driven Innovation Through Automation & AI",
    template: "%s | Devaicon",
  },
  description:
    "Transform your business with Devaicon's cutting-edge solutions in AI, automation, cloud services, and business applications. Trusted by industry leaders for 18+ years with 550+ successful projects.",
  keywords: [
    "AI solutions",
    "business automation",
    "cloud services",
    "Microsoft Dynamics 365",
    "Azure cloud migration",
    "machine learning",
    "data analytics",
    "digital transformation",
    "enterprise software",
    "business applications",
  ],
  authors: [{ name: "Devaicon" }],
  creator: "Devaicon",
  publisher: "Devaicon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://withdevaicon.cloud",
    siteName: "Devaicon",
    title: "Devaicon - Value Driven Innovation Through Automation & AI",
    description:
      "Transform your business with AI, automation, and cloud solutions. 18+ years of expertise, 550+ projects, trusted by global industry leaders.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Devaicon - Innovation Through Automation & AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devaicon - Value Driven Innovation Through Automation & AI",
    description:
      "Transform your business with AI, automation, and cloud solutions. 18+ years of expertise, 550+ projects.",
    images: ["/twitter-image.jpg"],
    creator: "@devaicon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        {children}
        <PartnerContactCard />
        <Footer />
      </body>
    </html>
  );
}
