/***************************************************
 * Created by gongyanyu on 2022/1/30 10:31. *
 ***************************************************/
import { getThreadChannel } from '../../src'
import { API } from '../types'

const channel = getThreadChannel<API>()

channel.on('getFib', getFib).on('getFib2', (num) => {
  return channel.call('demo', num).then((res) => {
    console.log(res)
    return res
  })
})

function getFib(num: number): number {
  if (num === 0 || num === 1) return num
  return getFib(num - 1) + getFib(num - 2)
}
