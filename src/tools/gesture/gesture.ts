/*
 * @Author: xuxueliang
 * @Date: 2019-11-04 15:32:46
 * @LastEditors: xuxueliang
 * @LastEditTime: 2021-12-20 15:53:25
 */
interface InConfig {
  e: TouchEvent
  byDefined: boolean
}
// 每次横向或者纵向滑动需要滑动 156px 且波动小于40px 为有效
interface Igesture {
  el?: Element, // 要处理的元素 默认是body
  callBack?: CallBack, // 每次有效滑动的接受的
  maxNums?: number // 最大累计数
}
type CallBack = (recod?: any) => boolean
export default function gesture($elm?: Element | Igesture) {
  let callBack: CallBack | undefined
  let el: Element = document.body
  let maxNums = 5
  // 右滑1；左滑2，下滑4 上滑3
  // 最多纪录5次
  const nums: {
    [propsName: string]: number
  } = {
    isRight: 1,
    isLeft: 2,
    isDown: 3,
    isUp: 4,
  }
  if ($elm instanceof Element) {
    el = $elm
    //
  } else if (typeof $elm === 'object') {
    //
    callBack = $elm.callBack
    el = $elm.el || el
    maxNums = $elm.maxNums || maxNums
  } else {
    // 傻傻没有
  }
  if (!callBack || !$elm) {
    console.warn(`callBack 是必须要`)

    return
  }
  const l = 40
  // const isDebuging = window.location.href.indexOf('__ISCONSOLE__') > -1
  // let isTesting = window.location.href.indexOf('h5Test') > -1
  let isByDefined: boolean = false
  const toUrl = {
    test: '',
    debug: ''
    // 可以是方法，也可以是字符串，
  }

  const testTouch = {
    isSure: 0,
    startX: 0,
    startY: 0,
    startTime: 0
  }
  function beginTest(e: TouchEvent, byDefined: boolean) {
    if (isByDefined && !byDefined) {
      return
    }
    testTouch.startX = e.changedTouches[0].clientX
    testTouch.startY = e.changedTouches[0].clientY
    testTouch.startTime = Date.now()
  }

  let recod: number[] = []
  function endTest(e: TouchEvent, byDefined: boolean) {
    if (Date.now() - testTouch.startTime > 5000) {
      recod = []
      console.log('清空')
      return
    }
    if (isByDefined && !byDefined) {
      return
    }

    const clientX = e.changedTouches[0].clientX
    const clientY = e.changedTouches[0].clientY

    const radioY = Math.abs(clientY - testTouch.startY) < l
    const radioX = Math.abs(clientX - testTouch.startX) < l
    const conditionMap: {
      [propsName: string]: () => boolean
    } = {
      isRight: () => clientX - testTouch.startX > 156 && radioY,
      isLeft: () => clientX - testTouch.startX < -156,
      isDown: () => clientY - testTouch.startY > 156 && radioX,
      isUp: () => clientY - testTouch.startY < -156 && radioX
    }
    for (const keys in nums) {
      if (conditionMap[keys]()) {
        recod.push(nums[keys])
        if (callBack!(recod) || recod.length >= maxNums) {
          recod = []
        }
        return
      }
    }

  }
  function syncConfig(isByDefinedFlag: boolean) {
    isByDefined = isByDefinedFlag
  }

  function setUrl(Obj: object) {
    Object.assign(toUrl, Obj)
  }
  let isInit = false
  function bindFn(elm: Element | HTMLBodyElement) {
    if (isInit) {
      return
    }
    // 绑定触摸事件
    elm.addEventListener('touchstart', (e: any) => {
      beginTest(e, true)
    }, false)
    elm.addEventListener('touchend', (e: any) => {
      endTest(e, true)
    }, false)
    syncConfig(isInit = true)
  }
  bindFn(el)
}
