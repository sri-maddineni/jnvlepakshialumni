import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import TricolorBar from "@/components/TricolorBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AAJNVL",
  description: "Alumni Association of Jawahar Navodaya Vidyalaya, Lepakshi",
  openGraph: {
    title: "AAJNVL - Alumni Association of JNV Lepakshi",
    description: "Connecting alumni across generations from JNV Lepakshi.",
    url: "https://aajnvl.netlify.app",
    siteName: "AAJNVL",
    images: [
      {
        url: "https://aajnvl.netlify.app/images/logos/logo png.png", // 👈 your logo or preview image URL
        width: 1200,
        height: 630,
        alt: "AAJNVL Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAJNVL",
    description: "Alumni Association of Jawahar Navodaya Vidyalaya, Lepakshi",
    images: ["https://aajnvl.netlify.app/images/logos/logo png.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}>
        <AuthProvider>
          <TricolorBar />
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
