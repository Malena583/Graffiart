import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

const useFetch = (key, fetcher, errorMessage) => {
  const [version, setVersion] = useState(0);
  const requestKey = `${key}:${version}`;
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: "" });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: null,
            error: getErrorMessage(error, errorMessage),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey, fetcher, errorMessage]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== requestKey,
    reload,
  };
};

export default useFetch;
