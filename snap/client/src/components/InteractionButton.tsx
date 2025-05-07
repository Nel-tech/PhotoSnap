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
  token: string | null;
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
  token,
  isAuthenticated,
  type,
  getStatusFn,
  toggleFn,
  queryKey,
  relatedQueryKeys = [],
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [optimisticState, setOptimisticState] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && user?._id) {
      const storageKey = `story_${type}_${id}_${user._id}`;
      const storedValue = localStorage.getItem(storageKey);
      return storedValue === 'true';
    }
    return false;
  });

  const getStorageKey = () => {
    return user?._id ? `story_${type}_${id}_${user._id}` : null;
  };

  // Fetch data from server
  const {
    data,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [...queryKey, id, token],
    enabled: !!id && !!token && isAuthenticated,
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

  // Handle localStorage and server state synchronization
  useEffect(() => {
   
    if (isAuthenticated && user?._id) {
      const storageKey = getStorageKey();
      if (!storageKey) return;

      const storedStatus = localStorage.getItem(storageKey);

      if (storedStatus === 'true') {
      
        setOptimisticState(true);
      } else if (isActive && !optimisticState) {

        setOptimisticState(true);
        localStorage.setItem(storageKey, 'true');
      } else if (storedStatus === null && isActive === false) {
       
        setOptimisticState(false);
      }
    } else {
      setOptimisticState(false);
    }
  }, [isActive, isAuthenticated, user, id, type]);

  
  useEffect(() => {
    const storageKey = getStorageKey();
    if (isAuthenticated && storageKey) {
      localStorage.setItem(storageKey, optimisticState.toString());
    }
  }, [optimisticState, isAuthenticated, user, id, type]);


const isDevelopment = process.env.NODE_ENV !== 'production';

useEffect(() => {
  if (isDevelopment) {
    ({
      optimisticState,
      serverStateActive: isActive,
      userId: user?._id,
      storageKey: getStorageKey(),
      localStorage: typeof window !== 'undefined' && getStorageKey() 
        ? localStorage.getItem(getStorageKey() || '') 
        : 'not-available'
    });
  }
}, [optimisticState, isActive, user, id, type]);




  // Handle interaction toggle
  const { mutate: toggleInteraction } = useMutation<any, Error, void, MutationContext>({
    mutationFn: () => toggleFn(id),
    onMutate: () => {
      const newState = !optimisticState;
      setOptimisticState(newState);

      const storageKey = getStorageKey();
      if (isAuthenticated && storageKey) {
        localStorage.setItem(storageKey, newState.toString());
      }

      return { previousState: optimisticState };
    },
    onSuccess: () => {
      // Show success message
      toast.success(optimisticState ?
        (type === 'like' ? 'Story Liked' : 'Story Bookmarked') :
        (type === 'like' ? 'Story Unliked' : 'Story Unbookmarked')
      );

     
      queryClient.invalidateQueries({ queryKey: [...queryKey, id] });

      relatedQueryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [...key, id] });
      });

      refetch();
    },
    onError: (error: any, _, context) => {
      if (context) {
        setOptimisticState(context.previousState);

        // Also roll back localStorage
        const storageKey = getStorageKey();
        if (isAuthenticated && storageKey) {
          localStorage.setItem(storageKey, context.previousState.toString());
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