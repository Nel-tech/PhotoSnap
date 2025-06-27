import { Suspense } from 'react';
import Nav from "@/components/Nav";
import HeroSection from "@/app/landing/HeroSection";
import StoriesSection from "@/app/landing/StoriesSection";
import Stories from "@/app/landing/Stories";
import BaseFooter from "@/app/landing/BaseFooter";
import Footer from "@/components/Footer";

function HomeContent() {
  return (
    <div>
      <Nav />
      <HeroSection />
      <StoriesSection />
      <Stories />
      <BaseFooter />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}