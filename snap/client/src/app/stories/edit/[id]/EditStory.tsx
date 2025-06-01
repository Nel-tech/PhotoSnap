"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Clock, Globe } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoryForm } from "@/app/hooks/useStoryForm";
import { Countries, Languages } from '@/app/_Mock_/Helper';
import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";
import Image from "next/image";
import { getStory, updateStory } from "@/app/Api/Api";
import Nav from "@/components/Nav";

type StoryFormData = {
    title: string;
    author: string;
    description: string;
    image: FileList | null;
    categories: string;
    estimatedReadingTime: string;
    location: string;
    language: string;
    embedUrl:string;
    tags: string[];
};

export default function EditStoryForm() {
    const params = useParams();
    const router = useRouter();
    const storyId = typeof params.id === "string" ? params.id :
        Array.isArray(params.id) ? params.id[0] : null;

    if(!storyId){
        console.log('missing storyId')
    }
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset
    } = useForm<StoryFormData>();

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
    } = useStoryForm({ setValue });

    // Fetch story data
    const { data, error } = useQuery({
        queryKey: ['get-story', storyId],
        queryFn: () => {
            if (!storyId) throw new Error("Missing story ID");
            return getStory(storyId);
        },
        enabled: !!storyId, 
        staleTime: 1000 * 60 * 5,
        retry: 3,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (data) {
            reset({
                title: data.title || '',
                author: data.author || '',
                description: data.description || '',
                categories: data.categories || '',
                estimatedReadingTime: data.estimatedReadingTime || '',
                location: data.location || '',
                language: data.language || '',
                image: null, 
            });
            if (data.tags && Array.isArray(data.tags)) {
                setTags(data.tags);
            }
            if (data.image) {
                setImagePreview(data.image);
            }
        }
    }, [data, reset, setTags, setImagePreview]);
    const { mutate } = useMutation({
        mutationFn: updateStory,
        onSuccess: () => {
            toast.success("Story updated successfully");
            router.push("/upload-story");
            setIsSubmitting(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update story");
            setIsSubmitting(false);
        },
    });

   const onSubmit = (formData: StoryFormData) => {
    if (!storyId) {
        toast.error("Missing story ID");
        return;
    }

    setIsSubmitting(true);
    const requestData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        categories: formData.categories,
        estimatedReadingTime: formData.estimatedReadingTime,
        location: formData.location,
        language: formData.language,
        tags: tags // Send tags as an array directly
    };
    let requestPayload: FormData | object = requestData;

    if (formData.image && formData.image.length > 0) {
        const formDataToSend = new FormData();
        
        Object.entries(requestData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => formDataToSend.append(`${key}[]`, item));
            } else if (value !== undefined && value !== null) {
                formDataToSend.append(key, String(value));
            }
        });
        
        formDataToSend.append("image", formData.image[0]);
        
        requestPayload = formDataToSend;
    }
    
    console.log("Data being sent:", 
        requestPayload instanceof FormData 
            ? "[FormData with image]" 
            : requestPayload
    );
    mutate({ storyId:storyId, storyData: requestPayload });
};

    if (!storyId) return <div className="max-w-3xl mx-auto py-8 text-center">Missing story ID</div>;
    if (error) return <div className="max-w-3xl mx-auto py-8 text-center">Error: {(error as Error).message}</div>;

    return (
        <Protected allowedRoles={['user']}>

            <section>
                <Nav/>

            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Edit Story</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="border-none lg:border lg:border-black">
                        <CardHeader>
                            <CardTitle>Story Details</CardTitle>
                            <CardDescription>Update your story details below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="mb-2">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Story title"
                                    className="border-[2px] border-gray-400 focus:border-[1px] focus:border-gray-300 focus:ring-0 focus:outline-none placeholder:text-sm"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description" className="mb-2">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Short description"
                                    className="placeholder:text-sm"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>

                            {/* Image */}
                            <div>
                                <Label htmlFor="image" className="mb-2">Image</Label>
                                {imagePreview && (
                                    <div className="relative mb-4">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 rounded"
                                            width={400}
                                            height={300}
                                            priority
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => setImagePreview(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="text-sm file:text-sm file:px-4 file:py-2 file:border file:border-gray-300 file:rounded file:bg-white file:text-gray-700"
                                    {...register("image")}
                                    onChange={(e) => {
                                        register("image").onChange(e);
                                        handleImageChange(e);
                                    }}
                                />
                                <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                            </div>

                            {/* Author */}
                            <div>
                                <Label htmlFor="author" className="mb-2">Author</Label>
                                <Input
                                    id="author"
                                    placeholder="Author name"
                                    className="placeholder:text-sm"
                                    {...register("author", { required: "Author is required" })}
                                />
                                {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
                            </div>

                            {/* Category & Reading Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="categories" className="mb-2">Category</Label>
                                    <Input
                                        id="categories"
                                        placeholder="e.g. Fiction, History"
                                        className="placeholder:text-sm"
                                        {...register("categories", { required: "Category is required" })}
                                    />
                                    {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="estimatedReadingTime" className="flex gap-2 items-center mb-2">
                                        <Clock className="h-4 w-4" /> Estimated Reading Time
                                    </Label>
                                    <Controller
                                        name="estimatedReadingTime"
                                        control={control}
                                        rules={{ required: "Estimated reading time is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="estimatedReadingTime">
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
                                    <Label htmlFor="language" className="flex gap-2 items-center mb-2">
                                        <Globe className="h-4 w-4" /> Language
                                    </Label>
                                    <Controller
                                        name="language"
                                        control={control}
                                        rules={{ required: "Language is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="language">
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
                                    <Label htmlFor="location" className="flex gap-2 items-center mb-2">
                                        <Globe className="h-4 w-4" /> Location
                                    </Label>
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: "Location is required" }}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="location">
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md z-[9999]">
                                                    {Countries.map((country, index) => (
                                                        <SelectItem key={index} value={country.name}>
                                                            {country.name}
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
                                <Label htmlFor="tags" className="mb-2">Tags</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="tags"
                                        placeholder="E.g Adventure, Dreams, Fantasy"
                                        value={inputTag}
                                        onChange={(e) => setInputTag(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="placeholder:text-sm"
                                    />
                                    <Button type="button" onClick={handleAddTag}>Add</Button>
                                </div>
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={index} className="flex items-center gap-1">
                                            {tag}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => handleRemoveTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
            </section>
        </Protected>
    );
}