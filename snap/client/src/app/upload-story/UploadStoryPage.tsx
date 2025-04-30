'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Nav from '@/components/Nav'
import UploadForm from './uploadForm'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import cookie from 'js-cookie'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { StoryFormData } from './uploadForm'

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
    status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const useUserStories = () => {
    return useQuery({
        queryKey: ['userStories'],
        queryFn: async () => {
            const token = cookie.get('token')
            const response = await axios.get(`${API_BASE_URL}api/v1/stories/get-user-stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            })
            console.log(response.data.data)
            return response.data.data
        },
    })
}

function UploadStoryPage() {
    const router = useRouter()
    const methods = useForm<StoryFormData>();
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
            const token = cookie.get('token')
            await axios.delete(`${API_BASE_URL}api/v1/stories/delete-User-Story/${storyId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            refetch()
        } catch (error) {
            console.error("Delete failed:", error)
            alert("Failed to delete story.")
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-60">
                <Loader2 style={{ animation: 'spin 1s linear infinite' }} className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">Loading stories, please wait...</p>
            </div>
        )
    }
    if (isError) return <p className="text-center mt-10 text-red-500">Something went wrong!</p>

    return (
        <div>
            <header>
                <Nav />
            </header>

            <div className="max-w-4xl mx-auto py-10 px-4">
                {showForm ? (
                    <FormProvider {...methods}>
                        <UploadForm onSuccess={handleUploadSuccess} />
                    </FormProvider>
                ) : (
                    <>
                        {stories?.length === 0 ? (
                            <div className="text-center space-y-4 mt-10">
                                <h2 className="font-semibold text-lg">No story uploaded yet</h2>
                                <p className="text-gray-500 text-sm">
                                    You haven't shared any stories yet. Click below to upload your first one.
                                </p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-black text-white transition-transform duration-300 hover:-translate-y-1 cursor-pointer hover:text-primary/80 px-4 py-2 rounded-md"
                                >
                                    Upload Story
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Your Stories</h2>
                                    <Button onClick={() => setShowForm(true)}>Upload New</Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {stories.map((story: Story) => (
                                        <div
                                            key={story._id}
                                            className="border rounded-2xl shadow-sm hover:shadow-md bg-white transition-all overflow-hidden"
                                        >
                                            <div className="relative w-full h-52">
                                                <Image
                                                    src={story.image}
                                                    alt={story.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="p-5 space-y-3">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-semibold text-gray-900">{story.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        By <span className="font-medium">{story.author}</span> • {story.estimatedReadingTime} read
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-700 line-clamp-2">{story.description}</p>

                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                                                    <p><span className="font-semibold">Category:</span> {story.categories}</p>
                                                    <p><span className="font-semibold">Location:</span> {story.location}</p>
                                                    <p><span className="font-semibold">Language:</span> {story.language}</p>
                                                    <p><span className="font-semibold">Status:</span> {story.status}</p>
                                                </div>

                                                {Array.isArray(story.tags) && story.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {story.tags.map((tag: string, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {story.status === 'Pending' && (
                                                    <span className="text-yellow-600 bg-yellow-100 text-xs px-2 py-1 rounded-full">
                                                        Pending Review
                                                    </span>
                                                )}
                                                {story.status === 'Published' && (
                                                    <span className="text-green-600 bg-green-100 text-xs px-2 py-1 rounded-full">
                                                        Published
                                                    </span>
                                                )}
                                                <div className="flex justify-end gap-2 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        className="text-xs"
                                                        onClick={() => handleEdit(story._id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-xs"
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