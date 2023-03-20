import { useCallback, useState } from "react";

type UseQueryFn<Args extends unknown[], T extends unknown> = (...args: Args) => Promise<T>;

type UseQuery<Args extends unknown[], T extends unknown> = {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  query: UseQueryFn<Args, T>;
};

export function useQuery<Args extends unknown[], T extends unknown>(
  fn: UseQueryFn<Args, T>,
): UseQuery<Args, T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const query = useCallback<UseQueryFn<Args, T>>(
    async (...args) => {
      setLoading(true);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { data, error, loading, query };
}