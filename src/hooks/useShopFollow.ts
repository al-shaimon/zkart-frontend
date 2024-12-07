import { API_BASE_URL } from '@/config/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function useShopFollow() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const isCustomer = user?.role === 'CUSTOMER';

  const followShop = async (shopId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to follow shops');
      router.push('/auth/login');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/follow/${shopId}`, {
      method: 'POST',
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to follow shop');
    }

    toast.success('Shop followed successfully');
  };

  const unfollowShop = async (shopId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to unfollow shops');
      router.push('/auth/login');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/unfollow/${shopId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to unfollow shop');
    }

    toast.success('Shop unfollowed successfully');
  };

  return {
    followShop,
    unfollowShop,
    isCustomer,
  };
}
