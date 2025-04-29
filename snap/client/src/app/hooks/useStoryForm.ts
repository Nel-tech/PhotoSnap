import { useState, useEffect } from 'react'
// import { useForm} from "react-hook-form";
import { UseFormReturn } from "react-hook-form";

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
export const useStoryForm = (formMethods: UseFormReturn<FormData>) => {
     const {
        setValue,
        getValues,
    } = formMethods;

    const [tags, setTags] = useState<string[]>(getValues("tags") || []);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [inputTag, setInputTag] = useState("");

    useEffect(() => {
        setValue("tags", tags);
    }, [tags, setValue]);

   const handleAddTag = () => {
        const trimmed = inputTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            const updatedTags = [...tags, trimmed];
            setTags(updatedTags);
            setValue("tags", updatedTags)
            setInputTag("");
        }
    };
    
    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        setValue('tags', updatedTags);
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

  return {
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
    };
}
