import React from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import DesktopFeatureImage from '@/images/features/desktop/hero.jpg'
import TabletFeatureImage from '@/images/features/tablet/hero.jpg'
import MobileFeatureImage from '@/images/features/mobile/hero.jpg'

function HeroSection() {
    return (
        <div>
            <section className="flex flex-col lg:flex-row items-center justify-between">
                {/* Left Content Section */}
                <Card className="max-w-lg rounded-none relative text-center px-[4rem] pt-[6rem] bg-black h-[83vh] lg:text-left flex flex-col justify-center">
                    <div className="absolute top-[8rem] left-0 h-[18rem] w-[0.3rem] bg-gradient-to-b from-orange-300 via-pink-500 to-blue-500 transform rotate-180"></div>
                    <h1 className="text-5xl leading-relaxed tracking-wider uppercase text-white max-w-[18rem]">
                        Features
                    </h1>
                    <p className="text-gray-500 text-base">
                        We make sure all of our features are designed to be loved by every aspiring and even professional photographers who wanted to share their stories.
                    </p>
                </Card>

                {/* Right Image Section */}
                <div className="relative w-full h-[83vh]">
                    <Image
                        src={DesktopFeatureImage}
                        alt="Features"
                        className="shadow-lg hidden lg:block object-cover w-full h-full"
                        priority
                        width={990}
                        height={800} // Ensures image height matches card
                    />
                    <Image
                        src={TabletFeatureImage}
                        alt="Features"
                        className="rounded-lg shadow-lg hidden md:block lg:hidden object-cover w-full h-full"
                        priority
                    />
                    <Image
                        src={MobileFeatureImage}
                        alt="Features"
                        className="rounded-lg shadow-lg md:hidden object-cover w-full h-full"
                        priority
                    />
                </div>
            </section>
        </div>
    )
}

export default HeroSection
