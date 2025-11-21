"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth, useAuth } from "@/features/auth-management";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./profile-header";
import { ProfileForm } from "./profile-form";

export function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              AI4STYLE
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Profile Header */}
            <ProfileHeader />

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
        </main>
      </div>
    </RequireAuth>
  );
}
