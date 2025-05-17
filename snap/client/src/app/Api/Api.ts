import axios, { AxiosResponse } from 'axios';
import cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get the authentication token from cookies
 * @returns {string|null} The authentication token or null if not found
 */
const getToken = () => {
  return cookie.get("token") || null;
};


export const getStory = async (storyId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("You need to be logged in");
    }
    
    const response = await axios.get(
      `${API_URL}api/v1/stories/get-story/${storyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.log(error)
    console.error('API Error Response:', error.response?.data);
    console.error('Request URL:', `${API_URL}api/v1/get-story/${storyId}`);
    throw new Error(
      error.response?.data?.message || "Error fetching story"
    );
  }
};


export const updateStory = async ({ storyId, storyData }: { storyId: string; storyData: FormData | any }) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("You need to be logged in");
    }

    // console.log("Updating story with ID:", storyId);

    // if (storyData instanceof FormData) {
    //   console.log("Form data keys:", [...storyData.keys()]);
    // } else {
    //   console.log("Sending JSON data:", storyData);

    // }
    const response = await axios.put(
      `${API_URL}api/v1/stories/edit-stories/${storyId}`,
      storyData,
      {
       headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": storyData instanceof FormData ? "multipart/form-data" : "application/json",
        },
      }
    );

   
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error updating story"
    );
  }
};

export const fetchUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${API_URL}api/v1/users/getMe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    return error;
  }
};

export const toggleBookmark = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');
    
    const res = await axios.post(`${API_URL}api/v1/stories/book-mark/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const fetchUserBookmarks = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${API_URL}api/v1/stories/getUserBookMarkedStories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to fetch bookmarks");
    }

    return res.data.data || [];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error fetching bookmarks");
  }
};


export const removeBookmark = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');

    const res = await axios.delete(`${API_URL}api/v1/stories/delete-bookmark/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const removeLikes = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');

    const res = await axios.delete(`${API_URL}api/v1/stories/delete-likes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const fetchUserLikes = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${API_URL}api/v1/stories/get-user-likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const LikeStoryAPI = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No token found');
    
    const res = await axios.post(
      `${API_URL}api/v1/stories/like-Story/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const viewStoryAPI = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('no token found');
    
    const res = await axios.post(
      `${API_URL}api/v1/stories/story-views/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const getStoryStatus = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('no token found');
 
    const res = await axios.get(
      `${API_URL}api/v1/stories/get-story-status/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const getBookmarkedbyStatus = async (id: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('no token found');
    
    const res = await axios.get(
      `${API_URL}api/v1/stories/bookmarked-status/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error: any) {
    return error;
  }
};

export const handleSave = async (profileData: { name: string; email: string }) => {
  try {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await axios.patch(
      `${API_URL}api/v1/users/updateMe`,
      {
        name: profileData.name,
        email: profileData.email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to update profile");
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("Failed to update profile");
    }
  }
};

export const handlePasswordUpdate = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
}) => {
  try {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await axios.patch(
      `${API_URL}api/v1/users/updatePassword`, 
      passwordData, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update password");
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Status:", error.response?.status); 
      console.error("Axios Error Data:", error.response?.data); 
      console.error("Axios Error Headers:", error.response?.headers);

      return error.response?.data?.message || "Failed to update password";
    } else {
      console.error("Unexpected Error:", error);
      return "Failed to update password";
    }
  }
};