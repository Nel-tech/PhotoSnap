'use client'

import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {
  getAllStory,
  handleSave,
  fetchUserProfile,
  getStory,
  updateStory,
  storyDetails,
  viewStoryAPI,
  uploadStory,
  getUserUploadedStory,
  fetchUserLikes,
 fetchUserBookmarks,
 DeleteUserLikes,
 DeleteUserBookmarks,
 handlePasswordReset,
 handleRequest,
 handleAdminNotification,
 getPendingStories,
 UpdateStoryStatus

} from "../api/api";
import { Story, Profile,StoryStatus } from "../types/typed";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";


// Get All stories
export const useGetStory = (): UseQueryResult<Story[], Error> => {
  return useQuery({
    queryKey: ["public-stories"],
    queryFn: getAllStory,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery<Profile, Error>({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleSave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
};



export const useStoryId = () => {
  const params = useParams();
  const storyId = typeof params.id === "string" ? params.id :
    Array.isArray(params.id) ? params.id[0] : null;

  return useQuery({
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
};

export const useUpdateStory = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: updateStory,
    onSuccess: () => {
      toast.success("Story updated successfully");
      router.push("/upload-story");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update story");
    },
  });
};

export const useStoriesDetails = (id: string) =>{

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

     return useQuery({
        queryKey: ["get-story-by-id", id],
        queryFn: () => storyDetails(id),
       enabled: !!user && !!isAuthenticated && !!id,
        staleTime: 1000 * 60 * 5,
        retry: 3,
        refetchOnWindowFocus: false,
      });
}

export const useViewStories = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const viewQueryKey = ['view-story', id];
  const storyQueryKey = ['get-story-by-id', id];

  return useMutation({
    mutationFn: () => viewStoryAPI(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: viewQueryKey });
      await queryClient.cancelQueries({ queryKey: storyQueryKey });
      const previousData = queryClient.getQueryData(storyQueryKey);

      queryClient.setQueryData(storyQueryKey, (old: any) => {
        if (old) {
          return {
            ...old,
            views: typeof old.views === 'number' ? old.views + 1 : 1,
          };
        }
        return old;
      });

      return { previousData };
    },
    onError: (error: any, _, context) => {
      if (error.message === 'No token found') {
        toast.error('Please login to view story');
        router.push('/login');
      } else {
        toast.error('Failed to record story view');
      }
      queryClient.setQueryData(storyQueryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: viewQueryKey });
      queryClient.invalidateQueries({ queryKey: storyQueryKey });
    },
  });
};

export const useUploadStory = () => {
  return useMutation<FormData, any, FormData>({
    mutationFn: uploadStory,
    onSuccess: () => {
      toast.success("Story successfully Uploaded.");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to upload story.";
      toast.error(errorMessage);
      console.error("Failed to upload story:", error);
    },
  });
};

export const useUploadedStories = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["userStories"],
    queryFn: getUserUploadedStory,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const useUserBookmarkedStories = () => {
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<Story[], Error>({
        queryKey: ['get-user-bookmarks'],
        queryFn: fetchUserBookmarks,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        retry: 3,
        refetchOnWindowFocus: false,
    });
}

export const useUserLikedStories = () => {
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<Story[], Error>({
        queryKey: ['get-user-bookmarks'],
        queryFn: fetchUserLikes,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
        retry: 3,
        refetchOnWindowFocus: false,
    });
}

export const useDeleteUserBookmarks=()=> {
   const queryClient = useQueryClient();
  return useMutation({
        mutationFn: (id: string) => DeleteUserLikes(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['get-user-likes'] });
            const previousBookmarks = queryClient.getQueryData<Story[]>(['get-user-bookmarks']);
            queryClient.setQueryData<Story[]>(['get-user-bookmarks'], (old) =>
                old ? old.filter((bookmark) => bookmark._id !== id) : []
            );

            return { previousBookmarks };
        },
        onError: (error: any, _, context) => {
            toast.error("Failed to delete bookmark.");
            queryClient.setQueryData(['get-user-bookmarks'], context?.previousBookmarks);
        },
        onSuccess: () => {
            toast.success("Bookmark deleted successfully.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['get-user-likes'] });
        },
    });
}

export const useDeleteUserLikes =()=> {
    const queryClient = useQueryClient();
return useMutation({
        mutationFn: (id: string) =>  DeleteUserBookmarks(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['get-user-bookmarks'] });

            const previousBookmarks = queryClient.getQueryData<Story[]>(['get-user-bookmarks']);
            queryClient.setQueryData<Story[]>(['get-user-bookmarks'], (old) =>
                old ? old.filter((bookmark) => bookmark._id !== id) : []
            );

            return { previousBookmarks };
        },
        onError: (error: any, _, context) => {
            toast.error("Failed to delete bookmark.");
            queryClient.setQueryData(['get-user-bookmarks'], context?.previousBookmarks);
        },
        onSuccess: () => {
            toast.success("Bookmark deleted successfully.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['get-user-bookmarks'] });
        },
    });
}

export const useHandleRequestToken = () => {
  return useMutation({
    mutationFn: handleRequest,
    onSuccess: (data: any) => {
      if (data.alreadyExists) {
        toast.custom(`Please wait ${data.waitTime} minute(s) before requesting another token.`);
      } else {
        toast.success("Reset token generated successfully.");
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to request reset token.";
      toast.error(errorMessage);
    },
  });
};


export const useHandleResetPassword = () => {
  return useMutation({
    mutationFn: handlePasswordReset,
    onSuccess: async () => {
      toast.success("Password reset successfully.");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to reset password.";
      toast.error(errorMessage);
      console.error("Password reset error:", error);
    },
  });
};

export const useNotification = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["admin-notification"],
    queryFn: handleAdminNotification,
    enabled: !!isAuthenticated && isAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const usePendingStories = () => {
   const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["pending-stories"],
    queryFn:  getPendingStories,
    enabled: !!isAuthenticated && isAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export const useUpdateStoryStatus = () => {
  return useMutation({
    mutationFn: UpdateStoryStatus,
    mutationKey: ["update-story-status"],
    onError: (error: any) => {
      console.error("Error updating story status:", error.message);
    },
  });
};
