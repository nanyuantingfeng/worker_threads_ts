/***************************************************
 * Created by gongyanyu on 2022/2/25 14:13. *
 ***************************************************/
import { Channel } from 'simple-endpoint'

export function getThreadChannel<T extends Record<string, (...args: any) => any>>(): Channel<T> {
  const type = process.env.__THREAD_MODULE_TYPE__

  if (type === 'WORKER_THREADS') {
    const { parentPort } = require('worker_threads')

    return new Channel<T>({
      sender: (message) => parentPort.postMessage(message),
      receiver: (callback) => parentPort.on('message', callback)
    })
  }

  if (type === 'CHILD_PROCESS') {
    return new Channel<T>({
      sender: (message) => process.send(message),
      receiver: (callback) => process.on('message', callback)
    })
  }

  throw new Error('Unknown thread module type: ' + type)
}
