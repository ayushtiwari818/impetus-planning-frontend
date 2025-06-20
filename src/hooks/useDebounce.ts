import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * Useful for search inputs and filter changes to avoid excessive API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook to debounce filter changes specifically
 */
export const useDebouncedFilters = (
  filters: Record<string, any>,
  delay: number = 500
) => {
  return useDebounce(filters, delay);
};

export default useDebounce; 