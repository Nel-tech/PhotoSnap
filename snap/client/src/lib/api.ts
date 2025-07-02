import axios from 'axios';
import { SignupData, LoginData, Story, RequestToken, ResetPasswordRequest, StoryStatus, DeleteLikesResponse } from '../app/types/typed';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';


const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://photosnap-3gd6.onrender.com';


export const extractErrorMessage = (error: any, fallback = "Something went wrong") => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const Signup = async (data: SignupData) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/users/signup`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || "Something went wrong. Please try again.";
    
    if (process.env.NODE_ENV !== "production") {
      console.error("Signup error:", message);
    }

    return { status: "error", message };
  }
};

export const Login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/users/login`, data, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || "Unable to login. Please try again later.";

    if (process.env.NODE_ENV !== "production") {
      console.error("Login error:", message);
    }

    return { status: "error", message };
  }
};

export const getAllStory = async (): Promise<Story[] | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/public-stories`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });

    return response.data.stories;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching stories:", error);
    }
    return null; 
  }
};

export const getStory = async (storyId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/stories/get-story/${storyId}`,
      {
      
         headers: { "Content-Type": "application/json" }, 
      withCredentials: true
      }
    );
    return response.data.story;
  } catch (error: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error Response:", error.response?.data);
    }
    throw new Error(error.response?.data?.message || "Error fetching story");
  }
};

export const featuredStory = async () => {   
  try {     
    const response = await axios.get(`${API_URL}/api/v1/stories/featured-stories`, {       
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });     

    const data = response.data;
    
    if (data.firstValidStory) {
      return data.firstValidStory;
    }
    if (data.data && data.data.featuredStory) {
      return data.data.featuredStory;
    }
    if (data._id) {
      return data;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching featured story:', error);     
    throw new Error(extractErrorMessage(error, "Failed to fetch featured story"));   
  } 
};

export const updateStory = async ({ storyId, storyData }: { storyId: string; storyData: FormData | any }) => {
  try {
  
    if (storyData instanceof FormData) {
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    
      const response = await axios.put(
        `${API_URL}/api/v1/stories/edit-stories/${storyId}`,
        storyData,
        {
           headers: { "Content-Type": "application/json" }, 
      withCredentials: true
        }
      );
      return response.data;
    } else {
      const response = await axios.put(
        `${API_URL}/api/v1/stories/edit-stories/${storyId}`,
        storyData,
        {
           headers: { "Content-Type": "application/json" }, 
      withCredentials: true
        }
      );
      return response.data;
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error updating story");
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/users/getMe`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching user profile");
  }
};

export const storyDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/stories-details/${id}`, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data.story;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching Story Details");
  }
};

export const toggleBookmark = async (id: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/stories/book-mark/${id}`, {}, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error toggling bookmark");
  }
};

export const fetchUserBookmarks = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/getUserBookMarkedStories`, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch bookmarks");
    }

    return response.data.bookmarks || [];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching bookmarks");
  }
};

export const DeleteUserBookmarks = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/stories/delete-bookmark/${id}`, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error Deleting bookmark");
  }
};

export const DeleteUserLikes = async (id: string): Promise<DeleteLikesResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/stories/delete-likes/${id}`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error deleting user likes bookmark");
  }
};

export const LikeStoryAPI = async (id: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/stories/like-Story/${id}`,
      {},
      {
         headers: { "Content-Type": "application/json" }, 
      withCredentials: true
      }
    );
    
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error Liking story");
  }
};

export const fetchUserLikes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/get-user-likes`, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data.likes || [];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error Fetching user likes");
  }
};

export const viewStoryAPI = async (id: string) => { 
  try { 
    const response = await axios.post(
      `${API_URL}/api/v1/stories/story-views/${id}`,
      {}, 
      { 
        headers: { "Content-Type": "application/json" }, 
      withCredentials: true
      }
    ); 
    return response.data; 
  } catch (error: any) { 
    throw new Error(extractErrorMessage(error, "Unable to record story view")); 
  } 
};

export const getStoryStatus = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/get-story-status/${id}`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch story status"));
  }
};

export const getBookmarkedbyStatus = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/bookmarked-status/${id}`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch bookmark status"));
  }
};

export const handleSave = async (profileData: { name: string; email: string }) => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/users/updateMe`, profileData, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });

    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to update profile"));
  }
};

export const uploadStory = async (formData: FormData) => {
  try {
  

    const response = await axios.post(`${API_URL}/api/v1/stories/upload-story`, formData, {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data.story;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Error uploading story"));
  }
};

export const getUserUploadedStory = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/get-user-stories`, {
   headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data.stories;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to fetch user stories"));
  }
};

export const DeleteUserUploads = async (storyId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/stories/delete-User-Story/${storyId}`, {
    headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    toast.error(extractErrorMessage(error, "Failed to delete story"));
    throw error; 
  }
};

export const handleRequest = async (data: RequestToken) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/users/send-reset-token`, data, {
      headers: { "Content-Type": "application/json" }, 
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to request password reset"));
  }
};

export const handlePasswordReset = async (userData: ResetPasswordRequest) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/users/reset-password`, userData, {
      headers: { "Content-Type": "application/json" }, 
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to reset password"));
  }
};

// ADMIN ------
export const handleAdminNotification = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/send-notification`, {
      headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to notify admins"));
  }
};

export const getPendingStories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/stories/get-all-pending-stories`, {
 headers: { "Content-Type": "application/json" }, 
      withCredentials: true
    });
    return response.data.stories;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to get Pending stories"));
  }
};

export const UpdateStoryStatus = async ({ storyId, status }: StoryStatus) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/v1/stories/update-story-status/${storyId}`,
      { status }, 
      {
       headers: { "Content-Type": "application/json" }, 
      withCredentials: true
      }
    );

    return response.data.story;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, "Failed to update story status"));
  }
};