'use client'

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import axios from "axios"
// import { Loader2 } from 'lucide-react'
// import { Skeleton } from "@/components/ui/skeleton";
//import { useAuth } from "@/store/AuthContext"
import cookie from "js-cookie"
//import { useAuth } from "@/hooks/AuthContext"
//import { useParams } from "next/navigation"

 interface Story {
    _id: string;
    title: string;
    image: string;
    author: string;
}


function PostStories() {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = cookie.get('token')

    const { data: stories, isLoading, error } = useQuery({
        queryKey: ['get-all-stories'],
        queryFn: () =>
            axios.get(`${API_URL}api/v1/stories/get-all-stories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.data.data)
    })

    const [showStories, setShowStories] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowStories(true);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (isLoading || !showStories) {
        return (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="relative overflow-hidden shadow-lg">
                        <div className="h-[300px] w-full bg-gray-300 animate-pulse" />
                        <div className="absolute bottom-8 left-8 text-white z-10 space-y-2">
                            <div className="h-5 w-32 bg-gray-400 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-400 rounded animate-pulse" />
                            <div className="h-1 w-24 bg-gray-500 rounded animate-pulse mt-2" />
                            <div className="h-4 w-28 bg-gray-400 rounded animate-pulse mt-2" />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    if (error) return <div>Error: {error.message}</div>
    if (!stories || stories.length === 0) return <div>No stories found</div>


    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stories.map((story: Story) => (
                <div key={story._id} className="relative overflow-hidden  shadow-lg">

                    {/* Image Container */}
                    <div className="relative cursor-pointer hover:scale-105 transition-all duration-300" >
                        <Image
                            src={story.image || ''}
                            alt={story.title}
                            className="w-full rounded-none  h-auto object-cover"
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
                            <Link href={`/stories-details/${story._id}`} className="text-sm tracking-wider pt-2 inline-block">
                                READ STORY <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                </div>
            ))}
        </section>
    )
}

export default PostStories
