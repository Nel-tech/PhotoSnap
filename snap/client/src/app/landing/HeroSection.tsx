import Image from "next/image";

import HeroImageDesktop from "../../../public/images/home/desktop/create-and-share.jpg";
import HeroImageMobile from "../../../public/images/home/mobile/create-and-share.jpg";
import HeroImageTablet from "../../../public/images/home/tablet/create-and-share.jpg";
import { Card } from "@/components/ui/card";


function HeroSection() {
  return (
    <section className="flex flex-col-reverse items-center justify-between sm:flex-col md:flex-row lg:flex-row">

      {/* Left Content Section */}
      <Card className="max-w-lg rounded-none relative text-center px-[3rem] pt-[5rem] lg:pt-[9rem] bg-black min-h-[400px] md:min-h-[600px] lg:min-h-[600px] md:px-[1rem] lg:text-left">



        <div className="
  absolute 
  top-[-0.1rem] 
  left-[-0.1rem] 
  h-[0.2rem] 
  w-full 
  rotate-360 
  bg-gradient-to-r 
  from-orange-300 
  via-pink-500 
  to-blue-500 
  transform
 
  md:h-[15rem] 
  md:w-[0.3rem] 
  md:rotate-180 
  md:top-[8rem]
  md:bg-gradient-to-b

  lg:h-[15rem] 
  lg:w-[0.3rem] 
  lg:rotate-180 
  lg:top-[12rem]
  lg:bg-gradient-to-b
"></div>

        <h1 className="text-3xl font-medium leading-relaxed tracking-wider text-white max-w-[18rem] text-left md:text-left md:pt-[3rem]">
          CREATE AND SHARE YOUR PHOTO STORIES.
        </h1>
        <p className="text-gray-500 tracking-wider leading-relaxed text-sm text-left md:text-left lg:text-base">
          Photosnap is a platform for photographers and visual storytellers. We
          make it easy to share photos, tell stories, and connect with others.
        </p>


      </Card>

      {/* Right Image Section */}
      <div className="relative w-full ">
        <Image
          src={HeroImageDesktop}
          alt="Create and Share"
          className=" shadow-lg hidden lg:block lg:h-[600px] lg:object-cover md:hidden"
          priority
        />
        <Image
          src={HeroImageTablet}
          alt="Create and Share"
          className="hidden md:block md:h-[600px] lg:hidden"
          priority
        />
        <Image
          src={HeroImageMobile}
          alt="Create and Share"
          className="shadow-lg md:hidden w-full"
          priority
        />
      </div>
    </section>
  );
}

export default HeroSection;
