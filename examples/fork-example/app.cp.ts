/***************************************************
 * Created by gongyanyu on 2022/1/30 10:30. *
 ***************************************************/
import { ForkThread } from '../../src'
import { API } from '../types'

/**
 *DEMO
 */
;(async () => {
  const _S = Date.now()
  const worker0 = new ForkThread<API>(require.resolve('./worker.cp'))
  const worker1 = new ForkThread<API>(require.resolve('./worker.cp'))
  const worker2 = new ForkThread<API>(require.resolve('./worker.cp'))
  const worker3 = new ForkThread<API>(require.resolve('./worker.cp'))

  worker2.channel.on('demo', (num: number) => {
    return num * num
  })
  worker3.channel.on('demo', (num: number) => {
    return num * num
  })

  const data = await Promise.all([
    worker0.channel.call('getFib', 40),
    worker1.channel.call('getFib', 40),
    worker2.channel.apply('getFib2', [40]),
    worker3.channel.apply('getFib2', [40])
  ])

  console.log(Date.now() - _S)
  console.log(data)
  console.log('Executed in the parent process')

  await worker0.terminate()
  await worker1.terminate()
  await worker2.terminate()
  await worker3.terminate()
})()
