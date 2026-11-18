const { useRef } = require("react");

const useDebounce = () => {
  const debounceTimeOut = useRef(null);

  const debounce = (func, delay) => {
    return () => {
      if (debounceTimeOut.current) clearTimeout(debounceTimeOut.current);
      debounceTimeOut.current = setTimeout(() => {
        func();
        debounceTimeOut.current = null;
      }, delay);
    };
  };

  return { debounce };
};

export default useDebounce;
