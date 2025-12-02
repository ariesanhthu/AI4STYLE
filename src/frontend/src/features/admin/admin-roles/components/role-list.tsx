import { Role } from "../types/role.type";
import { RoleItem } from "./role-item";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface RoleListProps {
  roles: Role[];
  loading: boolean;
  nextCursor: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  canPrev: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleList({
  roles,
  loading,
  nextCursor,
  onNextPage,
  onPrevPage,
  canPrev,
  onEdit,
  onDelete
}: RoleListProps) {
  if (loading && roles.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="admin-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <RoleItem
                  key={role.id}
                  role={role}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="admin-pagination">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!canPrev || loading}
        >
          <ChevronLeft className="admin-icon" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!nextCursor || loading}
        >
          Next
          <ChevronRight className="admin-icon" />
        </Button>
      </div>
    </div>
  );
}
