"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "./use-user";
import { userService } from "../services/user.service";
import { EUserType, User } from "../types/user.type";
import { toast } from "sonner";

export function useUserPage() {
  const router = useRouter();
  const { staffs, loading, nextCursor, fetchUsers, refresh, isAuthorized } = useUsers();

  // State
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [type, setType] = useState<EUserType>(EUserType.STAFF);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination State
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  // Initial fetch
  useEffect(() => {
    fetchUsers({ type, search: searchQuery });
  }, [fetchUsers, type, searchQuery]);

  const handleSearch = (value: string) => {
    if (value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
    // TODO: Implement search in backend or filter locally
  };

  const handleTypeChange = (value: EUserType) => {
    setType(value);
    setCursorHistory([]);
    setCurrentCursor(undefined);
    // Reset pagination or cache if needed, but fetchUsers handles it via params
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
      fetchUsers({ cursor: nextCursor, type });
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;

    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();

    setCursorHistory(newHistory);
    setCurrentCursor(prevCursor);
    fetchUsers({ cursor: prevCursor, type });
  };

  const handleRefresh = () => {
    refresh();
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleView = (staff: User) => {
    console.log(staff);
    router.push(`/admin/users/${staff.id}`);
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
      handleRefresh();
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
    refresh: handleRefresh,
    canPrev: cursorHistory.length > 0,
    handleSearch,
    handleTypeChange,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleCreate,
    handleDeleteClick,
    handleConfirmDelete,
    isAuthorized,
  };
}
