import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Onboarding Questionnaire",
  description: "Personalized automation plan & free community access",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
