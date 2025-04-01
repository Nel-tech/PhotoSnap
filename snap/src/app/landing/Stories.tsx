'use client'
import { stories } from "@/app/_Mock_/Helper"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

function Stories() {
    return (
        <section className="flex">
            {stories.slice(0, 4).map((story) => (
                <div key={story.id} className="relative overflow-hidden">

                    {/* Image Container */}
                    <div className="relative cursor-pointer hover:scale-105 transition-all duration-300" >
                        <Image
                            src={story.image || ''}
                            alt={story.title}
                            className="w-full h-auto object-cover "
                            width={500}
                            height={300}
                        />

                        {/* Transparent Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

                        {/* Text Content */}
                        <div className="absolute bottom-8 left-8 text-white z-10">
                            <h3 className="font-extrabold text-lg tracking-wider pb-2">{story.title}</h3>
                            <p className="text-sm tracking-wider pb-2">{story.author}</p>
                            <Separator className="bg-white opacity-30" />

                            <Link href='/' className="text-sm tracking-wider pt-2 inline-block">
                                READ STORY <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                </div>
            ))}
        </section>
    )
}

export default Stories
