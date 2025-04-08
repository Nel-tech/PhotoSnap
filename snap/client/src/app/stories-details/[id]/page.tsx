'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2, Bookmark, Calendar, Clock, User, Tag } from 'lucide-react'
import { useState } from 'react'
import cookie from 'js-cookie'
import Nav from '@/components/Nav'
import Image from 'next/image'

function StoryDetails() {
    const { id } = useParams()
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = cookie.get('token')
    const [isBookmarked, setIsBookmarked] = useState(false)

    const { data: story, isLoading, error } = useQuery({
        queryKey: ['get-story-by-id', id],
        enabled: !!id,
        queryFn: () =>
            axios
                .get(`${API_URL}/api/v1/stories/stories-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((res) => {
                    const storyData = res.data.data;
                    setIsBookmarked(storyData.bookmarked);
                    return storyData;
                }),
    })

    // Loading state with spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg">Loading story...</span>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 max-w-md bg-red-50 rounded-lg border border-red-200">
                    <h2 className="text-xl font-semibold text-red-700">Error Loading Story</h2>
                    <p className="mt-2 text-red-600">{error.message || "Failed to load story details"}</p>
                </div>
            </div>
        )
    }

    // Not found state
    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800">Story Not Found</h2>
                    <p className="mt-2 text-gray-600">The story you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        )
    }

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Here you'd also update the bookmark status via API call
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header>
                <Nav />
            </header>

            {/* Hero Image */}
            <div className="relative h-96 w-full">
                <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{story.title}</h1>
                    </div>
                </div>
            </div>

            {/* Story Content Container */}
            <main className="container mx-auto px-4 py-8">
                {/* Meta Info Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                        <div className="flex items-center text-gray-600">
                            <User size={18} className="mr-2" />
                            <span>{story.author}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar size={18} className="mr-2" />
                            <span>{formatDate(story.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock size={18} className="mr-2" />
                            <span>{story.estimatedReadingTime}</span>
                        </div>
                    </div>

                    <button
                        onClick={toggleBookmark}
                        className={`mt-4 md:mt-0 flex items-center px-3 py-1 rounded-full ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                        <Bookmark size={18} className={`mr-1 ${isBookmarked ? 'fill-blue-600' : ''}`} />
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                        {story.content}
                    </p>
                </div>

                {/* Categories and Tags */}
                <div className="mt-12 pt-6 border-t border-gray-200">
                    {/* Categories */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {story.categories?.map((category, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {story.tags?.map((tag, index) => (
                                <span key={index} className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                    <Tag size={14} className="mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StoryDetails