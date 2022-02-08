import axios from 'axios';
import { useCallback, useRef, useState, useEffect } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', data = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);
      try {
        const response = await axios({
          method: method,
          url: url,
          data: data,
          headers: headers,
          signal: httpAbortCtrll.signal,
        });
        const responseData = response.data;

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrll
        );

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.response.data.message || 'Something went wrong');
        return {
          error: err.response.data.message || 'Something went wrong',
        };
      }
    },
    []
  );

  const resetError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, resetError };
};

export default useHttp;
