'use client'
//import { stories } from "@/app/_Mock_/Helper"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from 'react'
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

interface Story {
    _id: string;
    title: string;
    image: string;
    author: string;
}


function Stories() {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const router = useRouter();


    const user = useAuthStore((state) => state.user);

    const { data: stories, isLoading, error } = useQuery({
        queryKey: ['public-stories'],
        queryFn: () => axios.get(`${API_URL}api/v1/stories/public-stories`).then(res => res.data.data)
    })

    const [showStories, setShowStories] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowStories(true)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isLoading])


    if (isLoading || !showStories) return <div className="text-center  pt-[6rem] text-2xl font-semibold animate-pulse">Fetching latest stories...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!stories || stories.length === 0) return <div>No stories found</div>


    return (
        <section className="flex flex-wrap lg:flex-nowrap">
            {stories.slice(0, 4).map((story:Story) => (
                <div
                    key={story._id}
                    className="w-full md:w-1/2"
                >
                    <div className="cursor-pointer transform transition duration-500 ease-in-out  relative w-full h-64 md:h-[60rem] lg:h-[30rem] overflow-hidden rounded-none shadow-md">
                        {/* Image */}
                        <Image
                            src={story.image || ""}
                            alt={story.title}
                            fill
                            className="object-cover rounded-none"
                            priority
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10" />

                        {/* Text Content */}
                        <div className="absolute bottom-8 left-8 text-white z-20">
                            <h3 className="font-extrabold  tracking-wider pb-2  lg:text-sm">
                                {story.title}
                            </h3>
                            <p className="text-sm tracking-wider pb-2 ">{story.author}</p>
                            <Separator className="bg-white opacity-30" />

                            <Link
                                href={`/stories-details/${story._id}`}
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        router.push('/login'); 
                                    }
                                }}
                                className="text-sm tracking-wider pt-2 inline-block"
                            >
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
