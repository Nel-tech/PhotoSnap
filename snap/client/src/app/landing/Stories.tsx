'use client'
//import { stories } from "@/app/_Mock_/Helper"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from 'react'
import { useAuth } from "@/hooks/AuthContext"
//import { useRouter } from "next/navigation"


function Stories() {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

    const {user} = useAuth()

    const { data: stories, isLoading, error } = useQuery({
        queryKey: ['public-stories'],
        queryFn: () => axios.get(`${API_URL}/api/v1/stories/public-stories`).then(res => res.data.data)
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
        <section className="flex">
            {stories.slice(0, 4).map((story) => (
                <div key={story._id} className="relative overflow-hidden">

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

                            <Link
                                href={user ? `/stories-details/${story._id}` : "/login"}
                                className="text-sm tracking-wider pt-2 inline-block"
                            >
                                {user ? "READ STORY" : 'READ STORY'} <span aria-hidden="true">&rarr;</span>
                            </Link>

                        </div>
                    </div>

                </div>
            ))}
        </section>
    )
}

export default Stories
