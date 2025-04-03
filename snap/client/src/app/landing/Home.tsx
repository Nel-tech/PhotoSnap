import Nav from "@/components/Nav";
import HeroSection from "@/app/landing/HeroSection";
import StoriesSection from "@/app/landing/StoriesSection";
import Stories from "@/app/landing/Stories";
import BaseFooter from "@/app/landing/BaseFooter";
//import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div>
      <Nav />
      <HeroSection />
      <StoriesSection />
      <Stories />
      <BaseFooter />
    </div>
  );
}
