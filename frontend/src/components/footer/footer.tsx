import { Instagram } from "lucide-react";
import Link from "next/link";

import LogoWithText from "@/components/branding/logo-with-text";

export default function Footer() {
  return (
    <footer className="h-full w-full bg-footer-bg px-8 pb-16 pt-10 md:px-12 lg:px-20">
      <div className="flex flex-col gap-8 whitespace-nowrap md:flex-row md:items-start md:justify-between">
        {/* Left Section - DIBS */}
        <div className="flex flex-col gap-4 sm:justify-center">
          <LogoWithText alt />
          <div className="flex items-center gap-1 text-[0.75rem] text-black">
            <span>Made with</span> <span className="text-red-500">❤️</span> by
            <span className="font-bold">AggieWorks</span>
          </div>
        </div>

        {/* Right-Aligned Sections */}
        <div className="grid grid-cols-2 gap-4 xs:grid-cols-3 sm:gap-16">
          {/* Help */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-t-dark">Help</h3>
            <Link
              href="https://docs.google.com/forms/d/1jtBG37XItoIlTqs1DAXIdErZ6a1GiykIrWbKNa7J1ik/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-[0.75rem] text-black transition-colors hover:text-secondary hover:underline"
            >
              Feedback Form
            </Link>
          </div>

          {/* Learn More */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-t-dark">Learn More</h3>
            <Link
              href="privacy-policy.html"
              className="text-small text-[0.75rem] text-black transition-colors hover:text-secondary hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://aggieworks.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-[0.75rem] text-black transition-colors hover:text-secondary hover:underline"
            >
              AggieWorks
            </Link>
          </div>

          {/* Stay Connected */}
          <div className="mt-4 flex flex-col gap-4 xs:mt-0">
            <h3 className="text-sm font-bold text-t-dark">Stay Connected</h3>
            <Link
              href="https://www.instagram.com/dibs.ucd/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] text-t-dark transition-colors hover:text-t-dark/80"
            >
              <Instagram
                size={24}
                className="text-primary transition-colors hover:text-secondary"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
