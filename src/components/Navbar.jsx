"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DesktopNav } from "./navigation/desktop/DesktopNav";
import { MobileNav } from "./navigation/mobile/MobileNav";
import { MobileMenuButton } from "./navigation/mobile/MobileMenuButton";
import { useMobileMenu, useEscapeKey } from "@/hooks/navigation";
import { ROUTES } from "@/constants/navigation";

export default function Navbar() {
  const mobileMenu = useMobileMenu();
  const [hasActiveDropdown, setHasActiveDropdown] = useState(false);

  // Escape key closes mobile menu
  useEscapeKey(mobileMenu.close, mobileMenu.isOpen);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-center">
        <nav
          className={`bg-white border-2 border-gray-200 mx-auto w-full xl:w-[calc(100%-25rem)] h-20 lg:h-24 px-4 sm:px-8 lg:px-6 xl:px-15 py-4 lg:py-8 rounded-none transition-all duration-200 ${
            hasActiveDropdown ? "border-b-0" : "lg:rounded-b-3xl"
          }`}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href={ROUTES.HOME}
              className="flex items-center shrink-0"
              aria-label="Devaicon - Go to homepage"
            >
              <Image
                src="/logo.svg"
                alt="Devaicon Logo"
                width={200}
                height={100}
                priority
                className="object-contain w-28 sm:w-32 lg:w-36 xl:w-40 h-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav onDropdownStateChange={setHasActiveDropdown} />

            {/* Mobile Menu Button */}
            <MobileMenuButton
              onClick={mobileMenu.open}
              isOpen={mobileMenu.isOpen}
            />
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileNav isOpen={mobileMenu.isOpen} onClose={mobileMenu.close} />
    </>
  );
}
