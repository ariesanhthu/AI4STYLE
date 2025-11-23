"use client";

import { useAuth } from "@/features/auth-management";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name || "Người dùng"}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2">
              <Badge variant="secondary">Thành viên</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
