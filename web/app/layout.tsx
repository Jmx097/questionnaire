import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import GlobalLightRays from '@/components/backgrounds/GlobalLightRays';

export const metadata: Metadata = {
  title: "AI Onboarding Questionnaire",
  description: "Personalized automation plan & free community access",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <GlobalLightRays speedMs={32000} intensity={0.06} />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
