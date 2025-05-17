"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Nav from "@/components/Nav"
import UploadForm from "./uploadForm"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import cookie from "js-cookie"
import { FormProvider, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import type { StoryFormData } from "./uploadForm"

interface Story {
    id: string
    _id: string
    title: string
    author: string
    image: string
    description: string
    summary?: string
    date: string
    estimatedReadingTime: string
    categories?: string[]
    tags?: string[]
    location?: string
    language?: string
    bookmarked?: boolean
    status: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const useUserStories = () => {
    return useQuery({
        queryKey: ["userStories"],
        queryFn: async () => {
            const token = cookie.get("token")
            const response = await axios.get(`${API_BASE_URL}api/v1/stories/get-user-stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            })
            return response.data.data
        },
    })
}

function UploadStoryPage() {
    const router = useRouter()
    const methods = useForm<StoryFormData>()
    const [showForm, setShowForm] = useState(false)

    const { data: stories, isLoading, isError, refetch } = useUserStories()

    const handleUploadSuccess = () => {
        setShowForm(false)
        refetch()
    }

    const handleEdit = (storyId: string) => {
        router.push(`/stories/edit/${storyId}`)
    }

    const handleDelete = async (storyId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this story?")
        if (!confirm) return

        try {
            const token = cookie.get("token")
            await axios.delete(`${API_BASE_URL}api/v1/stories/delete-User-Story/${storyId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            refetch()
        } catch (error) {
            alert("Failed to delete story.")
            return error
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-80">
                <Loader2 className="h-10 w-10 text-gray-400 mb-4 animate-spin" />
                <p className="text-gray-500 font-medium">Loading your stories...</p>
                <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
            </div>
        )
    }
    if (isError) return <p className="text-center mt-10 text-red-500">Something went wrong!</p>

    return (
        <div>
            <header>
                <Nav />
            </header>

            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
                {showForm ? (
                    <FormProvider {...methods}>
                        <UploadForm onSuccess={handleUploadSuccess} />
                    </FormProvider>
                ) : (
                    <>
                        {stories?.length === 0 ? (
                            <div className="text-center space-y-6 py-12 px-4">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M8 12h8m-8 4h4"
                                        />
                                    </svg>
                                </div>
                                <h2 className="font-bold text-xl text-gray-900">No stories yet</h2>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    You haven't shared any stories yet. Start your storytelling journey by uploading your first one.
                                </p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-md font-medium transition-all duration-300 hover:-translate-y-1"
                                >
                                    Upload Your First Story
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
                                        <p className="text-gray-500 text-sm mt-1">Manage and organize your storytelling collection</p>
                                    </div>
                                    <Button
                                        onClick={() => setShowForm(true)}
                                        className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md font-medium"
                                    >
                                        Upload New
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {stories?.map((story: Story) => (
                                        <div
                                            key={story._id}
                                            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
                                        >
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={story.image || "/placeholder.svg"}
                                                    alt={story.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                                {story.status === "Pending" && (
                                                    <span className="absolute top-3 right-3 text-amber-800 bg-amber-100 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        Pending Review
                                                    </span>
                                                )}
                                                {story.status === "Published" && (
                                                    <span className="absolute top-3 right-3 text-emerald-800 bg-emerald-100 text-xs font-medium px-2.5 py-1 rounded-full">
                                                        Published
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-5 space-y-4 flex-1 flex flex-col">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{story.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        By <span className="font-medium">{story.author}</span> • {story.estimatedReadingTime} read
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-700 line-clamp-2 flex-grow">{story.description}</p>

                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                                                    {story.categories && (
                                                        <p className="flex items-center gap-1">
                                                            <span className="font-semibold">Category:</span> {story.categories}
                                                        </p>
                                                    )}
                                                    {story.location && (
                                                        <p className="flex items-center gap-1">
                                                            <span className="font-semibold">Location:</span> {story.location}
                                                        </p>
                                                    )}
                                                    {story.language && (
                                                        <p className="flex items-center gap-1">
                                                            <span className="font-semibold">Language:</span> {story.language}
                                                        </p>
                                                    )}
                                                </div>

                                                {Array.isArray(story.tags) && story.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {story.tags.map((tag: string, idx: number) => (
                                                            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-2 pt-2 mt-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs font-medium"
                                                        onClick={() => handleEdit(story._id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                        onClick={() => handleDelete(story._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default UploadStoryPage
