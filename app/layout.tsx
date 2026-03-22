import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { AIAssistant } from "@/components/ai-assistant";

export const metadata: Metadata = {
  title: "LMS Portal",
  description: "Learning Management System built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        <AIAssistant />
      </body>
    </html>
  );
}
