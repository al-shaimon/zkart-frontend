'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminProfile from '@/components/admin/AdminProfile';
import UserManagement from '@/components/admin/UserManagement';
import ShopManagement from '@/components/admin/ShopManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import TransactionMonitor from '@/components/admin/TransactionMonitor';
import ReviewMonitor from '@/components/admin/ReviewMonitor';

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-card rounded-lg">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="shops"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Shops
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="profile">
                <AdminProfile />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="shops">
                <ShopManagement />
              </TabsContent>

              <TabsContent value="categories">
                <CategoryManagement />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionMonitor />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewMonitor />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 