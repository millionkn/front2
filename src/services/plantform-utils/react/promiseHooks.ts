import { useState } from "react"

export function withPromise<T>(fun: () => Promise<T>) {
  const nullValue = {} as T
  let value = nullValue
  const promise = fun()
  promise.then((v) => value = v)
  return () => {
    if (value === nullValue) { throw promise }
    return value
  }
}

export function usePromise<T>(defaultValue: () => T, fun: () => Promise<T>) {
  const [value, setValue] = useState(defaultValue)
  fun().then((v) => setValue(v))
  return value
}