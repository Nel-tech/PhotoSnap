import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
//  import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/providers";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";
import OneSignalWrapper from "@/components/OneSignalWrapper";


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
    google: process.env.NEXT_PUBLIC_GOOGLE_TOKEN, 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <html lang="en" className={poppins.variable}>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></Script>
      <body className="antialiased">
        
          <Providers>
        <OneSignalWrapper>
            {children}
            {/* <Footer />  */}
            <Toaster position="top-right" reverseOrder={false} />
            <Analytics />
        </OneSignalWrapper>
          </Providers>
       
      </body>
    </html>
  );
}
