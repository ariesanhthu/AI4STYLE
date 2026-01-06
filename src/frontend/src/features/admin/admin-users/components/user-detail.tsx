"use client";

import { useUserDetail } from "../hooks/use-user-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelect } from "@/features/admin/admin-roles/components/role-select";
import { Loader2, ArrowLeft, Save, X, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EUserGender } from "../types/user.type";

interface UserDetailPageProps {
  id: string;
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const {
    staff,
    loading,
    saving,
    isEditing,
    formData,
    handleChange,
    handleEditToggle,
    handleRoleChange,
    handleGenderChange,
    handleDelete,
    handleSave,
  } = useUserDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!staff) {
    return <div>Không tìm thấy người dùng</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {staff?.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                <Pencil className="mr-2 h-4 w-4" />
                Thay đổi
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="ghost" onClick={handleEditToggle} disabled={saving}>
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Lưu
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1 space-y-4">
          <div className="border rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Avatar"
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            {isEditing && (
              <div className="w-full">
                <Label htmlFor="avatar">Đường dẫn Avatar</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                disabled={!isEditing}
                value={formData.gender}
                onValueChange={(value) => handleGenderChange(value as EUserGender)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EUserGender.MALE}>Nam</SelectItem>
                  <SelectItem value={EUserGender.FEMALE}>Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={staff.email}
                onChange={handleChange}
                disabled={true} // Email is immutable
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Ngày sinh</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vai trò</Label>
            {isEditing ? (
              <RoleSelect
                value={formData.roleId}
                onChange={handleRoleChange}
                disabled={false}
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted/20">
                {staff?.role?.name || "Chưa phân quyền"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Quyền hạn</Label>
            <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/50 min-h-[60px]">
              {staff?.role?.permissions && staff.role.permissions.length > 0 ? (
                staff.role.permissions.map((perm) => (
                  <Badge key={perm} variant="secondary">
                    {perm}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">Chưa có quyền hạn</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
