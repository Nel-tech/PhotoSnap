import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Type definitions
type InteractionType = 'like' | 'bookmark';

type MutationContext = {
  previousState: boolean;
  previousData: StoryStatusResponse | undefined;
};

interface User {
  _id: string;
}

interface StoryStatusResponse {
  likedBy?: string[];
  bookmarkedBy?: string[];
}

interface InteractionButtonProps {
  id: string;
  user: User | null;
  isAuthenticated: boolean;
  type: InteractionType;
  getStatusFn: (id: string) => Promise<StoryStatusResponse>;
  toggleFn: (id: string) => Promise<any>;
  queryKey: string[];
  relatedQueryKeys?: string[][];
}

const InteractionButton: React.FC<InteractionButtonProps> = ({
  id,
  user,
  isAuthenticated,
  type,
  getStatusFn,
  toggleFn,
  queryKey,
  relatedQueryKeys = [],
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data from server
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: [...queryKey, id],
    enabled: !!id && isAuthenticated,
    queryFn: () => getStatusFn(id),
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent too frequent refetches
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: true,
    retry: 2
  });

  const isActive = useMemo(() => {
    if (!user?._id || !data) return false;

    if (type === 'like') {
      return data.likedBy?.includes(user._id) || false;
    } else if (type === 'bookmark') {
      return data.bookmarkedBy?.includes(user._id) || false;
    }
    return false;
  }, [data, user, type]);

  // Handle interaction toggle with proper optimistic updates
  const { mutate: toggleInteraction, isPending } = useMutation<any, Error, void, MutationContext>({
    mutationFn: () => toggleFn(id),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKey, id] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<StoryStatusResponse>([...queryKey, id]);
      const previousState = isActive;

      // Optimistically update the cache
      if (previousData && user?._id) {
        const newData = { ...previousData };

        if (type === 'like') {
          if (previousState) {
            // Remove user from likedBy array
            newData.likedBy = (newData.likedBy || []).filter(userId => userId !== user._id);
          } else {
            // Add user to likedBy array
            newData.likedBy = [...(newData.likedBy || []), user._id];
          }
        } else if (type === 'bookmark') {
          if (previousState) {
            // Remove user from bookmarkedBy array
            newData.bookmarkedBy = (newData.bookmarkedBy || []).filter(userId => userId !== user._id);
          } else {
            // Add user to bookmarkedBy array
            newData.bookmarkedBy = [...(newData.bookmarkedBy || []), user._id];
          }
        }

        // Update the cache with optimistic data
        queryClient.setQueryData([...queryKey, id], newData);
      }

      return { previousState, previousData };
    },
    onSuccess: () => {
      // Show success message
      const newState = !isActive; // This will be the new state after toggle
      toast.success(newState ?
        (type === 'like' ? 'Story Liked' : 'Story Bookmarked') :
        (type === 'like' ? 'Story Unliked' : 'Story Unbookmarked')
      );

      // Invalidate related queries (but not the current one immediately)
      if (type === 'bookmark') {
        queryClient.invalidateQueries({ queryKey: ['get-user-bookmarks'] });
      } else if (type === 'like') {
        queryClient.invalidateQueries({ queryKey: ['get-user-likes'] });
      }

      // Invalidate any additional related query keys
      relatedQueryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [...key, id] });
      });

      // Refetch after a short delay to ensure server has processed the update
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [...queryKey, id] });
      }, 1000);
    },
    onError: (error: any, _, context) => {
      // Revert the optimistic update
      if (context) {
        if (context.previousData) {
          queryClient.setQueryData([...queryKey, id], context.previousData);
        }
      }

      // Handle specific error cases
      if (error.message === 'No token found') {
        toast.error(`Please login to ${type} story`);
        router.push('/login');
      } else {
        toast.error(`Failed to update ${type} status`);
        console.error(error);
      }
    }
  });

  // Determine icon and text based on type
  const getIcon = () => {
    if (type === 'like') {
      return isActive ?
        <Heart className="h-5 w-5 fill-current" /> :
        <Heart className="h-5 w-5" />;
    } else if (type === 'bookmark') {
      return isActive ?
        <Bookmark className="h-5 w-5 fill-current" /> :
        <Bookmark className="h-5 w-5" />;
    }
  };

  const getText = () => {
    if (type === 'like') {
      return isActive ? "Liked" : "Like";
    } else if (type === 'bookmark') {
      return isActive ? "Bookmarked" : "Bookmark";
    }
  };

  const getColorClass = () => {
    if (type === 'like') {
      return isActive ? "text-red-500 hover:text-red-600" : "text-[#6b6b6b] hover:text-[#3c3c3c]";
    } else if (type === 'bookmark') {
      return isActive ? "text-blue-500 hover:text-blue-600" : "text-[#6b6b6b] hover:text-[#3c3c3c]";
    }
    return "";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleInteraction()}
      className={`${getColorClass()} hover:bg-[#f8f3ea] cursor-pointer transition-colors duration-200`}
      disabled={isLoading || isPending || !isAuthenticated}
    >
      {getIcon()}
      <span className="ml-2 hidden sm:inline">
        {getText()}
      </span>
    </Button>
  );
};

export default InteractionButton;