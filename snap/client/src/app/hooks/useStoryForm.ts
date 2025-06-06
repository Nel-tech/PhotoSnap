import { useState, useEffect } from 'react';
import {UseFormSetValue } from "react-hook-form";


type StoryFormData = {
  title: string;
  author: string;
  description: string;
  image: FileList | null; 
  categories: string;
  estimatedReadingTime: string;
  location: string;
  language: string;
  tags: string[];
  embedUrl:string;
};


interface UseStoryFormProps {
  setValue: UseFormSetValue<StoryFormData>;
  initialTags?: string[];
  initialImagePreview?: string | null;
}

export const useStoryForm = ({ setValue, initialTags = [], initialImagePreview = null }: UseStoryFormProps) => {
 
  const [tags, setTags] = useState<string[]>(initialTags);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImagePreview);
  const [inputTag, setInputTag] = useState("");


  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleAddTag = () => {
    const trimmed = inputTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updatedTags = [...tags, trimmed];
      setTags(updatedTags);
      setValue("tags", updatedTags);
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
};