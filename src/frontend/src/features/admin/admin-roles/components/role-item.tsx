import { Role } from "../types/role.type";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface RoleItemProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleItem({ role, onEdit, onDelete }: RoleItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell>
        <Badge variant={role.type === 'admin' ? 'default' : 'secondary'}>
          {role.type}
        </Badge>
      </TableCell>
      <TableCell>{role.description || "-"}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {role.permissions.map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {permission}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="admin-row-actions">
          <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
            <Edit className="admin-icon" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(role)} className="text-destructive hover:text-destructive">
            <Trash2 className="admin-icon" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
