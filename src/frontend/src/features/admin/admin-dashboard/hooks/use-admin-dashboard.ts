import { useCallback, useEffect, useState } from "react";
import { DashBoardIncomeParamsQuery, DashBoardIncomeResponse } from "../types/data.type";
import { analysService } from "../services/admin-dashboard.service";
import { dateMatchModifiers } from "react-day-picker";

let FORCE_ERROR_FOR_TEST = false

export function useIncomeAnalys() {
  const [data, setData] = useState<DashBoardIncomeResponse['data']>([])
  const [select, setSelect] = useState<string>("day")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [range, setRange] = useState<{ start: Date | undefined, end: Date | undefined }>({
    start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  })

  const fetchIncomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const fetchIncomeData = await analysService.getLineChartData({
        startDate: range.start?.toDateString() || "",
        endDate: range.end?.toDateString() || "",
        groupBy: select,
        year: select === "month" ? range.start?.getFullYear().toString() : undefined
      })
      setData(fetchIncomeData['data'])

    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setIsError(true);
      setError(error);
      setData([]);
    } finally {
      setIsLoading(false)
    }

  }, [select])

  const reFetch = useCallback(async () => {
    // FORCE_ERROR_FOR_TEST = false
    fetchIncomeData()
  }, [])

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  return {
    data,
    range,
    isLoading,
    isError,
    error,
    select,
    setRange,
    setSelect,
    reFetch
  };
}

export function useBestSeller() {
  const [data, setData] = useState<ProductSell[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchBestSellerProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      setError(null)

      if (FORCE_ERROR_FOR_TEST) {
        throw error
      }

      const dataFetch = await analysService.getTopSeller();

      if (dataFetch) {
        setData(dataFetch)
      }
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
    FORCE_ERROR_FOR_TEST = false
    fetchBestSellerProducts()
  }, [])

  useEffect(() => {
    fetchBestSellerProducts();
  }, [fetchBestSellerProducts]);

  return {
    data,
    error,
    isError,
    isLoading,
    reFetch,
  }
}