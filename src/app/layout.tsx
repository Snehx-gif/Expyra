import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

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
        className={`antialiased bg-background text-foreground font-sans`}
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
