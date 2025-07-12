import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, shadesOfPurple } from "@clerk/themes";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "SprintTrack",
  description: "Track your sprints with ease using SprintTrack",
  icons: {
    icon: "/logo.png",
  },
};

const customAppearance = {
  baseTheme: shadesOfPurple,
  variables: {
    colorPrimary: "#6366f1", // Indigo
    colorText: "#e5e7eb", // Light gray text
    colorBackground: "#0f172a", // Slate-900
    colorInputBackground: "#1e293b", // Slate-800
    colorInputText: "#f1f5f9", // Slate-100
    colorAlphaShade: "#334155", // Slate-700
    borderRadius: "0.75rem",
    fontFamily: jakarta.style.fontFamily,
    fontSize: "14px",
  },
  elements: {
    card: "bg-slate-800 shadow-lg rounded-lg border border-slate-700 w-full max-w-md sm:max-w-lg p-6",
    headerTitle: "text-white text-2xl font-semibold tracking-tight",
    headerSubtitle: "text-slate-400 text-sm mt-2",
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg px-4 py-2 transition-all duration-200",
    footerActionText: "text-slate-400 text-sm",
    footerActionLink:
      "text-indigo-400 hover:text-indigo-300 font-medium underline transition duration-200",
    socialButtonsBlockButton:
      "bg-slate-700 hover:bg-slate-600 text-white border-none",
    formFieldInput:
      "bg-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500 rounded-md",
    formFieldLabel: "text-slate-300 text-sm mb-1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={customAppearance}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${jakarta.variable} dotted-background`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
