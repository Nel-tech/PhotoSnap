import Nav from "@/components/Nav";
import HeroSection from "@/app/landing/HeroSection";
import StoriesSection from "@/app/landing/StoriesSection";
import Stories from "@/app/landing/Stories";
import BaseFooter from "@/app/landing/BaseFooter";
//import Footer from "@/components/Footer";
import Head from "next/head";
export default function Home() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="mr6DpKGyOAKnB0eQH0DQByStxObAfiiRoG9BWEtTkAs" />
        <title>PhotoSnap</title>
        <meta name="description" content="PhotoSnap – Capture and share your best moments." />
      </Head>
      <Nav />
      <HeroSection />
      <StoriesSection />
      <Stories />
      <BaseFooter />
    </div>
  );
}
