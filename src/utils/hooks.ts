import { useEffect, useState } from "react"

export function useAsync<T>(
  fun: () => Promise<T>,
  defaultValue: () => T,
  deps: [],
) {
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    fun().then((v) => setValue(v))
  }, deps)
  return value
}