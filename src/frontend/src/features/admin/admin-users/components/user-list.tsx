import { User } from "../types/user.type";
import { UserItem } from "./user-item";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface UserListProps {
  staffs: User[];
  loading: boolean;
  nextCursor: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  canPrev: boolean;
  onView: (staff: User) => void;
  onDelete: (staff: User) => void;
}

export function UserList({
  staffs,
  loading,
  nextCursor,
  onNextPage,
  onPrevPage,
  canPrev,
  onView,
  onDelete
}: UserListProps) {
  if (loading && staffs.length === 0) {
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
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Birth</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No staff found.
                </TableCell>
              </TableRow>
            ) : (
              staffs.map((staff) => (
                <UserItem
                  key={staff.id}
                  staff={staff}
                  onView={onView}
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
