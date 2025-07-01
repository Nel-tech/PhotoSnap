'use client'

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useGetStory } from "../hooks/useApp"
import { useState, useEffect } from 'react'
import { useAuthStore } from "@/store/useAuthStore"
import { useAuthRedirect } from "../hooks/useAuthRedirect"
import { Story } from "../types/typed"

function Stories() {

    const { redirectToAuth } = useAuthRedirect();
    const user = useAuthStore((state) => state.user);
    

    const { data: stories = [], isLoading, error } = useGetStory();
    const [showStories, setShowStories] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setShowStories(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // Loading state with skeleton
    if (isLoading || !showStories) {
        return (
            <section className="flex flex-wrap lg:flex-nowrap gap-4 pt-[6rem]">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="w-full md:w-1/2">
                        <div className="relative w-full h-64 md:h-[60rem] lg:h-[30rem] overflow-hidden rounded-none shadow-md animate-pulse bg-gray-300">
                            {/* Image Skeleton */}
                            <div className="absolute inset-0 bg-gray-300" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10" />

                            {/* Text Skeleton */}
                            <div className="absolute bottom-8 left-8 z-20 space-y-2">
                                <div className="h-4 w-32 bg-gray-400 rounded" />
                                <div className="h-3 w-24 bg-gray-400 rounded" />
                                <div className="h-2 w-16 bg-gray-400 rounded mt-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error loading stories: {error.message}</p>
            </div>
        );
    }

    // Empty state
    if (!stories || stories.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No stories found</p>
            </div>
        );
    }


    const handleStoryClick = (e: React.MouseEvent<HTMLAnchorElement>, storyId: string) => {
        if (!user) {
            e.preventDefault();
            redirectToAuth(`/stories-details/${storyId}`); 
        }
    };

    return (
        <section className="flex flex-wrap lg:flex-nowrap pt-[6rem]">
            {stories.slice(0, 4).map((story: Story) => (
                <div
                    key={story._id}
                    className="w-full md:w-1/2"
                >
                    <div className="cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105 relative w-full h-64 md:h-[60rem] lg:h-[30rem] overflow-hidden rounded-none shadow-md">
                        {/* Image */}
                        <Image
                            src={story.image || "/placeholder-image.jpg"}
                            alt={story.title || "Story image"}
                            fill
                            className="object-cover rounded-none"
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10" />

                        {/* Text Content */}
                        <div className="absolute bottom-8 left-8 text-white z-20">
                            <h3 className="font-extrabold tracking-wider pb-2 lg:text-sm">
                                {story.title}
                            </h3>
                            <p className="text-sm tracking-wider pb-2">{story.author}</p>
                            <Separator className="bg-white opacity-30" />

                            <Link
                                href={`/stories-details/${story._id}`}
                                onClick={(e) => handleStoryClick(e, story._id)}
                                className="text-sm tracking-wider pt-2 inline-block hover:underline transition-all duration-200"
                            >
                                READ STORY <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default Stories;