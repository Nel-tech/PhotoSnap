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

  // Remove localStorage dependency for optimistic state
  const [optimisticState, setOptimisticState] = useState<boolean>(false);

  // Fetch data from server
  const {
    data,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [...queryKey, id],
    enabled: !!id && isAuthenticated,
    queryFn: () => getStatusFn(id),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2
  });

  const isActive = useMemo(() => {
    if (type === 'like') {
      if (!data?.likedBy || !user?._id) return false;
      return data.likedBy.includes(user._id);
    } else if (type === 'bookmark') {
      if (!data?.bookmarkedBy || !user?._id) return false;
      return data.bookmarkedBy.includes(user._id);
    }
    return false;
  }, [data, user, type]);

  // Sync optimistic state with server data
  useEffect(() => {
    if (data && user?._id) {
      setOptimisticState(isActive);
    } else {
      setOptimisticState(false);
    }
  }, [isActive, data, user]);

  // Handle interaction toggle
  const { mutate: toggleInteraction } = useMutation<any, Error, void, MutationContext>({
    mutationFn: () => toggleFn(id),
    onMutate: () => {
      const newState = !optimisticState;
      setOptimisticState(newState);
      return { previousState: optimisticState };
    },
    onSuccess: () => {
      // Show success message
      toast.success(optimisticState ?
        (type === 'like' ? 'Story Liked' : 'Story Bookmarked') :
        (type === 'like' ? 'Story Unliked' : 'Story Unbookmarked')
      );

      // Invalidate all related queries including user bookmarks/likes
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });

      // Invalidate user bookmarks and likes queries
      if (type === 'bookmark') {
        queryClient.invalidateQueries({ queryKey: ['get-user-bookmarks'] });
      } else if (type === 'like') {
        queryClient.invalidateQueries({ queryKey: ['get-user-likes'] });
      }

      // Invalidate any additional related query keys
      relatedQueryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [...key, id] });
      });

      // Refetch current story status
      refetch();
    },
    onError: (error: any, _, context) => {
      if (context) {
        setOptimisticState(context.previousState);
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
      return optimisticState ?
        <Heart className="h-5 w-5 fill-current" /> :
        <Heart className="h-5 w-5" />;
    } else if (type === 'bookmark') {
      return optimisticState ?
        <Bookmark className="h-5 w-5 fill-current" /> :
        <Bookmark className="h-5 w-5" />;
    }
  };

  const getText = () => {
    if (type === 'like') {
      return optimisticState ? "Liked" : "Like";
    } else if (type === 'bookmark') {
      return optimisticState ? "Bookmarked" : "Bookmark";
    }
  };

  const getColorClass = () => {
    if (type === 'like') {
      return optimisticState ? "text-red-500 hover:text-red-600" : "text-[#6b6b6b] hover:text-[#3c3c3c]";
    } else if (type === 'bookmark') {
      return optimisticState ? "text-blue-500 hover:text-blue-600" : "text-[#6b6b6b] hover:text-[#3c3c3c]";
    }
    return "";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleInteraction()}
      className={`${getColorClass()} hover:bg-[#f8f3ea] cursor-pointer transition-colors duration-200`}
      disabled={isLoading || !isAuthenticated}
    >
      {getIcon()}
      <span className="ml-2 hidden sm:inline">
        {getText()}
      </span>
    </Button>
  );
};

export default InteractionButton;