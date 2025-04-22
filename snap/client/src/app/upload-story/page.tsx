'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Nav from '@/components/Nav'
import Upload from './upload'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import cookie from 'js-cookie'

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
            return response.data.data
        },
    })
}

function UploadStoryPage() {
    const [showForm, setShowForm] = useState(false)

    const { data: stories, isLoading, isError, refetch } = useUserStories()

    const handleUploadSuccess = () => {
        setShowForm(false)
        refetch()
    }

    if (isLoading) return <p className="text-center mt-10">Loading...</p>
    if (isError) return <p className="text-center mt-10 text-red-500">Something went wrong!</p>

    return (
        <div>
            <header>
                <Nav />
            </header>

            <div className="max-w-3xl mx-auto py-8">
                {showForm ? (
                    <Upload onSuccess={handleUploadSuccess} />
                ) : (
                    <>
                        {stories.length === 0 ? (
                            <div className="text-center space-y-4 mt-10">
                                <h2 className="font-semibold text-lg">No story uploaded yet</h2>
                                <p className="text-gray-500 text-sm">
                                    You haven’t shared any stories yet. Click below to upload your first one.
                                </p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-black text-white hover:bg-violet-200 hover:text-primary/80 px-4 py-2 rounded-md"
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

                                <div className="space-y-4">
                                    {stories.map((story: any) => (
                                        <div key={story._id} className="p-4 border rounded-md shadow-sm">
                                            <h3 className="text-lg font-bold">{story.title}</h3>
                                            <p className="text-sm text-gray-500">By {story.author} • {story.estimatedReadingTime} read</p>
                                            <p className="mt-2 text-sm text-gray-700 line-clamp-2">{story.content}</p>
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
