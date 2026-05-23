import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pearls UniGlobal Consultants | Premium Study Abroad Consultancy",
    template: "%s | Pearls UniGlobal",
  },
  description:
    "Pakistan's premier UK-focused study abroad consultancy. Expert visa guidance, university placement, IELTS preparation, and end-to-end support for your international education journey.",
  keywords: [
    "study abroad",
    "UK university",
    "student visa",
    "IELTS preparation",
    "Pakistan consultancy",
    "study in UK",
    "visa consultancy",
    "Pearls UniGlobal",
    "education consultancy",
    "scholarship guidance",
  ],
  authors: [{ name: "Pearls UniGlobal Consultants" }],
  creator: "Pearls UniGlobal Consultants",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://pearlsuniglobal.com",
    siteName: "Pearls UniGlobal Consultants",
    title: "Pearls UniGlobal Consultants | Premium Study Abroad Consultancy",
    description:
      "Pakistan's premier UK-focused study abroad consultancy. Expert visa guidance, university placement, and comprehensive student support.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pearls UniGlobal Consultants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pearls UniGlobal Consultants",
    description: "Premium UK-focused study abroad consultancy from Pakistan",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <TooltipProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "12px",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
