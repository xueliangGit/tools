<!--
 * @Author: xuxueliang
 * @Date: 2021-12-20 15:54:28
 * @LastEditTime: 2021-12-20 17:19:37
 * @LastEditors: xuxueliang
 * @Description: 
-->

# 移动端滑动手势识别

采用上下左右滑动手势，来制定不同滑动出发不同的方法，移动端使用手势开启vconsole就是很好的使用案例；通过定义有效的滑动（*每次横向或者纵向滑动需要滑动大于 156px 且波动小于40px 为有效*）方向码，向右滑动码为1，向左滑动码为2，向下滑动码为3，向上滑动码为4，这样通过自定义滑动码自动执行方法即可

内置vconsole 功能，滑动方式；默认滑动码1122，可以修改

### 使用方式

接口信息

```ts
interface IGesture {
  gesture?: string // 自定义vconsole 滑动码 默认是1122
  maxNums?: number //  有效滑动未匹配成功的的最大次数，默认是5
  options?: { // 自定义触发事件
    [propsName: string]: () => boolean
  }
}
```

使用内置功能

```js
 ztTools.use(['gesture']).then(res => {
  ztTools.gesture() // 开启vsconsole 滑动码 1122
 })
```

自定义滑动方法

```js
 ztTools.use(['gesture']).then(res => {
  ztTools.gesture({
    options:{
      1111:()=>{console.log('1')}
    }
  }) 
 })
```

如上向右滑动四下即触发方法
