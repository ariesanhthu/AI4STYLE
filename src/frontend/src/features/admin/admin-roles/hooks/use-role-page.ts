'use client'

import { useState, useEffect } from "react";
import { useRoles } from "./use-roles";
import { useRoleMutation } from "./use-role-mutations";
import { Role, RoleFormData } from "../types/role.type";
import { toast } from "sonner";

export function useRolePage() {
  const { roles, loading, nextCursor, fetchRoles, refresh, isAuthorized } = useRoles();
  const { createRole, updateRole, deleteRole } = useRoleMutation();

  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Pagination State
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  // Initial fetch
  useEffect(() => {
    fetchRoles({ search: searchQuery });
  }, [fetchRoles, searchQuery]);

  const handleSearch = (value: string) => {
    if (value === '') {
      setSearchQuery(undefined);
    } else {
      console.log(value);
      fetchRoles({ search: value });
      setSearchQuery(value);
    }
    // TODO: Implement search in backend or filter locally if backend doesn't support it yet
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
      fetchRoles({ cursor: nextCursor });
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;

    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();

    setCursorHistory(newHistory);
    setCurrentCursor(prevCursor);
    fetchRoles({ cursor: prevCursor });
  };

  const handleRefresh = () => {
    refresh();
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleCreate = () => {
    setEditingRole(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: RoleFormData) => {
    setFormLoading(true);
    let result;

    if (editingRole) {
      result = await updateRole(editingRole.id, data);
    } else {
      result = await createRole(data);
    }

    setFormLoading(false);

    if (result.ok) {
      setIsFormOpen(false);
      handleRefresh(); // Refresh list to show changes
      toast.success('Role saved successfully');
    } else {
      toast.error(result.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    setFormLoading(true);
    const result = await deleteRole(roleToDelete.id);
    setFormLoading(false);

    if (result.ok) {
      setIsDeleteOpen(false);
      setRoleToDelete(null);
      handleRefresh();
      toast.success('Role deleted successfully');
    } else {
      toast.error(result.error);
    }
  };

  return {
    // Data
    roles,
    loading,
    nextCursor,

    // State
    isFormOpen,
    setIsFormOpen,
    editingRole,
    searchQuery,
    isDeleteOpen,
    setIsDeleteOpen,
    roleToDelete,
    formLoading,

    // Handlers
    refresh: handleRefresh,
    canPrev: cursorHistory.length > 0,
    isAuthorized,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleFormSubmit,
    handleConfirmDelete,
  };
}
