import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { cn } from "@mott/ui";
import { ThemeProvider, ThemeToggle } from "@mott/ui/theme";
import { Toaster } from "@mott/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://app.mott.ai"
      : "http://localhost:3000",
  ),
  title: "Mott.ai",
  description: "AI-powered platform for intelligent automation",
  openGraph: {
    title: "Mott.ai",
    description: "AI-powered platform for intelligent automation",
    url: "https://app.mott.ai",
    siteName: "Mott.ai",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
