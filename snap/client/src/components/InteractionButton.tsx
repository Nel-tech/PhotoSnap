import { useMemo, useState, useEffect, useRef } from 'react';
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
  previousLocalState: boolean;
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

// Helper functions for localStorage
const getLocalStorageKey = (type: InteractionType, userId: string) => {
  return `user_${userId}_${type}s`;
};

const getLocalInteractionState = (type: InteractionType, userId: string, storyId: string): boolean => {
  try {
    const key = getLocalStorageKey(type, userId);
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    const interactions = JSON.parse(stored);
    return Array.isArray(interactions) && interactions.includes(storyId);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return false;
  }
};

const setLocalInteractionState = (type: InteractionType, userId: string, storyId: string, isActive: boolean) => {
  try {
    const key = getLocalStorageKey(type, userId);
    const stored = localStorage.getItem(key);
    let interactions = [];

    if (stored) {
      interactions = JSON.parse(stored);
      if (!Array.isArray(interactions)) interactions = [];
    }

    if (isActive && !interactions.includes(storyId)) {
      interactions.push(storyId);
    } else if (!isActive && interactions.includes(storyId)) {
      interactions = interactions.filter(id => id !== storyId);
    }

    localStorage.setItem(key, JSON.stringify(interactions));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

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
  const hasPendingMutation = useRef(false);

  // Local state for immediate UI feedback
  const [localState, setLocalState] = useState<boolean>(() => {
    if (!user?._id || !isAuthenticated) return false;
    return getLocalInteractionState(type, user._id, id);
  });

  // Fetch data from server
  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: [...queryKey, id],
    enabled: !!id && isAuthenticated,
    queryFn: () => getStatusFn(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2
  });

  // Server state
  const serverState = useMemo(() => {
    if (!user?._id || !data) return false;

    if (type === 'like') {
      return data.likedBy?.includes(user._id) || false;
    } else if (type === 'bookmark') {
      return data.bookmarkedBy?.includes(user._id) || false;
    }
    return false;
  }, [data, user, type]);

  // Sync localStorage with server state when data loads (but not during mutations)
  useEffect(() => {
    if (data && user?._id && !isLoading && !isError && !hasPendingMutation.current) {
      const currentLocalState = getLocalInteractionState(type, user._id, id);

      // Only sync if there's a significant difference and no pending mutation
      if (serverState !== currentLocalState) {
        setLocalInteractionState(type, user._id, id, serverState);
        setLocalState(serverState);
      }
    }
  }, [data, serverState, user?._id, type, id, isLoading, isError]);

  // Use local state for display
  const isActive = localState;

  // Handle interaction toggle with proper optimistic updates
  const { mutate: toggleInteraction, isPending } = useMutation<any, Error, void, MutationContext>({
    mutationFn: () => toggleFn(id),
    onMutate: async () => {
      hasPendingMutation.current = true;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKey, id] });

      // Snapshot the previous values
      const previousData = queryClient.getQueryData<StoryStatusResponse>([...queryKey, id]);
      const previousState = serverState;
      const previousLocalState = localState;
      const newLocalState = !localState;


      // Immediately update local state and localStorage
      if (user?._id) {
        setLocalState(newLocalState);
        setLocalInteractionState(type, user._id, id, newLocalState);
      }

      // Optimistically update the server cache
      if (previousData && user?._id) {
        const newData = { ...previousData };

        if (type === 'like') {
          if (newLocalState) {
            // Add user to likedBy array
            newData.likedBy = [...(newData.likedBy || []), user._id];
          } else {
            // Remove user from likedBy array
            newData.likedBy = (newData.likedBy || []).filter(userId => userId !== user._id);
          }
        } else if (type === 'bookmark') {
          if (newLocalState) {
            // Add user to bookmarkedBy array
            newData.bookmarkedBy = [...(newData.bookmarkedBy || []), user._id];
          } else {
            // Remove user from bookmarkedBy array
            newData.bookmarkedBy = (newData.bookmarkedBy || []).filter(userId => userId !== user._id);
          }
        }

        // Update the cache with optimistic data
        queryClient.setQueryData([...queryKey, id], newData);
      }

      return { previousState, previousData, previousLocalState };
    },
    onSuccess: () => {
      // Show success message
      toast.success(localState ?
        (type === 'like' ? 'Story Liked' : 'Story Bookmarked') :
        (type === 'like' ? 'Story Unliked' : 'Story Unbookmarked')
      );

      // Invalidate related queries but don't refetch immediately
      if (type === 'bookmark') {
        queryClient.invalidateQueries({ queryKey: ['get-user-bookmarks'] });
      } else if (type === 'like') {
        queryClient.invalidateQueries({ queryKey: ['get-user-likes'] });
      }

      // Invalidate any additional related query keys
      relatedQueryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [...key, id] });
      });

      // Reset the pending mutation flag after a delay to allow for natural refetch
      setTimeout(() => {
        hasPendingMutation.current = false;
      }, 1000);
    },
    onError: (error: any, _, context) => {
      hasPendingMutation.current = false;

      // Revert all changes on error
      if (context && user?._id) {

        // Revert local state
        setLocalState(context.previousLocalState);
        setLocalInteractionState(type, user._id, id, context.previousLocalState);

        // Revert server cache
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
        console.error('Interaction error:', error);
      }
    },
    onSettled: () => {
      // Reset pending flag when mutation is completely done
      setTimeout(() => {
        hasPendingMutation.current = false;
      }, 500);
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