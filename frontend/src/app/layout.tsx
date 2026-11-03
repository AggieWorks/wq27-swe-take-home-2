import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import LoginModal from "@/components/popups/login-modal";
import Providers from "@/components/providers/providers";
import { Toaster } from "@/components/ui/toaster";

const spartan = localFont({
  variable: "--font-spartan",
  src: [
    {
      path: "../assets/fonts/Spartan-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Spartan-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Dibs - Local Deals & Discounts in Davis, CA",
  description:
    "Dibs is the ultimate platform for Davis locals to discover and share local deals on food, drinks, and more. Stay updated on the best discounts from nearby restaurants, cafes, and stores in real time!",
  keywords: [
    "UC Davis deals",
    "local discounts",
    "student discounts",
    "Davis food deals",
    "college discounts",
    "Davis restaurants",
    "Davis cafes",
    "cheap eats UC Davis",
    "Davis happy hour",
  ],
  openGraph: {
    title: "Dibs - Local Deals & Discounts in Davis, CA",
    description:
      "Find and share the best deals in Davis! Stay connected with real-time discounts on food, drinks, and more.",
    url: "https://dibs.deals",
    siteName: "Dibs",
    images: [
      {
        url: "https://dibs.deals/logo.svg",
        width: 1200,
        height: 630,
        alt: "Dibs - UC Davis Local Deals & Discounts",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spartan.variable} antialiased ${spartan.className} bg-white`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster />
          <LoginModal />
        </Providers>
      </body>
    </html>
  );
}
