"use client"
import Protected from "@/components/Protected"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, } from "react"
import { Bookmark, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Nav from "@/components/Nav"
import { useAuthStore } from "@/store/useAuthStore"
import toast from "react-hot-toast"
import Link from "next/link"
import StoryCard from '@/components/StoryCard'
import StorySkeleton from "@/components/StorySkeleton"
import { Story } from "../types/typed"
import { useDeleteUserBookmarks, useDeleteUserLikes, useUserBookmarkedStories, useUserLikedStories } from "../hooks/useApp"


export default function BookmarksPage() {
    // const [bookmarks, setBookmarks] = useState<Story[]>([])
    const [activeTab, setActiveTab] = useState("bookmarks")
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    // Get User Bookmarks
    const {
        data: bookmarksData = [],
        isLoading: isLoadingBookmarks,
        error,
    } = useUserBookmarkedStories()

    
    // Get User Likes
    const {
        data: likesData,
        isLoading: isLoadingLikes,
    } = useUserLikedStories()


    // Delete Bookmarks
   
    const { mutate: deleteLikes } = useDeleteUserLikes()

    // Remove/Delete Bookmarks;
    const { mutate: deleteBookmark } = useDeleteUserBookmarks()


    if (error) return <div>Error: {error.message}</div>

    return (
        <Protected allowedRoles={["user"]}>
            <div>
                <header>
                    <Nav />
                </header>

                

                <div className="max-w-6xl mx-auto py-8 px-4">
                    <h1 className="text-lg text-center font-bold mb-8 lg:text-3xl">Your Personal Collections</h1>

                    <Tabs defaultValue="bookmarks" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                            <TabsTrigger
                                value="bookmarks"
                                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                <Bookmark className="h-4 w-4 mr-2" />
                                Bookmarks
                            </TabsTrigger>
                            <TabsTrigger
                                value="likes"
                                className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-600 dark:data-[state=active]:bg-rose-900/30 dark:data-[state=active]:text-rose-400"
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                Likes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bookmarks" className="mt-0">
                            {isLoadingBookmarks ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, idx) => (
                                        <StorySkeleton key={idx} />
                                    ))}
                                </div>
                            ) : bookmarksData?.length === 0 ? (
                                <div className="text-center py-12 bg-primary/5   p-8">
                                    <Bookmark className="h-12 w-12 mx-auto text-primary mb-4" />
                                    <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
                                    <p className="text-muted-foreground">When you bookmark stories, they&apos;ll appear here.</p>
                                    <Link href="/stories">
                                        <Button variant="outline" className="mt-4">
                                            Browse Stories
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {bookmarksData?.map((bookmark: Story) => (
                                        <StoryCard key={bookmark._id} story={bookmark} onRemove={deleteBookmark} type="bookmark" />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="likes" className="mt-0">
                            {isLoadingLikes ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, idx) => (
                                        <StorySkeleton key={idx} />
                                    ))}
                                </div>
                            ) : likesData?.length === 0 ? (
                                <div className="text-center py-12 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-200 dark:border-rose-800/30 p-8">
                                    <Heart className="h-12 w-12 mx-auto text-rose-500 mb-4" />
                                    <h3 className="text-xl font-medium mb-2">No liked stories yet</h3>
                                    <p className="text-muted-foreground">Stories you like will be saved here for easy access.</p>
                                    <Link href="/stories">
                                        <Button
                                            variant="outline"
                                            className="mt-4 border-rose-200 hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/20"
                                        >
                                            Discover Stories
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {likesData?.map((like: Story) => (
                                        <StoryCard key={like._id} story={like} onRemove={deleteLikes} type="like" />
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
