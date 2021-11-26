import axios from 'axios';
import { catchError, Observable, switchMap, timer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { shareHold } from './rxjs.operators';

const str = `/zsyc/`

const baseHref = str[str.length - 1] === '/' ? str.slice(0, str.length - 1) : str

const socket$ = new Observable<{ socket: Socket, socketToken: string }>((subscriber) => {
  const socket = io({
    path: `${baseHref}/socket.io/`,
  })
  socket.on('set-socket-token', (data) => subscriber.next({
    socket,
    socketToken: data.socketToken,
  }))
  socket.on('disconnect', (e) => subscriber.error(e))
  return () => socket.disconnect()
}).pipe(
  catchError((e, ob$) => timer(2000).pipe(switchMap(() => ob$))),
  shareHold({ bufferSize: 1, duartionTime: 0 }),
)

let socketMethodTokenIndex = 0

export function socketRequest<R>(url: string, body: { [key: string]: any }): Observable<R> {
  return socket$.pipe(
    switchMap(({ socket, socketToken }) => new Observable<R>((subscriber) => {
      const socketMethodToken = `token_${socketMethodTokenIndex++}`;
      const cancelToken = axios.CancelToken.source()
      const complateCb = () => axios.post(`${baseHref}/${url}`, body, {
        cancelToken: cancelToken.token,
        headers: {
          'socket-token': socketToken,
          'socket-method-token': socketMethodToken,
        },
      }).catch((e) => subscriber.error(e))
      socket.on(`socketMethod/error/${socketMethodToken}`, ({ error }: any) => subscriber.error(error))
      socket.on(`socketMethod/next/${socketMethodToken}`, ({ data }: any) => subscriber.next(data))
      socket.on(`socketMethod/complate/${socketMethodToken}`, complateCb)
      complateCb()
      return () => {
        cancelToken.cancel()
        socket.removeListener(`socketMethod/error/${socketMethodToken}`)
        socket.removeListener(`socketMethod/next/${socketMethodToken}`)
        socket.removeListener(`socketMethod/complate/${socketMethodToken}`)
        socket.emit(`socketMethod/close/${socketMethodToken}`)
      }
    })),
  )
}