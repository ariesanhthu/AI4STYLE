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
import { Category } from "../types/category.type"
import { useCategory } from "../hooks/use-admin-category"


export function CategoryBoard() {
  const { data, tableData, reFetch, handleAdd, handleEdit, isDialogOpen, setIsDialogOpen, selectedCategory, setSelectedCategory, isLoading, isError, error, sorting, columnFilters, columnVisibility, rowSelection, setSorting, setColumnFilters, setColumnVisibility, setRowSelection } = useCategory()

  const columns: ColumnDef<Category>[] = React.useMemo(() => [
    {
      accessorKey: "icon",
      header: ({ column }) => {
        return (
          <div className="flex items-center justify-center">
            Icon
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={row.getValue("icon")}
            alt={row.getValue("name")}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
        return (
          <div className="flex justify-end gap-5 me-5">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                console.log("Delete category:", row.original.categoryId)
              }}
            >
              Delete
            </Button>
          </div>
        )
      }
    }
  ], [handleEdit])

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full h-80">
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Filter names..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Button onClick={handleAdd}>Add Category +</Button>
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
                      Loading...
                    </TableCell>
                  </TableRow>
                )
                  : isError ? (
                    <div className="flex flex-col items-center">
                      <h6>{error?.message || "Failed to load data"}</h6>
                      <Button
                        className="mt-2"
                        variant="outline"
                        size="sm"
                        onClick={reFetch}
                      >
                        Retry
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
                            No results.
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
        data={data}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
      />
    </div>
  )
}
