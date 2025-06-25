'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { followShop, unfollowShop } from '@/actions/shops/followActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FollowButtonClientProps {
  shopId: string;
  isFollowing: boolean;
  className?: string;
}

export default function FollowButtonClient({
  shopId,
  isFollowing: initialIsFollowing,
  className,
}: FollowButtonClientProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const isCustomer = user?.role === 'CUSTOMER';

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow shops');
      router.push('/auth/login');
      return;
    }

    if (!isCustomer) {
      toast.error('Only customers can follow shops');
      return;
    }

    // Store previous state for potential rollback
    const previousState = isFollowing;

    // Optimistic update - update UI immediately
    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await unfollowShop(shopId);
        toast.success('Shop unfollowed successfully');
      } else {
        await followShop(shopId);
        toast.success('Shop followed successfully');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFollowing(previousState);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  // If user is not authenticated or is not a customer, wrap button in tooltip
  if (!isAuthenticated || !isCustomer) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button variant="outline" className={className} disabled={true}>
                Follow
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {!isAuthenticated
                ? 'Please login to follow shops'
                : 'Only customers can follow shops'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'outline'}
      className={className}
      onClick={handleClick}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
