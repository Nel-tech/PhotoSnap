"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, Globe } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import cookie from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { useStoryForm } from "../hooks/useStoryForm";
import { Countries, Languages } from '@/app/_Mock_/Helper'
import Image from "next/image";

// Define the StoryFormData interface with proper types
export interface StoryFormData {
    title: string;
    author: string;
    description: string;
    image: FileList;
    categories: string;
    estimatedReadingTime: string;
    location: string;
    language: string;
    tags: string[];
}

export type UploadProps = {
    onSuccess: () => void;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useUploadStory = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const token = cookie.get("token");
            const response = await axios.post(`${API_BASE_URL}api/v1/stories/upload-story`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            return response.data;
        }
    });
};

export default function UploadForm({ onSuccess }: UploadProps) {
    const formMethods = useForm<StoryFormData>();

    const {
        tags,
        inputTag,
        setInputTag,
        imagePreview,
        setImagePreview,
        handleAddTag,
        handleKeyDown,
        handleRemoveTag,
        handleImageChange,
    } = useStoryForm(formMethods);

    const { register, handleSubmit, control, formState: { errors } } = formMethods;

    const { mutate, isPending } = useUploadStory();

    const onSubmit = (data: StoryFormData) => {
        const file = data.image?.[0];
        if (!file) {
            toast.error("Image is required");
            return;
        }
        if (!data.tags || data.tags.length === 0) {
            toast.error("Please add at least one tag");
            return;
        }

        // Create a new FormData object (HTML FormData, not our interface)
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "image") {
                formData.append("image", file);
            } else if (key === "tags" && Array.isArray(value)) {
                formData.append("tags", JSON.stringify(value));
            } else if (key === "categories") {
                formData.append("categories", value as string);  
            } else {
                formData.append(key, value as string);
            }
        });

        // Pass the FormData directly
        mutate(formData, {
            onSuccess: () => {
                toast.success("Story uploaded successfully");
                onSuccess();
            },
            onError: (error) => {
                toast.error("Failed to upload story");
                return error
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Upload a Story</h1>
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
                            <Textarea placeholder=" description" {...register("description", { required: "Description is required" })} className=" placeholder:text-sm" />
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
                                        width={300}
                                        height={200}
                                        className="max-h-64 rounded"
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
                                {...register("image", { required: "Image is required" })}
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." className=" placeholder:text-sm" />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Language" className=" placeholder:text-sm" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md z-[9999]">
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {Languages.map((lang, index) => (
                                                        <SelectItem key={index} value={lang.name}>
                                                            {lang.name}
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div>
                                <Label className="flex gap-2 items-center mb-2"><Globe className="h-4 w-4" /> Location</Label>
                                <Controller
                                    name="location"
                                    control={control}
                                    rules={{ required: "Location is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Location" className=" placeholder:text-sm" />
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
                                <Button type="button" className="bg-black text-white" onClick={handleAddTag}>Add</Button>
                            </div>
                            {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
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
                        <Button type="submit" className="bg-black text-white" disabled={isPending}>
                            {isPending ? "Uploading..." : "Submit Story"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}