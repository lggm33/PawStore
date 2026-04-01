import { useState, useEffect, useCallback } from "react";
import { handleResponse } from "@/utils/fetchUtils";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (controller) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetch(url, { signal: controller.signal });
      const parsed = await handleResponse(result);
      setData(parsed);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [fetchData]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return { data, loading, error, refetch };
}
