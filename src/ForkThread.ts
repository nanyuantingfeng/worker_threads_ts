/***************************************************
 * Created by gongyanyu on 2022/1/30 10:55. *
 ***************************************************/
import * as path from 'path'
import { Channel } from 'simple-endpoint'
import { ForkOptions, ChildProcess } from 'child_process'
import * as child_process from 'child_process'
import { getThreadChannel } from './getThreadChannel'

export class ForkThread<T extends Record<string, (...args: any) => any>> {
  readonly channel: Channel<T>
  readonly thread: ChildProcess

  constructor(file: string, options?: ForkOptions) {
    options = options || {}
    options.env = options.env || {}
    options.env['__THREAD_MODULE_ENTRY__'] = file
    options.env['__THREAD_MODULE_TYPE__'] = `CHILD_PROCESS`

    this.thread = child_process.fork(
      path.extname(file) === '.ts' ? require.resolve('./thread.bridge') : file,
      [],
      options
    )

    this.channel = new Channel<T>({
      sender: (message) => this.thread.send(message),
      receiver: (callback) => this.thread.on('message', callback)
    })
  }

  static channel<T extends Record<string, (...args: any) => any>>(): Channel<T> {
    return getThreadChannel<T>()
  }

  terminate() {
    this.thread.kill()
  }
}
