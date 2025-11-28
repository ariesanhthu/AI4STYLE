"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
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

const data: Category[] = [
    {
        id: "cat_1",
        icon: "https://github.com/shadcn.png",
        name: "T-Shirt",
        slug: "t-shirt",
    },
    {
        id: "cat_2",
        icon: "https://github.com/shadcn.png",
        name: "Jeans",
        slug: "jeans",
    },
    {
        id: "cat_3",
        icon: "https://github.com/shadcn.png",
        name: "Shoes",
        slug: "shoes",
    },
    {
        id: "cat_4",
        icon: "https://github.com/shadcn.png",
        name: "Accessories",
        slug: "accessories",
    },
    {
        id: "cat_5",
        icon: "https://github.com/shadcn.png",
        name: "Jackets",
        slug: "jackets",
    },
    {
        id: "cat_6",
        icon: "https://github.com/shadcn.png",
        name: "Hats",
        slug: "hats",
    },
    {
        id: "cat_7",
        icon: "https://github.com/shadcn.png",
        name: "Socks",
        slug: "socks",
    },
    {
        id: "cat_8",
        icon: "https://github.com/shadcn.png",
        name: "Belts",
        slug: "belts",
    },
    {
        id: "cat_9",
        icon: "https://github.com/shadcn.png",
        name: "Scarves",
        slug: "scarves",
    },
    {
        id: "cat_10",
        icon: "https://github.com/shadcn.png",
        name: "Gloves",
        slug: "gloves",
    },
    {
        id: "cat_11",
        icon: "https://github.com/shadcn.png",
        name: "Watches",
        slug: "watches",
    },
    {
        id: "cat_12",
        icon: "https://github.com/shadcn.png",
        name: "Glasses",
        slug: "glasses",
    },
    {
        id: "cat_13",
        icon: "https://github.com/shadcn.png",
        name: "Bags",
        slug: "bags",
    },
    {
        id: "cat_14",
        icon: "https://github.com/shadcn.png",
        name: "Wallets",
        slug: "wallets",
    },
    {
        id: "cat_15",
        icon: "https://github.com/shadcn.png",
        name: "Jewelry",
        slug: "jewelry",
    },
]

export type Category = {
    id: string
    icon: string
    name: string
    slug: string
}


export function CategoryBoard() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedCategory(null)
        setIsDialogOpen(true)
    }

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
                                console.log("Delete category:", row.original.id)
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
        data,
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
                        <table className="w-full caption-bottom text-sm">
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
                                {table.getRowModel().rows?.length ? (
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
                                )}
                            </TableBody>
                        </table>
                    </div>

                </CardContent>
            </Card>
            <CategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                category={selectedCategory}
            />
        </div>
    )
}
