import { useCallback, useEffect, useState } from "react";
import { Data } from "../types/data.type";
import { analysService } from "../services/admin-analys.service";

const mapFetch = {
  'date': analysService.getDataByDate,
  'month': analysService.getDataByMonth,
  'year': analysService.getDataByYear
}

export type DateType = keyof typeof mapFetch
export const dateTypes: DateType[] = Object.keys(mapFetch) as DateType[]
let FORCE_ERROR_FOR_TEST = false

export function useDataAnalys() {
  const [data, setData] = useState<Data[]>([])
  const [select, setSelect] = useState<DateType>("date")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      if (FORCE_ERROR_FOR_TEST) {
        throw new Error("Forced error for testing")
      }
      const fetchData = await mapFetch[select]()

      setData(fetchData)
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
    FORCE_ERROR_FOR_TEST = false
    fetchData()
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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