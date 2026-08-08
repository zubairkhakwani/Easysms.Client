import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stayed unchanged for `delayMs`.
 * Use for search inputs so APIs are not called on every keystroke.
 *
 * @param {any} value
 * @param {number} [delayMs=350]
 */
export function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
