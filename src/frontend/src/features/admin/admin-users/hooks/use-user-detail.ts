"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../services/user.service";
import { User, UserUpdateRequest, EUserGender } from "../types/user.type";
import { toast } from "sonner";

export function useUserDetail(id: string) {
  const router = useRouter();

  const [staff, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    roleId: "",
    gender: undefined as EUserGender | undefined,
    birthdate: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userService.getById(id);
        setUser(data as unknown as User);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          roleId: data.role?.id || "",
          gender: data.gender as EUserGender | undefined,
          birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : "",
          avatar: data.avatar || "",
        });
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to load staff details");
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: EUserGender) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, roleId: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form
      if (staff) {
        setFormData({
          name: staff.name,
          email: staff.email,
          phone: staff.phone || "",
          address: staff.address || "",
          roleId: staff.role?.id || "",
          gender: staff.gender as EUserGender | undefined,
          birthdate: staff.birthdate ? new Date(staff.birthdate).toISOString().split('T')[0] : "",
          avatar: staff.avatar || "",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update
      const updateData: UserUpdateRequest = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
        avatar: formData.avatar,
        roleId: formData.roleId ? parseInt(formData.roleId) : undefined,
      };

      await userService.update(id, updateData);
      toast.success("User updated successfully");
      setIsEditing(false);

      // Re-fetch to ensure data consistency
      const data = await userService.getById(id);
      setUser(data as unknown as User);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        roleId: data.role?.id || "",
        gender: data.gender as EUserGender | undefined,
        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : "",
        avatar: data.avatar || "",
      });
    } catch (error: unknown) {
      console.error("Save failed:", error);
      toast.error((error as Error).message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this staff?")) return;

    setSaving(true);
    const result = await userService.delete(id);
    setSaving(false);

    if (result.ok) {
      toast.success("User deleted successfully");
      router.push("/admin/users");
    } else {
      toast.error("Failed to delete user");
    }
  };

  return {
    staff,
    loading,
    saving,
    isEditing,
    formData,
    handleChange,
    handleEditToggle,
    handleRoleChange,
    handleGenderChange,
    handleSave,
    handleDelete,
  };
}
