'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorProfile from '@/components/vendor/VendorProfile';
import VendorOrders from '@/components/vendor/VendorOrders';
import ShopForm from '@/components/vendor/ShopForm';
// import ProductForm from '@/components/vendor/ProductForm';
import ProductList from '@/components/vendor/ProductList';
import CouponList from '@/components/vendor/CouponList';
import ReviewList from '@/components/vendor/ReviewList';

export default function VendorDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'VENDOR') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

        <div className="bg-card rounded-lg">
          <Tabs defaultValue="shop" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none p-0">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="shop"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Shop Management
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Orders
              </TabsTrigger>

              <TabsTrigger
                value="coupons"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Coupons
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="shop">
                <ShopForm />
              </TabsContent>

              <TabsContent value="products">
                <ProductList />
              </TabsContent>

              <TabsContent value="orders">
                <VendorOrders />
              </TabsContent>

              <TabsContent value="profile">
                <VendorProfile />
              </TabsContent>

              <TabsContent value="coupons">
                <CouponList />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewList />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
