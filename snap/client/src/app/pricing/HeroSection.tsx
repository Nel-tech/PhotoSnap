
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import DesktopPricingImage from '../../../public/images/pricing/desktop/hero.jpg'
import TabletPricingImage from '../../../public/images/pricing/tablet/hero.jpg'
import MobilePricingImage from '../../../public/images/pricing/mobile/hero.jpg'

function HeroSection() {
    return (
        <div>
            <section className="flex flex-col-reverse md:flex-row lg:flex-row items-center justify-between">
                {/* Left Content Section */}
                <Card className="max-w-lg rounded-none relative text-left px-[1rem] pt-[1rem] bg-black h-[83vh] lg:text-left flex flex-col justify-center lg:px-[4rem] lg:pt-[6rem]">
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
  md:top-[6rem]
  md:bg-gradient-to-b

  lg:h-[15rem] 
  lg:w-[0.3rem] 
  lg:rotate-180 
  lg:top-[9rem]
  lg:bg-gradient-to-b
"></div>
                    <h1 className="text-3xl font-bold leading-relaxed tracking-wider uppercase text-white max-w-[18rem] lg:text-5xl">
                        Pricing
                    </h1>
                    <p className="text-gray-500 text-base">
                        Create a your stories, Photosnap is a platform for photographers and visual storytellers. It’s the simple way to create and share your photos.
                    </p>
                </Card>

                {/* Right Image Section */}
                <div className="relative w-full h-[83vh]">
                    <Image
                        src={DesktopPricingImage}
                        alt="Features"
                        className="shadow-lg hidden lg:block object-cover w-full h-full"
                        priority
                        width={990}
                        height={800} // Ensures image height matches card
                    />
                    <Image
                        src={TabletPricingImage}
                        alt="Features"
                        className=" shadow-lg hidden md:block lg:hidden object-cover w-full h-full"
                        priority
                    />
                    <Image
                        src={MobilePricingImage}
                        alt="Features"
                        className="shadow-lg md:hidden object-cover w-full h-full"
                        priority
                    />
                </div>
            </section>
        </div>
    )
}

export default HeroSection
