import Mqtt from 'mqtt-browser';
import { debounceTime, filter, groupBy, Observable, pairwise, scan, startWith, Subject, switchMap } from 'rxjs';
import { cacheDiff, cacheScan, shareHold } from './rxjs.operators';

export function MqttRef(
  url: string,
  opts?: Mqtt.IClientOptions,
) {
  const connection$ = new Observable<{
    subscirbe: (
      topic: string,
      opts?: Mqtt.IClientSubscribeOptions
    ) => Observable<{ payload: string, params: string[] }>,
  }>((subscriber) => {
    const client = Mqtt.connect(url, opts)
    const topicCounter$ = new Subject<{ topic: string, value: number }>()
    topicCounter$.pipe(
      groupBy((x) => x.topic, {
        duration: (ob$) => ob$.pipe(
          scan((pre, { value }) => pre + value, 0),
          debounceTime(1000),
          filter((x) => x === 0),
        ),
      }),
      cacheScan((ob$) => ob$),
      cacheDiff('insert'),
    ).subscribe(({ insert, remove }) => {
      if (insert.size > 0) { client.subscribe([...insert.keys()]) }
      if (remove.size > 0) { client.unsubscribe([...remove.keys()]) }
    })
    client.on('connect', () => {
      subscriber.next({
        subscirbe: (topic) => new Observable((subscriber) => {
          topicCounter$.next({ topic, value: 1 })
          const topicRegExp = new RegExp(topic.split('/').map((str) => str === '+' ? `([^/]*)` : str).join('/'))
          client.on('message', (topic, payload) => {
            const result = topic.match(topicRegExp)
            if (result === null) { return }
            if (!topicRegExp.test(topic)) { return }
            subscriber.next({
              params: result.splice(1, result.length).map((x) => x),
              payload: payload.toString(),
            })
          })
          return () => topicCounter$.next({ topic, value: -1 })
        })
      })
    })
    client.on('error', (e) => subscriber.error(e))
    return () => client.end()
  }).pipe(
    shareHold({ bufferSize: 1, duartionTime: 0 }),
  )
  return {
    /**'+'通配符会在params中按顺序传递
     * 
     * '#'号不支持
     */
    topic$: (topic: string, opts?: Mqtt.IClientSubscribeOptions) => connection$.pipe(
      switchMap(({ subscirbe }) => subscirbe(topic, opts)),
    )
  }
}