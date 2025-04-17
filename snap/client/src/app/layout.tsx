import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";
import Providers from "@/app/providers";

// Load font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PhotoSnap - Capture Your Moments",
  description: "A photography storytelling platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <Providers>
          {children}
          <Footer />
          <Toaster position="top-right" reverseOrder={false} />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
