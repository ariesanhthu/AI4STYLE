"use client";

import { useRolePage } from "../hooks/use-role-page";
import { RoleList } from "./role-list";
import { RoleForm } from "./role-form";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchBar } from "../../components";
import { Unauthorized } from "@/components/unauthorized";

export default function RoleManagementPage() {
  const {
    roles,
    loading,
    nextCursor,
    isFormOpen,
    setIsFormOpen,
    editingRole,
    isDeleteOpen,
    setIsDeleteOpen,
    roleToDelete,
    formLoading,
    refresh,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleFormSubmit,
    handleConfirmDelete,
    canPrev,
    isAuthorized,
  } = useRolePage();

  if (!isAuthorized) {
    return <Unauthorized returnPath="/admin" />;
  }

  return (
    <div className="admin-page-container space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="admin-title">Quản lý vai trò</h1>
          <p className="admin-description">
            Quản lý vai trò và phân quyền.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refresh} title="Làm mới">
            <RefreshCcw className="admin-icon" />
          </Button>
          <div className="flex-1 max-w-sm">
            <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm vai trò..." />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 admin-icon" />
            Thêm mới
          </Button>
        </div>
      </div>

      <RoleList
        roles={roles}
        loading={loading}
        nextCursor={nextCursor}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        canPrev={canPrev}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Create/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Cập nhật thông tin vai trò và quyền hạn."
                : "Thêm vai trò mới vào hệ thống."}
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            initialData={editingRole}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa vai trò</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vai trò &quot;{roleToDelete?.name}&quot;? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={formLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={formLoading}
            >
              {formLoading && <span className="mr-2 animate-spin">⏳</span>}
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
