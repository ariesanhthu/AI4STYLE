"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { profileService } = await import("../services/profile.service");
        const profileData = await profileService.getProfile();
        
        setFormData({
          name: profileData.name || user?.name || "",
          email: profileData.email || user?.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
        });
      } catch (error) {
        console.error("[ProfileForm] Error loading profile:", error);
        // Fallback to user data from auth context
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          address: "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { profileService } = await import("../services/profile.service");
      await profileService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      // Update user in context
      if (user) {
        updateUser({
          ...user,
          name: formData.name,
        });
      }

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Đang tải thông tin...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing || loading}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email không thể thay đổi</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing || loading}
              placeholder="0123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing || loading}
              placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
            />
          </div>

          {message && (
            <Alert 
              variant={message.type === "error" ? "destructive" : "default"}
              className={message.type === "success" ? "border-green-500 bg-green-50 text-green-700" : ""}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button type="submit" disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      phone: "",
                      address: "",
                    });
                    setMessage(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Chỉnh sửa thông tin
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
