import { useCallback, useEffect, useState } from "react"
import categoryService from "../services/admin-category.service"
import { Category } from "../types/category.type"
import { ListCategoryResponseDto } from "@/lib/open-api-client/type"

export function useCategory() {
  const [data, setData] = useState<ListCategoryResponseDto | null>(null)

  const fetchIncomeData = useCallback(async () => {
    try {

      const fetchIncomeData = await categoryService.getAllCategory()
      setData(fetchIncomeData)

    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
    //   setIsError(true);
    //   setError(error);
      setData([]);
    } finally {
    //   setIsLoading(false)
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
    reFetch,
  };
}