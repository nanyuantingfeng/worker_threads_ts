/***************************************************
 * Created by gongyanyu on 2022/1/30 10:31. *
 ***************************************************/
import { getThreadChannel } from '../../src'
import { API } from '../types'

getThreadChannel<API>().on('getFib', getFib).on('getFib2', getFib)

function getFib(num: number): number {
  if (num === 0 || num === 1) return num
  return getFib(num - 1) + getFib(num - 2)
}
