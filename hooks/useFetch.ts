import { useState } from "react";

type UseFetchReturn<T> = {
  loading: boolean;
  error: Error | null;
  data: T | null;
  fn: (...args: any[]) => Promise<any>;
};

function useFetch<T = any>(
  callbackFn: (...args: any[]) => Promise<T>
): UseFetchReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fn = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);

      const response = await callbackFn(...args);
      setData(response);
      return response;
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fn, data };
}

export default useFetch;
