"use client";

import { useAuth } from "@/features/auth-management";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

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
