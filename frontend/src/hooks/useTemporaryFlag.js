import { useCallback, useEffect, useRef, useState } from "react";

const useTemporaryFlag = (ms = 2000) => {
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const trigger = useCallback(() => {
    setActive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(false), ms);
  }, [ms]);

  return [active, trigger];
};

export default useTemporaryFlag;
