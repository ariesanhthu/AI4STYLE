import { useCallback, useEffect, useState } from "react";
import { DashBoardIncomeParamsQuery, DashBoardIncomeResponse, DashBoardOrderResponse } from "../types/dashboard.type";
import { analysService } from "../services/admin-dashboard.service";

let FORCE_ERROR_FOR_TEST = false

export function useIncomeAnalys(range: { start: Date | undefined, end: Date | undefined }, select: string) {
  const [data, setData] = useState<DashBoardIncomeResponse['data']>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

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
    isLoading,
    isError,
    error,
    reFetch
  };
}

export function useBestSeller(range: { start: Date | undefined, end: Date | undefined }, select: string) {
  const [data, setData] = useState<DashBoardOrderResponse['data']>([])
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

      const dataFetch = await analysService.getTopSeller({
        startDate: range.start?.toDateString() || "",
        endDate: range.end?.toDateString() || "",
        groupBy: select,
        year: select === "month" ? range.start?.getFullYear().toString() : undefined
      });

      if (dataFetch) {
        setData(dataFetch.data)
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

export function useDashBoard() {
  const [range, setRange] = useState<{ start: Date | undefined, end: Date | undefined }>({
    start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  })

  const [select, setSelect] = useState<string>("day")

  return {
    range,
    select,
    setRange,
    setSelect
  }
}