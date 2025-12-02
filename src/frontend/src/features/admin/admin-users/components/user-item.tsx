import { User } from "../types/user.type";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";

interface UserItemProps {
  staff: User;
  onView: (staff: User) => void;
  onDelete: (staff: User) => void;
}

export function UserItem({ staff, onView, onDelete }: UserItemProps) {
  return (
    <TableRow>
      <TableCell>
        {staff.avatar ? (
          <img
            src={staff.avatar}
            alt={staff.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
            {staff.name.charAt(0).toUpperCase()}
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{staff.name}</TableCell>
      <TableCell>{staff.email}</TableCell>
      <TableCell>{staff.birthdate ? new Date(staff.birthdate).toLocaleDateString() : "-"}</TableCell>
      <TableCell>
        {staff.role ? (
          <Badge variant="outline">{staff.role.name}</Badge>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="admin-row-actions">
          <Button variant="ghost" size="icon" onClick={() => onView(staff)}>
            <Eye className="admin-icon" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(staff)} className="text-destructive hover:text-destructive">
            <Trash2 className="admin-icon" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
