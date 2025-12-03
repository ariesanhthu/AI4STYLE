"use client";

import { useUserPage } from "../hooks/use-user-page";
import { UserList } from "./user-list";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchBar } from "@/features/admin/components";

import { UserCreateForm } from "./user-create-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EUserType } from "../types/user.type";

import { Unauthorized } from "@/features/admin/components";

export function UserManagementPage() {
  const {
    staffs,
    loading,
    nextCursor,
    isDeleteOpen,
    setIsDeleteOpen,
    isCreateOpen,
    setIsCreateOpen,
    staffToDelete,
    actionLoading,
    refresh,
    handleSearch,
    handleTypeChange,
    type,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleCreate,
    handleDeleteClick,
    handleConfirmDelete,
    canPrev,
    isAuthorized,
  } = useUserPage();

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="admin-page-container space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="admin-title">User Management</h1>
          <p className="admin-description">
            Manage staff members and their roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refresh} title="Refresh">
            <RefreshCcw className="admin-icon" />
          </Button>
          <div className="flex-1 max-w-sm">
            <SearchBar onSearch={handleSearch} placeholder="Search staff..." />
          </div>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EUserType.ADMIN}>Admin</SelectItem>
              <SelectItem value={EUserType.STAFF}>Staff</SelectItem>
              <SelectItem value={EUserType.GUEST}>Guest</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 admin-icon" />
            Add New
          </Button>
        </div>
      </div>

      <UserList
        staffs={staffs}
        loading={loading}
        nextCursor={nextCursor}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        canPrev={canPrev}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

      <UserCreateForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={refresh}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user &quot;{staffToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
            >
              {actionLoading && <span className="mr-2 admin-icon animate-spin">⏳</span>}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
