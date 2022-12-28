/*
 * @Author: xuxueliang
 * @Date: 2021-12-20 14:14:12
 * @LastEditTime: 2021-12-20 16:54:43
 * @LastEditors: xuxueliang
 * @Description:
 */
import Gesture from './gesture'
import { loadScript } from '@/utils/utils'
interface IGesture {
  gesture?: string // 自定义vconsole 滑动码 默认是1122
  maxNums?: number //  有效滑动未匹配成功的的最大次数，默认是5
  options?: { // 自定义触发事件
    [propsName: string]: () => boolean
  }
}
export default function (config: IGesture) {
  const { gesture = '1122', options, maxNums = 5 } = config || {}
  Gesture({
    maxNums,
    callBack: (recod) => {
      const recodStr = recod.join('')
      if (options && options[recodStr]) {
        options[recodStr]()
        return true
      }
      switch (recodStr) {
        case gesture: {
          loadVConsole()
          return true
        }
      }
      return false
    }
  })
  console.log('Gesture')
}
let vcIsLoad = false
function loadVConsole() {
  if (vcIsLoad) {
    return
  }
  vcIsLoad = true
  loadScript('https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js').then(() => {
    window.vConsole = new window.VConsole()
  })

}
