'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card } from '@/components/ui/card';
// import {
//   ClipboardList,
//   FileText,
//   User,
//   Lock,
//   BookmarkIcon,
//   MonitorIcon,
//   StarIcon,
//   CreditCard,
// } from 'lucide-react';
import ProfileInfo from '@/components/profile/ProfileInfo';
import OrderHistory from '@/components/profile/OrderHistory';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <div className="bg-card rounded-lg">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Profile Info
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Order History
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="profile">
                <ProfileInfo />
              </TabsContent>

              <TabsContent value="orders">
                <OrderHistory />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
