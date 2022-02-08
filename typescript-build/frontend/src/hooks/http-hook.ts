import { useCallback, useState } from 'react';

const useHttpHook = () => {
  const [httpError, setHttpError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sendRequest = useCallback(
    async (
      url: string,
      method: string = 'GET',
      body?: BodyInit,
      headers?: HeadersInit
    ) => {
      setIsLoading(true);
      try {
        const res = await fetch(url, {
          method,
          headers,
          body,
        });
        const data = await res.json();

        if (res.status !== 200 && res.status !== 201) {
          setHttpError(data.message);
        }
        setIsLoading(false);
        return data;
      } catch (err: any) {
        setHttpError(err.message);
        setIsLoading(false);
        return {error: err.message}
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setHttpError(null);
  }, []);

  return { httpError, isLoading, sendRequest, clearError };
};

export default useHttpHook;
