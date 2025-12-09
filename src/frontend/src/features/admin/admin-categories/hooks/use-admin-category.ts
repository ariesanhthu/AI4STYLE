import { useCallback, useEffect, useMemo, useState } from "react"
import categoryService from "../services/admin-category.service"
import { CategoryResponse, Category } from "../types/category.type"

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

export function useCategory() {
  const [data, setData] = useState<CategoryResponse['items'] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const tableData = useMemo(() => {
    return data
  }, [data])

  const fetchIncomeData = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      const fetchIncomeData = await categoryService.getAllCategory()
      setData(fetchIncomeData.items)

    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setIsError(true);
      setError(error);
      setData([]);
    } finally {
      setIsLoading(false)
    }

  }, [])

  const reFetch = useCallback(async () => {
    // FORCE_ERROR_FOR_TEST = false
    fetchIncomeData()
  }, [])

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  return {
    data,
    tableData,
    reFetch,
    handleAdd,
    handleEdit,
    isDialogOpen,
    setIsDialogOpen,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    isError,
    error,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
  };
}