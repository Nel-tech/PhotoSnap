"use client"
import Protected from '@/components/Protected'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import {
    Bookmark,
    Calendar,
    Clock,
    Tag,
    MapPin,
    Eye,
    Heart,
    ChevronLeft,
    BookmarkCheck,
    Globe,
    ArrowUp,
} from "lucide-react"
import { useState, useEffect } from "react"
import cookie from "js-cookie"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation';

interface Story {
    id: string;
    _id: string;
    title: string;
    author: string;
    image: string;
    description: string;
    summary?: string;
    date: string;
    estimatedReadingTime: string;
    categories?: string[];
    tags?: string[];
    location?: string;
    language?: string;
    bookmarked?: boolean;
}

function StoryDetails() {
    const { id } = useParams()
    const router = useRouter()
    const queryClient = useQueryClient();
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = cookie.get("token")
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [randomStories, setRandomStories] = useState<Story[]>([])

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const {
        data: story,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["get-story-by-id", id],
        enabled: !!id,
        queryFn: () =>
            axios
                .get(`${API_URL}api/v1/stories/stories-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const storyData = res.data.data
                    console.log(storyData)
                    setIsBookmarked(storyData.bookmarked)
                    return storyData
                }),
    })

    // Fetch all stories
    const { data: allStories } = useQuery<Story[]>({
        queryKey: ["get-all-stories"],
        queryFn: () =>
            axios
                .get(`${API_URL}api/v1/stories/get-all-stories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => res.data.data),
    })

    // Function to get random stories
    const getRandomStories = (stories: Story[], count = 2): Story[] => {
        if (!stories || stories.length === 0) return []

        // Filter out the current story
        const otherStories = stories.filter(story => story._id !== id)
        if (otherStories.length <= count) return otherStories
        const shuffled = [...otherStories]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled.slice(0, count)
    }

    
    useEffect(() => {
        if (allStories) {
            setRandomStories(getRandomStories(allStories))
        }
    }, [allStories, id])

    // Loading state with spinner
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-[#c7a17a] animate-spin"></div>
                        <div className="absolute inset-3 rounded-full border-t-4 border-b-4 border-[#e9e1d4] animate-spin animation-delay-150"></div>
                        <div className="absolute inset-6 rounded-full border-t-4 border-b-4 border-[#f8f7f4] animate-spin animation-delay-300"></div>
                    </div>
                    <span className="text-xl font-serif italic text-[#3c3c3c]">Loading your story...</span>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
                <div className="text-center p-12 max-w-md bg-white rounded-lg shadow-xl border border-[#e9e1d4]">
                    <div className="w-20 h-20 mx-auto mb-6 text-[#c7a17a]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-[#3c3c3c] mb-4">Error Loading Story</h2>
                    <p className="text-[#6b6b6b] mb-8 font-light">{error.message || "Failed to load story details"}</p>
                    <Button
                        variant="outline"
                        asChild
                        className="border-[#c7a17a] text-[#c7a17a] hover:bg-[#f8f3ea] hover:text-[#a67c52]"
                    >
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Not found state
    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
                <div className="text-center p-12 max-w-md bg-white rounded-lg shadow-xl border border-[#e9e1d4]">
                    <div className="w-20 h-20 mx-auto mb-6 text-[#c7a17a]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-serif text-[#3c3c3c] mb-4">Story Not Found</h2>
                    <p className="text-[#6b6b6b] mb-8 font-light">
                        The story you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        variant="outline"
                        asChild
                        className="border-[#c7a17a] text-[#c7a17a] hover:bg-[#f8f3ea] hover:text-[#a67c52]"
                    >
                        <Link href="/">Browse Stories</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const toggleBookmark = async () => {
        try {
            const res = await axios.post(`${API_URL}api/v1/stories/book-mark/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const updated = !isBookmarked;
            setIsBookmarked(updated);
            toast.success(updated ? 'Story Bookmarked' : 'Story Unbookmarked');

            queryClient.invalidateQueries({ queryKey: ['get-user-bookmarks'] });
            return res.data.data
        } catch (error) {
            toast.error('Failed to update bookmark')
            return error
        }
    }

  

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    return (

        <Protected allowedRoles={['user']}>

        <div className="min-h-screen bg-[#f8f7f4] text-[#3c3c3c] font-sans">
            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e9e1d4]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-[#3c3c3c] hover:text-[#c7a17a] transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="font-medium">Back</span>
                        </Button>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleBookmark}
                                className={`${isBookmarked ? "text-[#c7a17a] hover:text-[#a67c52]" : "text-[#6b6b6b] hover:text-[#3c3c3c]"
                                    } hover:bg-[#f8f3ea]`}
                            >
                                {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                                <span className="ml-2 hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scroll to top button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#c7a17a] text-white shadow-lg hover:bg-[#a67c52] transition-colors"
                >
                    <ArrowUp className="h-5 w-5" />
                </motion.button>
            )}

            <div className="pt-16">
                {/* Hero Section with Parallax Effect */}
                <div className="relative h-[80vh] overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
                        style={{
                            backgroundImage: `url(${story.image || "/placeholder.svg?height=1080&width=1920"})`,
                            transform: "translateZ(0)",
                        }}
                    ></div>

                    <div className="absolute inset-0 z-20 flex items-end">
                        <div className="container mx-auto px-4 pb-16 md:pb-24">
                            <div className="max-w-3xl">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {story.categories?.map((category: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-none px-3 py-1 uppercase text-xs tracking-wider"
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                                    {story.title}
                                </h1>

                                {/* Author and Metadata Section */}
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {/* Author Card */}
                                    <div className="flex items-center gap-4 text-white">
                                        <Avatar className="h-16 w-16 border-2 border-white/30">
                                            <AvatarFallback className="bg-white/10 text-white text-xl font-serif">
                                                {story.author?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="font-serif text-lg text-white">{story.author}</h2>
                                            <div className="text-xs text-white/80 italic">Storyteller</div>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-2" />
                                            {formatDate(story.date)}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2" />
                                            {story.estimatedReadingTime}
                                        </div>
                                        {story.location && (
                                            <div className="flex items-center">
                                                <MapPin size={16} className="mr-2" />
                                                {story.location}
                                            </div>
                                        )}
                                        {story.language && (
                                            <div className="flex items-center">
                                                <Globe size={16} className="mr-2" />
                                                {story.language}
                                            </div>
                                        )}
                                    </div>
                                </div>

                               
                               
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        {/* Story Content */}
                        <div className="relative">
                            {/* First Letter Styling */}
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#3c3c3c] leading-relaxed text-lg first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-[#c7a17a] first-letter:mr-3 first-letter:float-left">
                                    {story.description}
                                </p>
                            </div>

                            {/* Social Interaction Sidebar */}
                            <div className="hidden md:block fixed left-8 top-1/2 transform -translate-y-1/2 z-20">
                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        onClick={toggleBookmark}
                                        className={`p-3 rounded-full bg-white border border-[#e9e1d4] shadow-md ${isBookmarked ? "text-[#c7a17a]" : "text-[#6b6b6b] hover:text-[#c7a17a]"
                                            } transition-colors`}
                                    >
                                        {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tags with decorative elements */}
                        <div className="my-16 relative">
                            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-[#e9e1d4]"></div>
                            <div className="relative z-10 flex justify-center">
                                <div className="bg-[#f8f7f4] px-8 text-center">
                                    <h3 className="text-sm font-serif italic text-[#c7a17a]">Tagged With</h3>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                {story.tags?.map((tag: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center px-4 py-2 bg-white border border-[#e9e1d4] text-[#3c3c3c] text-sm font-medium hover:bg-[#f8f3ea] hover:text-[#c7a17a] transition-colors"
                                    >
                                        <Tag size={14} className="mr-1.5 text-[#c7a17a]" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quote Section */}
                        <div className="my-16 px-8 py-12 bg-[#f8f3ea] border-l-4 border-[#c7a17a] relative">
                            <div className="absolute top-4 left-4 text-[#c7a17a] opacity-20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                                </svg>
                            </div>
                            <blockquote className="font-serif text-xl italic text-[#3c3c3c] relative z-10">
                                Stories have the power to transport us to different worlds, to make us feel emotions we've never felt
                                before, and to connect us with people we've never met.
                            </blockquote>
                            <div className="mt-4 text-right text-[#6b6b6b] font-medium">— The Art of Storytelling</div>
                        </div>

                        {/* Call to action */}
                        <div className="my-16 text-center">
                            <div className="inline-block mx-auto mb-6">
                                <div className="w-16 h-px bg-[#c7a17a] transform -rotate-45 inline-block mx-2"></div>
                                <div className="w-16 h-px bg-[#c7a17a] transform rotate-45 inline-block mx-2"></div>
                            </div>
                            <h2 className="text-2xl font-serif text-[#3c3c3c] mb-6">Did you enjoy this story?</h2>

                        </div>

                        {/* More Stories Section */}
                        <div className="my-16">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-serif text-[#3c3c3c]">More Stories</h2>
                                <Link href="/stories" className="text-sm font-medium text-[#c7a17a] hover:text-[#a67c52] transition-colors">
                                    View all stories
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {randomStories.map((randomStory) => (
                                    <Link
                                        key={randomStory._id}
                                        href={`/stories-details/${randomStory._id}`}
                                        className="bg-white border border-[#e9e1d4] overflow-hidden group hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={randomStory.image}
                                                alt={randomStory.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-serif text-lg font-medium text-[#3c3c3c] mb-2 group-hover:text-[#c7a17a] transition-colors">
                                                {randomStory.title}
                                            </h3>
                                            <p className="text-sm text-[#6b6b6b] mb-4 line-clamp-2">
                                                {randomStory.summary || randomStory.description.substring(0, 150) + "..."}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-[#6b6b6b]">{randomStory.estimatedReadingTime}</div>
                                                <div className="flex items-center gap-3">
                                                  
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Protected>
    )
}

export default StoryDetails
