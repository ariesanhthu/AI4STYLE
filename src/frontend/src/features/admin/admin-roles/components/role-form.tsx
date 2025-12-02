import { useRoleForm } from "../hooks/use-role-form";
import { PERMISSIONS, Role, RoleFormData } from "../types/role.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function RoleForm({ initialData, onSubmit, onCancel, loading }: RoleFormProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    permissions,
    handlePermissionChange,
    error,
    handleSubmit,
  } = useRoleForm({ initialData, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter role name"
          disabled={loading}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Permissions</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto border rounded-md p-4">
          {PERMISSIONS.map((permission: any) => (
            <div key={permission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`perm-${permission}`}
                checked={permissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
                disabled={loading}
                className="admin-icon rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor={`perm-${permission}`} className="text-sm font-normal cursor-pointer">
                {permission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 admin-icon animate-spin" />}
          {initialData ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}
