"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
              <CardDescription>
                Thông tin tài khoản AI4STYLE của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID</label>
                  <p className="text-base font-mono">{user?.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Tên</label>
                  <p className="text-base">{user?.name || "Chưa cập nhật"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-base">{user?.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Dữ liệu đầy đủ</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleLogout} variant="outline">
                  Đăng xuất
                </Button>
                <Button onClick={() => router.push("/")}>
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
