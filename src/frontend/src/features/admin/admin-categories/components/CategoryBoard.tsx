"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CategoryDialog } from "./CategoryDialog"
import { CategoryTreeItemWithLevel } from "../types/category.type"
import { useCategory, useCategoryDialog } from "../hooks/use-admin-category"


import { Spinner } from "@/components/ui/spinner"

export function CategoryBoard() {
  const {
    data, tableData,
    reFetch, handleAdd, handleDelete,
    handleEdit, isDialogOpen,
    setIsDialogOpen, selectedCategory, setSelectedCategory,
    isLoading, deletingId,
    setDeletingId, isError,
    error, columnFilters,
    rowSelection,
    setColumnFilters,
    setRowSelection
  } = useCategory()


  const columns: ColumnDef<CategoryTreeItemWithLevel>[] = React.useMemo(() => [
    {
      accessorKey: "icon",
      header: ({ column }) => {
        return (
          <div className="flex items-center justify-center">
            Biểu tượng
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="w-[20px]"
          style={{ marginLeft: row.original.level * 50 + 10 }}>

          <img
            src={row.getValue("icon")}
            alt={row.getValue("name")}
            className={`h-5 w-5 rounded-full object-cover`}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <div>{row.getValue("slug")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isDeleting = deletingId === row.original.categoryId
        return (
          <div className="flex justify-end gap-5 me-5">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              Sửa
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={async () => {
                setDeletingId(row.original.categoryId)
                await handleDelete(row.original.categoryId)
                await reFetch()
                setDeletingId(null)
              }}
            >
              {isDeleting && <Spinner className="mr-2 h-4 w-4" />}
              Xóa
            </Button>
          </div>
        )
      }
    }
  ], [handleEdit, handleDelete, reFetch, deletingId])

  const table = useReactTable({
    data: tableData,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="w-full h-80">
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Danh mục</CardTitle>
          <CardDescription>Quản lý danh mục sản phẩm.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Tìm kiếm tên..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Button onClick={handleAdd}>Thêm danh mục +</Button>
          </div>
          <div className="rounded-md border h-[calc(100vh-220px)] overflow-y-auto relative">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="sticky top-0 z-10 bg-background">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                )
                  : isError ? (
                    <div className="flex flex-col items-center">
                      <h6>{error?.message || "Tải dữ liệu thất bại"}</h6>
                      <Button
                        className="mt-2"
                        variant="outline"
                        size="sm"
                        onClick={reFetch}
                      >
                        Thử lại
                      </Button>
                    </div>
                  )
                    : (
                      table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            Không có kết quả.
                          </TableCell>
                        </TableRow>
                      )
                    )}
              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
      <CategoryDialog
        onSuccess={() => {
          setIsDialogOpen(false)
          setSelectedCategory(null)
          reFetch()
        }}
        data={data}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
      />
    </div>
  )
}
