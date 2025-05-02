"use client"
import Protected from "@/components/Protected"
import { useQuery } from "@tanstack/react-query"
import { useState, } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card,  CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Trash2 } from "lucide-react"
import Image from "next/image"
import Nav from "@/components/Nav"
import { useAuthStore } from "@/store/useAuthStore"
import axios from "axios"
import toast from "react-hot-toast"
import cookie from "js-cookie"
import Link from "next/link"
// import { Skeleton } from "@/components/ui/skeleton" // Tailwind-based skeleton
import StorySkeleton from "@/components/StorySkeleton"

type Story = {
    _id: string
    title: string
    description: string
    image: string
    author: string
    categories: string[]
    readingTime: string
    location: string
    language: string
}

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<Story[]>([])
    // const [showStories, setShowStories] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const { data, error, isLoading } = useQuery({
        queryKey: ['get-user-bookmarks'],
        queryFn: async () => {
            const token = cookie.get('token')
            if (!token) throw new Error("No token found")

            const res = await axios.get(`${API_URL}api/v1/stories/getUserBookMarkedStories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            })
            return res.data
        },
        enabled: isAuthenticated,
    })

    // useEffect(() => {
    //     if (storiesResponse && storiesResponse.success) {
    //         setBookmarks(storiesResponse.data || [])
    //         setShowStories(true)
    //     } else if (storiesResponse && !storiesResponse.success) {
    //         setShowStories(true)
    //     }
    // }, [storiesResponse])

    if (error) return <div>Error: {error.message}</div>

    const removeBookmark = async (id: string) => {
        try {
            await axios.delete(`${API_URL}api/v1/stories/delete-bookmark/${id}`, {
                headers: { Authorization: `Bearer ${cookie.get('token')}` }
            })
            setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id))
            toast.success('Bookmark removed successfully')
        } catch (error) {
            toast.error('Failed to remove bookmark')
            return error
        }
    }

    // ✅ Updated StoryCard with shadow and no border
    const StoryCard = ({ story, onRemove }: { story: Story; onRemove: (id: string) => void }) => (
        <Card className="h-full border-none shadow-md flex flex-col justify-between"> {/* Removed border, added shadow */}
            <div>
                <div className="relative h-48 w-full">
                    <Image src={story.image || "/placeholder.svg"} alt={story.title} fill className="object-cover rounded-t-lg" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{story.title}</CardTitle>
                    <CardDescription>by {story.author}</CardDescription>
                </CardHeader>
            </div>
            <CardFooter className="flex justify-between gap-2 mt-4">
                <Link href={`/stories/${story._id}`}>
                    <Button variant="secondary" size="sm">Read Story</Button>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onRemove(story._id)}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                </Button>
            </CardFooter>
        </Card>
    )

  
    return (
        <Protected allowedRoles={['user']}>
            <div>
                <header><Nav /></header>

                <div className="ml-[2rem] py-5 flex items-center justify-between mb-6 lg:ml-[7rem]">
                    <div className="flex items-center text-sm text-gray-500 gap-1 flex-wrap">
                        <Link href="/" className="hover:underline text-gray-600">Home</Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className=" text-gray-600">Dashboard</span>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-gray-400">Bookmarks</span>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto py-8">
                    <h1 className="text-lg text-center font-bold mb-8 lg:text-3xl">Your Bookmark Collections</h1>

                    <Tabs defaultValue="bookmarks">
                        <TabsContent value="bookmarks">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, idx) => (
                                        <StorySkeleton key={idx} />
                                    ))}
                                </div>
                            ) : data?.data?.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
                                    <p className="text-muted-foreground">When you bookmark stories, they&apos;ll appear here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data?.data?.map((bookmark: Story) => (
                                        <StoryCard key={bookmark._id} story={bookmark} onRemove={removeBookmark} />
                                    ))}
                                </div>
                            )}

                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Protected>
    )
}
