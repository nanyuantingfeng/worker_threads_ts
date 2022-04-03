/***************************************************
 * Created by gongyanyu on 2022/1/30 10:55. *
 ***************************************************/
import * as path from 'path'
import { Worker, WorkerOptions } from 'worker_threads'
import { Channel } from 'simple-endpoint'
import { getThreadChannel } from './getThreadChannel'

export * from 'worker_threads'

export class WorkerThread<T extends Record<string, (...args: any) => any>> extends Worker {
  readonly channel: Channel<T>

  constructor(file: string, options: WorkerOptions = {}) {
    options.env = options.env || {}

    // @ts-ignore
    options.env['__THREAD_MODULE_ENTRY__'] = file
    // @ts-ignore
    options.env['__THREAD_MODULE_TYPE__'] = `WORKER_THREADS`

    super(path.extname(file) === '.ts' ? require.resolve('./thread.bridge') : file, options)

    this.channel = new Channel<T>({
      sender: (message) => this.postMessage(message),
      receiver: (callback) => this.on('message', callback)
    })
  }

  static channel<T extends Record<string, (...args: any) => any>>(): Channel<T> {
    return getThreadChannel<T>()
  }
}
