import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroImageDesktop from "@/images/home/desktop/create-and-share.jpg";
import HeroImageMobile from "@/images/home/mobile/create-and-share.jpg";
import HeroImageTablet from "@/images/home/tablet/create-and-share.jpg";
import { Card } from "../../../components/ui/card";


function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between ">
      {/* Left Content Section */}
      <Card className="max-w-lg rounded-none relative text-center  px-[3rem] pt-[9rem] bg-black h-[108.6vh] lg:text-left ">
        
        <div className='absolute top-[8rem] left-0 h-[18rem] w-[0.3rem] bg-gradient-to-b from-orange-300 via-pink-500 to-blue-500 transform rotate-180'></div>
        <h1 className="text-3xl font-bold leading-relaxed tracking-wider text-white max-w-[18rem]">
          CREATE AND SHARE YOUR PHOTO STORIES.
        </h1>
        <p className="text-gray-500 text-base ">
          Photosnap is a platform for photographers and visual storytellers. We
          make it easy to share photos, tell stories, and connect with others.
        </p>

       
      </Card>

      {/* Right Image Section */}
      <div className="relative w-full ">
        <Image
          src={HeroImageDesktop}
          alt="Create and Share"
          className=" shadow-lg hidden lg:block"
          priority
        />
        <Image
          src={HeroImageTablet}
          alt="Create and Share"
          className="rounded-lg shadow-lg hidden md:block lg:hidden"
          priority
        />
        <Image
          src={HeroImageMobile}
          alt="Create and Share"
          className="rounded-lg shadow-lg md:hidden"
          priority
        />
      </div>
    </section>
  );
}

export default HeroSection;
