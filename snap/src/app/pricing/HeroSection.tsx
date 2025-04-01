
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import DesktopPricingImage from '@/images/pricing/desktop/hero.jpg'
import TabletPricingImage from '@/images/pricing/tablet/hero.jpg'
import MobilePricingImage from '@/images/pricing/mobile/hero.jpg'

function HeroSection() {
    return (
        <div>
            <section className="flex flex-col lg:flex-row items-center justify-between">
                {/* Left Content Section */}
                <Card className="max-w-lg rounded-none relative text-center px-[4rem] pt-[6rem] bg-black h-[83vh] lg:text-left flex flex-col justify-center">
                    <div className="absolute top-[8rem] left-0 h-[18rem] w-[0.3rem] bg-gradient-to-b from-orange-300 via-pink-500 to-blue-500 transform rotate-180"></div>
                    <h1 className="text-5xl leading-relaxed tracking-wider uppercase text-white max-w-[18rem]">
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
                        className="rounded-lg shadow-lg hidden md:block lg:hidden object-cover w-full h-full"
                        priority
                    />
                    <Image
                        src={MobilePricingImage}
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
