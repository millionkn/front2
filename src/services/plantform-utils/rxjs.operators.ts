import { Observable, OperatorFunction, GroupedObservable, merge, Subject } from "rxjs";
import { filter, shareReplay, map, mapTo, mergeMap, startWith, takeLast, takeUntil, takeWhile, tap, scan, debounceTime, share } from "rxjs/operators"
import { v4 as uuid } from 'uuid'
export function waitComplate(ob$: Observable<any>): Observable<null> {
  return ob$.pipe(
    startWith(null),
    takeLast(1),
    mapTo(null),
  )
}

export function cacheScan<I extends GroupedObservable<any, any>, R>(
  element: (ob$: I, v4uuid: string) => Observable<R>,
): OperatorFunction<I, Map<I extends GroupedObservable<infer K, any> ? K : never, R>> {
  return (ob$) => {
    const cache = new Map<I extends GroupedObservable<infer K, any> ? K : never, R>();
    return ob$.pipe(
      mergeMap((gob$) => element(gob$, uuid()).pipe(
        (ob$) => merge(
          ob$.pipe(tap((input) => cache.set(gob$.key, input))),
          waitComplate(ob$).pipe(tap(() => cache.delete(gob$.key))),
        ),
      )),
      map(() => new Map(cache)),
    )
  }
}

export function complateIfEmpty<T>(): OperatorFunction<T | null | undefined, T> {
  return (ob$) => ob$.pipe(takeWhile((value) => value !== null && value !== undefined)) as any
}

export function errorIfEmpty<T>(err: () => Error): OperatorFunction<T | null | undefined, T> {
  return (ob$) => ob$.pipe(map((value) => {
    if (value === null || value === undefined) { throw err() }
    return value
  }))
}

export function typeFilter<T>(filter: 'null'): OperatorFunction<T | null, T>
export function typeFilter<T>(filter: 'undefined'): OperatorFunction<T | undefined, T>
export function typeFilter<T>(filter: 'none'): OperatorFunction<T | null | undefined, T>
export function typeFilter<T>(filterxx: 'null' | 'undefined' | 'none'): OperatorFunction<T | null | undefined, T> {
  if (filterxx === 'null') {
    return (ob) => ob.pipe(filter((x) => x !== null)) as any
  } else if (filterxx === 'undefined') {
    return (ob) => ob.pipe(filter((x) => x !== undefined)) as any
  } else {
    return (ob) => ob.pipe(filter((x) => x !== undefined && x !== null)) as any
  }
}

export function publicReplay<T>(): OperatorFunction<T, T> {
  return (ob$) => {
    const result = ob$.pipe(shareReplay(1));
    result.subscribe({ error: () => { } });
    return result;
  }
}

export function fillWith<T>(cache$: Observable<T>): OperatorFunction<T, T> {
  return (ob$) => merge(
    ob$,
    cache$.pipe(takeUntil(ob$)),
  )
}

export function shareHold<T>(opt?: {
  bufferSize?: number,
  windowTime?: number,
  duartionTime?: number,
}): OperatorFunction<T, T> {
  return (ob$) => {
    const refCount$ = new Subject<number>();
    let target$ = ob$;
    refCount$.pipe(
      scan((pre, cur) => pre + cur, 0),
      opt?.duartionTime ? debounceTime(opt.duartionTime) : (ob$) => ob$,
      filter((c) => c === 0),
      startWith(0),
      share(),
      (counter$) => counter$.pipe(map(() => ob$.pipe(takeUntil(counter$), shareReplay(opt?.bufferSize, opt?.windowTime)))),
    ).subscribe((ob$) => target$ = ob$)
    return new Observable<T>((subscriber) => {
      refCount$.next(1)
      const subscribtion = target$.subscribe(subscriber)
      return () => {
        subscribtion.unsubscribe()
        refCount$.next(-1)
      }
    })
  }
}

export function cacheDiff<
  M extends Map<any, any>,
  K extends M extends Map<infer X, any> ? X : never,
  T extends M extends Map<any, infer X> ? X : never,
  >(
    first: 'equal' | 'insert',
): OperatorFunction<M, {
  equal: Map<K, T>,
  insert: Map<K, T>,
  remove: Map<K, T>,
}> {
  let _pre: M | null = null
  return (ob$) => ob$.pipe(
    map((current) => {
      if (_pre === null) {
        _pre = current
        return {
          equal: first === 'equal' ? current : new Map(),
          insert: first === 'insert' ? current : new Map(),
          remove: new Map(),
        }
      } else {
        const pre = _pre;
        _pre = current;
        return {
          equal: new Map([...current.keys()].filter((key) => pre.has(key)).map((key) => [key, current.get(key)!])),
          insert: new Map([...current.keys()].filter((key) => !pre.has(key)).map((key) => [key, current.get(key)!])),
          remove: new Map([...pre.keys()].filter((key) => !current.has(key)).map((key) => [key, pre.get(key)!])),
        }
      }
    })
  )
}