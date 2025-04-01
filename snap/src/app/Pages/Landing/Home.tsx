import Nav from "@/components/Nav";
import HeroSection from "@/app/Pages/Landing/HeroSection";
import StoriesSection from "@/app/Pages/Landing/StoriesSection";
import Stories from "@/app/Pages/Landing/Stories";
import BaseFooter from "./BaseFooter";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div>
      <Nav />
      <HeroSection />
      <StoriesSection/>
      <Stories />
      <BaseFooter />
      <Footer />
    </div>
  );
}
