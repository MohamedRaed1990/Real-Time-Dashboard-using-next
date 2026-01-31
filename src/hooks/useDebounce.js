import { useEffect, useState } from 'react'

export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(() => (typeof value === 'string' ? value.trim() : value))
  useEffect(() => {
    const t = setTimeout(() => setDebounced(typeof value === 'string' ? value.trim() : value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}