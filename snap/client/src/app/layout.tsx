import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
 import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";
import Providers from "@/app/providers";
import { Analytics } from "@vercel/analytics/next"


// Load Poppins with a CSS variable
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "PhotoSnap - Capture Your Moments",
  description: "A photography storytelling platform.",
  verification: {
    google: "mr6DpKGyOAKnB0eQH0DQByStxObAfiiRoG9BWEtTkAs", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        
        <AuthProvider>
          <Providers>
            {children}
            <Footer /> 
            <Toaster position="top-right" reverseOrder={false} />
            <Analytics />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
