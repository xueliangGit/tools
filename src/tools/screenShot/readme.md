<!--
 * @Author: xuxueliang
 * @Date: 2021-12-08 16:55:54
 * @LastEditTime: 2023-03-01 14:54:19
 * @LastEditors: xuxueliang
 * @Description: 
-->

## 截图工具：screenShot
> 由于html2canvas有时间输出图片还原度不够，先引入另外一个库来处理，dom-to-image，使用svg的形式去截图。两个库同时只能使用一个。
用于截图使用的工具，针对dom接口中某个dom进行截图；工具名是 **screenShot**

支持截图保存到本地，上传到服务器（需要自己提供上传的api地址，和参数key），promise返回base64和file文件

>接口信息如下

```ts
interface Options {
  name?: string // 截图的名字
  saveLocal?: boolean // 保存到本地 与 serverApi 互斥，优先级更高
  el: HTMLElement | string // 要截图的dom
  proxyStatic?: string // 静态资源代理，用于请求不同域名的资源
  options?: object // 覆盖 html2canvas 或者dom-to-image的配置
  serverApi: string // 服务端接口 与 saveLocal互斥
  params?: object // 上传图片要添加的参数
  fileKeys?: string | 'file' // 上传文件的key，默认是file
  use?:'domtoimage'|'html2canvas'// 使用那个库来处理，默认是html2canvas 
  target?:'svg'|'png'|'jpeg'|'blob'|'pixeldata'//使用dom-to-image时的目标target
}
```

>返回值信息如下
使用html2canvas 时

```ts
interface Result {
  base64: string // base64 图片
  file: File // 图片文件流
  blob: Blob // 缓存文件
  objectURL: string // URL.createObjectURL 地址
  res?: object // 上传图片后返回的信息 需要使用者自己取
}
```
使用dom-to-image 时
直返回 相应值

>使用方式

>示例1

```js
function doCut(el){
  ztTools.use(['screenShot']).then(({screenShot})=>{
    if(!screenShot){
      return
    }
    screenShot({el:el,saveLocal:true}).then((res)=>{
      // res 结构 是 上述的Result 配置信息
    })
  })
}
doCut(document.body)
```

>示例2

```js
async function doCut(el){
  await ztTools.use(['screenShot'])
  if(!ztTools.screenShot){
    return
  }
  ztTools.screenShot({el:el,saveLocal:true,name:'body截图'}).then((res)=>{
    // res 结构 是 上述的Result 配置信息
  })
}
doCut(document.body)
```
