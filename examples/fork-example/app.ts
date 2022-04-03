/***************************************************
 * Created by gongyanyu on 2022/1/30 10:30. *
 ***************************************************/
import { WorkerThread } from '../../src'
import { API } from '../types'

/**
 *DEMO
 */
;(async () => {
  const _S = Date.now()
  const worker0 = new WorkerThread<API>(require.resolve('./worker'))
  const worker1 = new WorkerThread<API>(require.resolve('./worker'))
  const worker2 = new WorkerThread<API>(require.resolve('./worker'))
  const worker3 = new WorkerThread<API>(require.resolve('./worker'))

  const data = await Promise.all([
    worker0.channel.call('getFib', 40),
    worker1.channel.call('getFib', 40),
    worker2.channel.call('getFib2', 40),
    worker3.channel.call('getFib2', 40)
  ])
  console.log(Date.now() - _S)
  console.log(data)
  console.log('Executed in the parent thread')
  await worker0.terminate()
  await worker1.terminate()
  await worker2.terminate()
  await worker3.terminate()
})()
