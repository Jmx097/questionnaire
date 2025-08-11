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
      {/* Put the black bg on body so pages can be transparent */}
      <body className="bg-black text-white">
        <GlobalLightRays />
        {/* Content sits above rays */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
