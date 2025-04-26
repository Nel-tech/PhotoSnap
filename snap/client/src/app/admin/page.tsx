"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import cookie from 'js-cookie'
import axios from "axios"
import toast from "react-hot-toast"
import Image from "next/image"

interface Story {
    _id: string
    title: string;
    author: string;
    description: string;
    image: FileList;
    categories: string;
    estimatedReadingTime: string;
    location: string;
    language: string;
    tags: string[];
    status: "pending" | "published" | "rejected"

}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useFetchStories = () => {
    return useQuery({
        queryKey: ['get-stories'],
        queryFn: async () => {
            const token = cookie.get("token");
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}api/v1/stories/get-all-pending-stories`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            console.log(response.data)
            return response.data;

        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};



const useUpdateStoryStatus = () => {
    return useMutation({
        mutationFn: async ({ storyId, status }: { storyId: string; status: "published" | "rejected" | "pending" }) => {
            const token = cookie.get("token");
            const formData = new FormData();
            formData.append("status", status);

            const response = await axios.post(
                `${API_BASE_URL}api/v1/stories/update-story-status/${storyId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        },
    });
};

export default function AdminPage() {
    const [stories, setStories] = useState<Story[]>([])
    const { data, isLoading, isError } = useFetchStories()
    const { mutate } = useUpdateStoryStatus()

    useEffect(() => {
        if (data?.data) {
            setStories(data.data);
        }
    }, [data]);


    const handleAccept = (id: string) => {
        setStories(stories.map((story: any) => (story._id === id ? { ...story, status: "published" } : story)))

        toast("Congratulations! The story has been approved and will be published soon.",)

        mutate(
            { storyId: id, status: "published" },
            {
                onSuccess: () => {
                    toast("Congratulations! The story has been approved and will be published soon.");
                },
                onError: () => {
                    toast.error("Something went wrong while approving the story.");
                }
            }
        );

    }

    const handleReject = (id: string) => {
        setStories(stories.map((story) => (story._id === id ? { ...story, status: "rejected" } : story)))

        toast("The story has been rejected. An email will be sent to the author with feedback.")

        mutate(
            { storyId: id, status: "rejected" },
            {
                onSuccess: () => {
                    toast("The story has been rejected. An email will be sent to the author with feedback.");
                },
                onError: () => {
                    toast.error("Something went wrong while rejecting the story.");
                }
            }
        );
    }
    if (isLoading) return <div>Loading....</div>
    if (isError) return <div>Something went wrong</div>

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Story Submissions</h1>
                <p className="text-muted-foreground mt-2">Review and manage story submissions</p>
            </div>

            <div className="grid gap-6">
                {stories.map((story: Story) => (
                    <Card
                        key={story._id}
                        className={`rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-opacity ${story.status !== "pending" ? "opacity-70" : "opacity-100"
                            }`}
                    >
                        {/* Story Image */}
                        {story.image && (
                            <Image
                                src={typeof story.image === "string" ? story.image : URL.createObjectURL(story.image[0])}
                                alt={story.title}
                                width={600}
                                height={300}
                                className="w-full h-48 object-cover"
                            />

                        )}

                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-semibold">{story.title}</CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground mt-1">
                                        By {story.author}
                                    </CardDescription>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        <span>Category: <span className="font-medium text-foreground">{story.categories}</span></span>
                                        <span>•</span>
                                        <span>Location: <span className="font-medium text-foreground">{story.location}</span></span>
                                        <span>•</span>
                                        <span>Language: <span className="font-medium text-foreground">{story.language}</span></span>
                                        <span>•</span>
                                        <span>Read Time: <span className="font-medium text-foreground">{story.estimatedReadingTime}</span></span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                {story.status === "published" && (
                                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Accepted
                                    </div>
                                )}
                                {story.status === "rejected" && (
                                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Rejected
                                    </div>
                                )}
                                {story.status === "pending" && (
                                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">


                            {/* Story Description */}
                            <div>
                                <p className="text-sm text-muted-foreground">{story.description}</p>
                            </div>

                            {/* Story Tags */}
                            {/* <div className="flex flex-wrap gap-2 mt-2">
                                {story.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-0.5 bg-muted text-xs rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div> */}
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            {story.status === "pending" ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(story._id)}
                                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAccept(story._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Accept
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setStories(stories.map((s) =>
                                            s._id === story._id ? { ...s, status: "pending" } : s
                                        ))
                                    }
                                >
                                    Reset Status
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>



        </div>
    )
}

