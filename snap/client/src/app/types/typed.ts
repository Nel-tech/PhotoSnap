import { ReactNode } from "react";

 export interface SignupData{
    name:string;
    email:string;
    password:string;
    passwordConfirm: string
 }

 export interface LoginData{
     email:string;
    password:string;
 }

 export interface Story{
    id: string;
    _id: string;
    title: string;
    author: string;
    image: string;
    description: string;
    summary?: string;
    date: string;
    estimatedReadingTime: string;
    categories?: string[];
    tags?: string[];
    location?: string;
    language?: string;
    bookmarked?: boolean;
    views: number;
    like: number;
    status:string;
 }
 export interface GetAllStoriesResponse {
  success: boolean;
  stories: Story[];
}
 export interface Profile  {
  data: {
    user: {
      email: string;
      password?: string;
      name: string;
    };
  };
};

export interface StoryFormData  {
    title: string;
    author: string;
    description: string;
    image: FileList | null;
    categories: string;
    estimatedReadingTime: string;
    location: string;
    language: string;
    embedUrl: string;
    tags: string[];
};
export interface RequestToken {
email:string
}

export interface DeleteLikesResponse {
  success: boolean;
  message: string;
  // Add other properties that your API returns
}

export interface ResetPasswordRequest{
  resetToken:string; 
  newPassword:string;
}

export interface AdminResponse{
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
    status: "Pending" | "Published" | "Rejected"
}

export interface SignalProps {
    children:ReactNode
}
export interface StoryStatus{
   status: "Pending" | "Published" | "Rejected"
   storyId:string; 
}