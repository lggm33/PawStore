import { useState, useCallback } from "react";
import { DEFAULT_HEADERS, handleResponse } from "../utils/fetchUtils";

export function useMutation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const fetchOptions = {
        ...options,
        headers: { ...DEFAULT_HEADERS, ...options.headers },
      };

      if (fetchOptions.body && typeof fetchOptions.body === "object") {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
      }

      const result = await fetch(url, fetchOptions);
      const parsed = await handleResponse(result);
      setData(parsed);
      return parsed;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
