import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expyra - Smart Food Expiry Tracking & Alert System",
  description: "AI-powered food expiry tracking system with computer vision and real-time alerts",
  keywords: ["Expyra", "Food Expiry", "AI", "Computer Vision", "Inventory Management", "Alert System"],
  authors: [{ name: "Expyra Team" }],
  openGraph: {
    title: "Expyra - Smart Food Expiry Tracking",
    description: "AI-powered food expiry tracking system with computer vision and real-time alerts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expyra - Smart Food Expiry Tracking",
    description: "AI-powered food expiry tracking system with computer vision and real-time alerts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
