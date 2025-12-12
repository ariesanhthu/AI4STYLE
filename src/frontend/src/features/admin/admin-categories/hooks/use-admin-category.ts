import { useCallback, useEffect, useMemo, useState } from "react"
import categoryService from "../services/admin-category.service"
import { CategoryResponse, CategoryTreeItemWithLevel, CategoryInit } from "../types/category.type"

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { createSlug } from "../utils/createSlug"

export function useCategory() {
  const [data, setData] = useState<CategoryTreeItemWithLevel[] | []>([])
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeItemWithLevel | null>(null)

  const handleEdit = (category: CategoryTreeItemWithLevel) => {
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
      setData(fetchIncomeData)

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
    setData,
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

export function useCategoryDialog(category: CategoryTreeItemWithLevel | null) {
  const [cur_category, setCurCategory] = useState<CategoryInit>({
    id: "",
    name: "",
    slug: "",
    parentId: null,
    icon: null,
    description: null,
  })

  useEffect(() => {
    if (category) {
      setCurCategory({
        id: category.categoryId,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        icon: category.icon,
        description: category.description,
      })
    }
    else {
      setCurCategory({
        id: "",
        name: "",
        slug: "",
        parentId: null,
        icon: null,
        description: null,
      })
    }
  }, [category])

  const handleAdd = async () => {
    try {
      cur_category.slug = cur_category.slug ? cur_category.slug : createSlug(cur_category.name)
      const response = await categoryService.addCategory(cur_category)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    try {
      cur_category.slug = cur_category.slug ? cur_category.slug : createSlug(cur_category.name)
      const response = await categoryService.updateCategory(cur_category, cur_category?.id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await categoryService.deleteCategory(id)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    cur_category,
    setCurCategory,
    handleAdd,
    handleUpdate,
    handleDelete,
  }
}