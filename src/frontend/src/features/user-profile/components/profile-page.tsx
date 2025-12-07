"use client";

import Link from "next/link";
import { RequireAuth } from "@/features/auth-management";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader as UserProfileHeader } from "./profile-header";
import { ProfileForm } from "./profile-form";
import { ProfileHeader } from "@/components/layout/ProfileHeader";
import { Footer } from "@/components/layout/Footer";

export function ProfilePage() {
  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <ProfileHeader />

        {/* Content */}
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
            {/* User Profile Header */}
            <UserProfileHeader />

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Thông tin</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <ProfileForm />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">Chưa có đơn hàng nào</p>
                  <p className="text-sm mb-4">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                  <Link href="/shop">
                    <Button>Khám phá sản phẩm</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </RequireAuth>
  );
}
