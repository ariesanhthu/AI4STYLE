import { useCallback, useEffect, useState } from "react";
import { DataByTime, ProductSell } from "../types/data.type";
import { analysService } from "../services/admin-analys.service";

const mapFetch = {
  'date': analysService.getDataByDate,
  'month': analysService.getDataByMonth,
  'year': analysService.getDataByYear
}

export type DateType = keyof typeof mapFetch
export const dateTypes: DateType[] = Object.keys(mapFetch) as DateType[]
let FORCE_ERROR_FOR_TEST = false

export function useIncomeAnalys() {
  const [data, setData] = useState<DataByTime[]>([])
  const [select, setSelect] = useState<DateType>("date")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchIncomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const fetchIncomeData = await mapFetch[select]()
      setData(fetchIncomeData)

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
    select,
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

      if(FORCE_ERROR_FOR_TEST) {
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