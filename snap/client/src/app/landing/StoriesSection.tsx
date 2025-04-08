'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StoriesImage from "../../../public/images/home/desktop/beautiful-stories.jpg"
import DesignImage from "../../../public/images/home/desktop/designed-for-everyone.jpg"
function StoriesSection() {
    return (
        <section>
            <div className="flex flex-col lg:flex-row items-center justify-between  ">
                <div className="">
                    <Image src={StoriesImage} alt="Stories" width={2500} />
                </div>

                <div className="px-[5rem]">
                    <h1 className="text-5xl font-semibold tracking-wider max-w-[20rem] leading-snug uppercase">Beautiful stories every time</h1>
                    <p className="text-gray-500 leading-relaxed pt-[.3rem]">
                        We provide design templates to ensure your stories look terrific. Easily add photos, text, embed maps and media from other networks. Then share your story with everyone.
                    </p>
                    <Button className="mt-[2rem] cursor-pointer hover:underline">VIEW THE STORIES <span aria-hidden="true">&rarr;</span></Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between">

                <div className="px-[5rem]">
                    <h1 className="text-5xl font-semibold tracking-wider max-w-[30rem] leading-snug uppercase">Designed for everyone</h1>
                    <p className="text-gray-500 leading-relaxed pt-[.3rem]">
                        Photosnap can help you create stories that resonate with your audience. Our tool is designed for photographers of all levels, brands, businesses you name it.
                    </p>
                    <Button className="mt-[2rem] cursor-pointer hover:underline">VIEW THE STORIES <span aria-hidden="true">&rarr;</span></Button>
                </div>

                <div className="">
                    <Image src={DesignImage} alt="Stories" width={2500} />
                </div>


            </div>


        </section>
    );
}

export default StoriesSection;
