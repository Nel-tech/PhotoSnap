import Nav from "../../Components/Nav";
import HeroSection from "../../Components/HeroSection";
import Stories from "../../Components/stories";
import Stories2 from "../../Components/Stories2";
import FeaturedDesktop from "../../Components/FeaturedDesktop";
import Flex from "../../Components/Flex"
import Footer from "../../Components/Footer";
function home() {
  return (
    <div>
      <div>
        <Nav />
      </div>

      <div>
        <HeroSection />
      </div>

      <div>
        <Stories />
      </div>

      <div>
        <Stories2 />
      </div>

      <div>
        <FeaturedDesktop />
      </div>

      <div>
        <Flex/>
      </div>

      <div>
        <Footer/>
      </div>
    </div>
  );
}

export default home;
