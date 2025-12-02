'use client'

import { useState, useEffect } from "react";
import { Role, RoleFormData, PermissionType } from "../types/role.type";

interface UseRoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function useRoleForm({ initialData, onSubmit }: UseRoleFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [permissions, setPermissions] = useState<PermissionType[]>(
    (initialData?.permissions as PermissionType[]) || []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setPermissions((initialData.permissions as PermissionType[]) || []);
    } else {
      setName("");
      setDescription("");
      setPermissions([]);
    }
  }, [initialData]);

  const handlePermissionChange = (permission: PermissionType) => {
    setPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      await onSubmit({
        name,
        description,
        permissions,
      });
    } catch (err) {
      console.error(err);
      // Assuming parent handles error display via toast/alert based on promise rejection or result
      // But here we can also set local error if needed.
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    permissions,
    handlePermissionChange,
    error,
    handleSubmit,
  };
}
