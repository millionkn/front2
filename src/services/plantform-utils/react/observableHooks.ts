import { useEffect, useState } from "react"
import { debounceTime, firstValueFrom, Observable, shareReplay } from "rxjs"
import { withPromise } from "./promiseHooks"

export function withObservable<T>(ob$: Observable<T>) {
  const target$ = ob$.pipe(debounceTime(0), shareReplay(1))
  const useFirstValue = withPromise(() => firstValueFrom(target$))
  return () => {
    const firstValue = useFirstValue()
    const [value, setValue] = useState(() => firstValue)
    useEffect(() => {
      const sub = target$.subscribe((v) => setValue(v))
      return () => sub.unsubscribe()
    }, [])
    return value
  }
}

export function useObservable<T>(defaultValue: () => T, ob$Fun: () => Observable<T>) {
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    const subscribtion = ob$Fun().subscribe((v) => setValue(v))
    return () => subscribtion.unsubscribe()
  }, [])
  return value
}