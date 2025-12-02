'use client'

import { useEffect } from "react";
import { useRoles } from "../hooks/use-roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RoleSelect({
  value,
  onChange,
  placeholder = "Select a role",
  disabled = false,
}: RoleSelectProps) {
  const { roles, loading, fetchRoles } = useRoles();

  useEffect(() => {
    fetchRoles({ limit: "100" });
  }, [fetchRoles]);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
