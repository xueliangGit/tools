import { dataURLtoFile, loadScript } from '@/utils/utils'

/*
 * @Author: xuxueliang
 * @Date: 2021-12-08 08:36:46
 * @LastEditTime: 2021-12-09 09:03:40
 * @LastEditors: xuxueliang
 * @Description:
 */
interface Options {
  name?: string // 截图的名字
  saveLocal?: boolean // 保存到本地 与 serverApi 互斥，优先级更高
  el: HTMLElement | string // 要截图的dom
  proxyStatic?: string // 静态资源代理，用于请求不同域名的资源
  options?: object // 覆盖 html2canvas的配置
  serverApi: string // 服务端接口 与 saveLocal互斥
  params?: object // 上传图片要添加的参数
  fileKeys?: string | 'file' // 上传文件的key，默认是file
}
interface Result {
  base64: string // base64 图片
  file: File // 图片文件流
  res?: object // 上传图片后返回的信息 需要使用者自己取
}
export default function (options: Options): Promise<Result> {
  return new Promise((resolve, reject) => {
    if (!options.el) {
      reject()
      return
    }
    const { el, proxyStatic = '', name = '未命名', params = {}, fileKeys = 'file',
      saveLocal = false, serverApi = null, options: optionsConfig = {} } = options
    let elm: string | HTMLElement = el
    //
    if (typeof el === 'string') {
      elm = <HTMLElement>document.querySelector(el)
    }
    loadScript('https://component-chanapp.inte.chanjet.com/js/html2canvas.js').then(async () => {
      const canvas: HTMLCanvasElement = await window.html2canvas(elm, {
        allowTaint: false,
        useCORS: false,
        proxy: proxyStatic,
        ...optionsConfig
      })
      const base64 = canvas.toDataURL('image/png')
      const file = dataURLtoFile(base64, name + '.png')
      const fd = new FormData()
      const obj = { type: 'image', [fileKeys]: file, ...params }
      Object.entries(obj).forEach(([key, value]) => {
        fd.append(key, value)
      })
      if (!saveLocal && serverApi) {
        fetch(serverApi, {
          method: 'post',
          body: fd
        }).then(res => res.json()).then(res => {
          resolve({ base64, file, res })
        })
        return
      }
      if (saveLocal) {
        const a = document.createElement('a')
        a.href = base64
        a.setAttribute('download', name + '.png')
        a.click()
      }
      resolve({ base64, file })
    })
  })

}
