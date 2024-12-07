'use client';

import { Button } from '@/components/ui/button';
import { useShopFollow } from '@/hooks/useShopFollow';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { ShopFollower } from '@/types/api';

interface FollowButtonProps {
  shopId: string;
  isFollowing: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  shopId,
  isFollowing: initialIsFollowing,
  className,
  onFollowChange,
}: FollowButtonProps) {
  const {  followShop, unfollowShop, isCustomer } = useShopFollow();
  const { isAuthenticated, user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current follow status when component mounts
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!user?.email) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/shop/${shopId}`);
        const data = await response.json();
        
        if (data.success) {
          // Check if current user is in followers list
          const isUserFollowing = data.data.followers.some(
            (follower: ShopFollower) => follower.customer?.email === user.email
          );
          setIsFollowing(isUserFollowing);
        }
      } catch (error) {
        console.error('Failed to fetch shop details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId, user?.email]);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (isFollowing) {
        await unfollowShop(shopId);
      } else {
        await followShop(shopId);
      }
      setIsFollowing(!isFollowing);
      onFollowChange?.(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow shop:', error);
    } finally {
      setIsLoading(false);
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
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </Button>
  );
}
