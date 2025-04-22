"use client";

import React, { useState } from "react";

// components/ui/index.ts

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, MapPin, Globe } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import cookie from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

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

type UploadProps = {
    onSuccess: () => void;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useUploadStory = () => {
    return useMutation({
        mutationFn: async (data: FormData) => {
            const token = cookie.get("token");
            const response = await axios.post(`${API_BASE_URL}api/v1/stories/upload-story`, data, {
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

export default function UploadPage({ onSuccess }: UploadProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        clearErrors,
        formState: { errors }
    } = useForm<FormData>();

    const { mutate, isPending } = useUploadStory();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [inputTag, setInputTag] = useState("");

    const handleAddTag = () => {
        const trimmed = inputTag.trim();
        const currentTags = getValues("tags") || [];
        if (trimmed && !currentTags.includes(trimmed)) {
            const updatedTags = [...currentTags, trimmed];
            setValue("tags", updatedTags);
            setInputTag("");
            clearErrors("tags");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = (getValues("tags") || []).filter((tag) => tag !== tagToRemove);
        setValue("tags", updatedTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: FormData) => {
        const file = data.image?.[0];
        if (!file) {
            toast.error("Image is required");
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "image") {
                formData.append("image", file);
            } else if (key === "tags" && Array.isArray(value)) {
                value.forEach((tag) => formData.append("tags", tag));
            } else {
                formData.append(key, value as string);
            }
        });

        mutate(formData as any, {
            onSuccess: () => {
                toast.success("Story uploaded successfully");
                onSuccess();
            },
            onError: () => {
                toast.error("Failed to upload story");
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
                            <Label>Title *</Label>
                            <Input placeholder="Story title" {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description *</Label>
                            <Textarea placeholder="Short description" {...register("description", { required: "Description is required" })} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        {/* Image */}
                        <div>
                            <Label>Image *</Label>
                            {imagePreview && (
                                <div className="relative mb-4">
                                    <img src={imagePreview} alt="Preview" className="max-h-64 rounded" />
                                    <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
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
                            <Label>Author *</Label>
                            <Input placeholder="Author name" {...register("author", { required: "Author is required" })} />
                            {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
                        </div>

                        {/* Category & Reading Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Category *</Label>
                                <Input placeholder="e.g. Fiction, History" {...register("categories", { required: "Category is required" })} />
                                {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
                            </div>

                            <div>
                                <Label className="flex gap-2 items-center"><Clock className="h-4 w-4" /> Estimated Reading Time</Label>
                                <Controller
                                    name="estimatedReadingTime"
                                    control={control}
                                    rules={{ required: "Estimated reading time is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
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
                            <div>
                                <Label className="flex gap-2 items-center"><MapPin className="h-4 w-4" /> Location</Label>
                                <Input placeholder="Story location" {...register("location", { required: "Location is required" })} />
                                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                            </div>

                            <div>
                                <Label className="flex gap-2 items-center"><Globe className="h-4 w-4" /> Language</Label>
                                <Controller
                                    name="language"
                                    control={control}
                                    rules={{ required: "Language is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="French">French</SelectItem>
                                                <SelectItem value="Spanish">Spanish</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <Label>Tags</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Add a tag"
                                    value={inputTag}
                                    onChange={(e) => setInputTag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <Button type="button" onClick={handleAddTag}>Add</Button>
                            </div>
                            <div className="flex flex-wrap mt-2 gap-2">
                                {(getValues("tags") || []).map((tag, index) => (
                                    <Badge key={index} className="flex items-center gap-1">
                                        {tag}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                       
                    </CardContent>

                    <CardFooter className="justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Uploading..." : "Submit Story"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
