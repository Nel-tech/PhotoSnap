import React from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import DesktopFeatureImage from '../../../public/images/features/desktop/hero.jpg'
import TabletFeatureImage from '../../../public/images/features/tablet/hero.jpg'
import MobileFeatureImage from '../../../public/images/features/mobile/hero.jpg'

function HeroSection() {
    return (
        <div>
            <section className="flex  flex-col-reverse md:flex-row lg:flex-row items-center justify-between">
                {/* Left Content Section */}
                <Card className="max-w-lg rounded-none relative  px-[3rem] pt-[5rem] lg:pt-[9rem] bg-black min-h-[400px] md:min-h-[600px] lg:min-h-[600px] md:px-[1rem] lg:text-left">

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
  md:top-[7rem]
  md:bg-gradient-to-b

  lg:h-[15rem] 
  lg:w-[0.3rem] 
  lg:rotate-180 
  lg:top-[9rem]
  lg:bg-gradient-to-b
"></div>

                    <h1 className="text-3xl font-bold leading-relaxed tracking-wider uppercase text-white max-w-[18rem] lg:text-5xl">
                        Features
                    </h1>
                    <p className="text-gray-500 text-base">
                        We make sure all of our features are designed to be loved by every aspiring and even professional photographers who wanted to share their stories.
                    </p>
                </Card>

                {/* Right Image Section */}
                <div className="relative w-full ">
                    <Image
                        src={DesktopFeatureImage}
                        alt="Features"
                        className=" shadow-lg hidden lg:block lg:h-[600px] lg:object-cover md:hidden"
                        priority
                        width={990}
                        height={800} 
                    />
                    <Image
                        src={TabletFeatureImage}
                        alt="Features"
                        className="hidden md:block md:h-[600px] lg:hidden"
                        priority
                    />
                    <Image
                        src={MobileFeatureImage}
                        alt="Features"
                        className=" shadow-lg md:hidden w-full"
                        priority
                    />
                </div>
            </section>
        </div>
    )
}

export default HeroSection
