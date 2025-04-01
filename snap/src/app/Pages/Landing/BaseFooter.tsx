'use client'
import Image from "next/image";
import Responsive from '@/images/features/desktop/responsive.svg'
import NoLimit from '@/images/features/desktop/no-limit.svg'
import Embed from '@/images/features/desktop/embed.svg'

function BaseFooter() {
    return (
        <div className="mt-[13rem] flex flex-col self-center items-center px-6 md:px-12 lg:px-20">
            <div className="grid gap-12 md:grid-cols-3 md:gap-8 w-full max-w-6xl text-center">

                {/* Responsive Section */}
                <section className="flex flex-col items-center">
                    <Image
                        src={Responsive}
                        alt="Responsive Design"
                        width={100}
                       
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold pb-[.9rem]">100% Responsive</h1>
                    <p className="text-gray-500 max-w-xs text-base">
                        No matter which device you’re on, our site is fully responsive
                        and stories look beautiful on any screen.
                    </p>
                </section>

                {/* No Limit Section */}
                <section className="flex flex-col items-center mt-[2.8rem]">
                    <Image
                        src={NoLimit}
                        alt="No Upload Limit"
                        width={100}
                        
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold pb-[.9rem]">No Photo Upload Limit</h1>
                    <p className="text-gray-500 max-w-xs text-base">
                        Our tool has no limits on uploads or bandwidth. Freely upload in
                        bulk and share all of your stories in one go.
                    </p>
                </section>

                {/* Embed Section */}
                <section className="flex flex-col items-center">
                    <Image
                        src={Embed}
                        alt="Embed Media"
                        width={100}
                        
                        className="mb-4"
                    />
                    <h1 className="text-xl font-bold pb-[.9rem]">Available to Embed</h1>
                    <p className="text-gray-500 max-w-xs text-base">
                        Embed Tweets, Facebook posts, Instagram media, Vimeo or YouTube
                        videos, Google Maps, and more.
                    </p>
                </section>

            </div>
        </div>
    );
}

export default BaseFooter;
