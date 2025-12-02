"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "./use-user";
import { userService } from "../services/user.service";
import { User } from "../types/user.type";
import { toast } from "sonner";

export function useUserPage() {
  const router = useRouter();
  const { staffs, loading, nextCursor, fetchUsers, refresh } = useUsers();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("admin");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchUsers({ type });
  }, [fetchUsers, type]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // TODO: Implement search in backend or filter locally
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    // Reset pagination or cache if needed, but fetchUsers handles it via params
  };

  const handleNextPage = () => {
    if (nextCursor) {
      fetchUsers({ cursor: nextCursor, type });
    }
  };

  const handlePrevPage = () => {
    console.log("Prev page not implemented yet");
  };

  const handleView = (staff: User) => {
    console.log(staff);
    router.push(`/admin/staffs/${staff.id}`);
  };

  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  const handleDeleteClick = (staff: User) => {
    setUserToDelete(staff);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    setActionLoading(true);
    const result = await userService.delete(staffToDelete.id);
    setActionLoading(false);

    if (result.ok) {
      setIsDeleteOpen(false);
      setUserToDelete(null);
      refresh();
      toast.success('User deleted successfully');
    } else {
      toast.error("Failed to delete staff");
    }
  };

  return {
    staffs,
    loading,
    nextCursor,
    searchQuery,
    type,
    isDeleteOpen,
    setIsDeleteOpen,
    isCreateOpen,
    setIsCreateOpen,
    staffToDelete,
    actionLoading,
    refresh,
    handleSearch,
    handleTypeChange,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleCreate,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
