'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StoriesImage from "../../../public/images/home/desktop/beautiful-stories.jpg"
import DesignImage from "../../../public/images/home/desktop/designed-for-everyone.jpg"
import TabletStoriesImage from '../../../public/images/home/tablet/beautiful-stories.jpg'
import TabletDesignImage from '../../../public/images/home/tablet/designed-for-everyone.jpg'
import MobileStoriesImage from '../../../public/images/home/mobile/beautiful-stories.jpg'
import MobileDesignImage from '../../../public/images/home/mobile/designed-for-everyone.jpg'
function StoriesSection() {
    return (
        <section>
            <div className="flex pb-[2rem] flex-col lg:flex-row items-center lg:pb-0 justify-between md:flex-row  ">
                <div className="">
                    
                        {/* Mobile */}
                        <Image
                            src={MobileStoriesImage}
                            alt="Stories"
                            className="block md:hidden "
                            priority
                            width={2000}
                        />

                        {/* Tablet */}
                        <Image
                            src={TabletStoriesImage}
                            alt="Stories"
                            className="hidden md:block lg:hidden w-[200rem]" 
                            priority
                            sizes="(min-width: 768px) and (max-width: 1023px) 800px"
                        />

                        {/* Desktop */}
                        <Image
                            src={StoriesImage}
                            alt="Stories"
                            className="hidden lg:block w-[2500px]"
                            priority
                            sizes="(min-width: 1024px) 2500px"
                        />
                    </div>


                

                <div className="px-[3rem]  lg:px-[5rem]">
                    <h1 className="text-3xl mt-[3rem] font-medium tracking-wider max-w-[30rem] leading-snug uppercase lg:mt-[0rem] lg:max-w-[20rem] lg:text-5xl lg:font-semibold  ">Beautiful stories every time</h1>
                    <p className="text-gray-500 leading-relaxed pt-[.3rem]">
                        We provide design templates to ensure your stories look terrific. Easily add photos, text, embed maps and media from other networks. Then share your story with everyone.
                    </p>
               
                </div>
            </div>

            <div className="pb-[2rem] flex flex-col-reverse lg:flex-row lg:pb-0 items-center justify-between  md:flex-row">

                <div className=" px-[3rem] lg:px-[5rem]">
                    <h1 className="text-3xl mt-[3rem] font-medium tracking-wider max-w-[30rem] leading-snug uppercase lg:mt-[0rem] lg:max-w-[20rem] lg:text-5xl lg:font-semibold  ">Designed for everyone</h1>
                    <p className="text-gray-500 leading-relaxed pt-[.3rem]">
                        Photosnap can help you create stories that resonate with your audience. Our tool is designed for photographers of all levels, brands, businesses you name it.
                    </p>
                </div>

                <div className="">
                    {/* Mobile only */}
                    <Image
                        src={MobileDesignImage}
                        alt="Stories"
                        className="block md:hidden "
                        width={2000}
                        priority
                    />

                    {/* Tablet (md only) */}
                    <Image
                        src={TabletDesignImage}
                        alt="Stories"
                        className="hidden md:block lg:hidden w-[200rem]"
                        sizes="(min-width: 768px) and (max-width: 1023px) 800px"
                        priority
                    />

                    {/* Desktop and up */}
                    <Image
                        src={DesignImage}
                        alt="Stories"
                        className="hidden lg:block w-[2500px]"
                        sizes="(min-width: 1024px) 2500px"
                        priority
                    />
                </div>



            </div>


        </section>
    );
}

export default StoriesSection;
