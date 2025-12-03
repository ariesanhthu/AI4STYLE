"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RoleSelect } from "@/features/admin/admin-roles/components/role-select";
import { userService } from "../services/user.service";
import { UserCreateRequest } from "../types/user.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UserCreateForm({
  open,
  onOpenChange,
  onSuccess,
}: UserCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name || !formData.roleId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const createData: UserCreateRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role_id: formData.roleId,
      };

      const result = await userService.create(createData);
      if (result && result.success) {
        toast.success("User created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          roleId: "",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error("Failed to create staff");
      }
    } catch (error: unknown) {
      console.error("Create staff failed:", error);
      toast.error((error as Error).message || "An error occurred while creating staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RoleSelect
              value={formData.roleId}
              onChange={(value) => handleChange("roleId", value)}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
