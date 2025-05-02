"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, Globe } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import cookie from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { useStoryForm } from "@/app/hooks/useStoryForm";
import { Countries, Languages } from '@/app/_Mock_/Helper';
import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import Image from "next/image";

type FormData = {
    title: string;
    author: string;
    description: string;
    image: FileList;
    categories: string;
    estimatedReadingTime: string;
    location: string;
    language: string;
    tags: string[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditStoryForm() {
    const params = useParams();
    const router = useRouter();
    const storyId = Array.isArray(params.id) ? params.id[0] : params.id;

    const formMethods = useForm<FormData>();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = formMethods;

    const {
        tags,
        setTags,
        inputTag,
        setInputTag,
        imagePreview,
        setImagePreview,
        handleAddTag,
        handleKeyDown,
        handleRemoveTag,
        handleImageChange,
    } = useStoryForm(formMethods);


    const { data, error, isLoading } = useQuery({
        queryKey: ['edit-stories', storyId],
        queryFn: async () => {

            if (!storyId) {
                return null;
            }

            const token = cookie.get("token");
            if (!token) {
                throw new Error('No token found');
            }

            try {
                const response = await axios.get(`${API_BASE_URL}api/v1/stories/get-story/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                return response.data;
            } catch (error) {
                throw new Error('Error fetching story data');
                return error
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!storyId,
    });


    useEffect(() => {
        if (data && data.data) {
            const storyData = data.data;
            reset({
                title: storyData.title || "",
                description: storyData.description || "",
                author: storyData.author || "",
                // Convert array to string if needed
                categories: Array.isArray(storyData.categories) ? storyData.categories.join(", ") : storyData.categories || "",
                estimatedReadingTime: storyData.estimatedReadingTime || "",
                location: storyData.location || "",
                language: storyData.language || "",
            });


            if (storyData.tags && Array.isArray(storyData.tags)) {
                setTags(storyData.tags);
            }


            if (storyData.image) {
                setImagePreview(
                    typeof storyData.image === 'string'
                        ? storyData.image
                        : URL.createObjectURL(storyData.image)
                );
            }
        }
    }, [data, reset, setTags, setImagePreview]);

    const onSubmit = async (formData: FormData) => {
        const file = formData.image?.[0];

        // Allow form submission even if no new image is provided
        if (!file && !imagePreview) {
            toast.error("Image is required");
            return;
        }

        formData.tags = tags;
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "image") {
                if (formData.image?.[0]) {
                    formDataToSend.append("image", formData.image[0]);
                }
            } else if (key === "tags" && Array.isArray(value)) {
                value.forEach((tag) => formDataToSend.append("tags", tag));
            } else {
                formDataToSend.append(key, value as string);
            }
        });

        try {
            const token = cookie.get("token");

            if (!token) {
                toast.error("You need to be logged in");
                return;
            }

            await axios.put(`${API_BASE_URL}api/v1/stories/edit-stories/${storyId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Story updated successfully");
            router.push("/stories");
        } catch (error) {
            toast.error("Failed to update story");
            return error
        }
    };

    if (!storyId) return <div>Missing story ID</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <Protected allowedRoles={['user']}>
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Edit Story</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="border-none lg:border lg:border-black">
                        <CardHeader>
                            <CardTitle>Story Details</CardTitle>
                            <CardDescription>Share your story with the community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label className="mb-2">Title </Label>
                                <Input
                                    placeholder="Story title"
                                    className="border-[2px] border-gray-400 focus:border-[1px] focus:border-gray-300 focus:ring-0 focus:outline-none placeholder:text-sm"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="mb-2">Description </Label>
                                <Textarea placeholder="Short description" {...register("description", { required: "Description is required" })} className=" placeholder:text-sm" />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            {/* Image */}
                            <div>
                                <Label className="mb-2">Image </Label>
                                {imagePreview && (
                                    <div className="relative mb-4">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 rounded"
                                            width={400}
                                            height={300}
                                        />
                                        <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="text-sm file:text-sm file:px-4 file:py-2 file:border file:border-gray-300 file:rounded file:bg-white file:text-gray-700"
                                    {...register("image", { required: !imagePreview })}
                                    onChange={(e) => {
                                        register("image").onChange(e);
                                        handleImageChange(e);
                                    }}
                                />
                                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                            </div>

                            {/* Author */}
                            <div>
                                <Label className="mb-2">Author</Label>
                                <Input placeholder="Author name" {...register("author", { required: "Author is required" })} className=" placeholder:text-sm" />
                                {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
                            </div>

                            {/* Category & Reading Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2">Category </Label>
                                    <Input placeholder="e.g.Fiction, History" {...register("categories", { required: "Category is required" })} className=" placeholder:text-sm" />
                                    {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
                                </div>

                                <div>
                                    <Label className="flex gap-2 items-center mb-2"><Clock className="h-4 w-4" /> Estimated Reading Time</Label>
                                    <Controller
                                        name="estimatedReadingTime"
                                        control={control}
                                        rules={{ required: "Estimated reading time is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md z-[9999]">
                                                    <SelectItem value="Under 5 minutes">Under 5 minutes</SelectItem>
                                                    <SelectItem value="5-10 minutes">5–10 minutes</SelectItem>
                                                    <SelectItem value="10-15 minutes">10–15 minutes</SelectItem>
                                                    <SelectItem value="15-30 minutes">15–30 minutes</SelectItem>
                                                    <SelectItem value="Over 30 minutes">Over 30 minutes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.estimatedReadingTime && <p className="text-red-500 text-sm">{errors.estimatedReadingTime.message}</p>}
                                </div>
                            </div>

                            {/* Location & Language */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative" style={{ zIndex: 20 }}>
                                    <Label className="flex gap-2 items-center mb-2">
                                        <Globe className="h-4 w-4" /> Language
                                    </Label>
                                    <Controller
                                        name="language"
                                        control={control}
                                        rules={{ required: "Language is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md z-[9999]">
                                                    {Languages.map((lang, index) => (
                                                        <SelectItem key={index} value={lang.name}>
                                                            {lang.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
                                </div>

                                <div>
                                    <Label className="flex gap-2 items-center mb-2"><Globe className="h-4 w-4" /> Location</Label>
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: "Location is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ""}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md z-[9999]">
                                                    {Countries.map((Country, index) => (
                                                        <SelectItem key={index} value={Country.name}>
                                                            {Country.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label className="mb-2">Tags</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="dreams, exploration, adventure, fantasy"
                                        value={inputTag}
                                        onChange={(e) => setInputTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className=" placeholder:text-sm"
                                    />
                                    <Button type="button" onClick={handleAddTag}>Add</Button>
                                </div>
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} className="flex items-center gap-1">
                                            {tag}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </Protected>
    );
}