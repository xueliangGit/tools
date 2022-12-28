import { dataURLtoFile, loadScript } from '@/utils/utils'
/*
 * @Author: xuxueliang
 * @Date: 2021-12-08 08:36:46
 * @LastEditTime: 2022-12-28 14:00:35
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
  blob: Blob // 缓存文件
  objectURL: string // URL.createObjectURL 地址
  [propName: string]: any
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
    loadScript(window._ztTools_path_ + 'js/html2canvas.js').then(async () => {
      const canvas: HTMLCanvasElement = await window.html2canvas(elm, {
        allowTaint: false,
        useCORS: false,
        proxy: proxyStatic,
        ...optionsConfig
      })
      const base64 = canvas.toDataURL('image/png')

      const result: Result = {
        base64,
        get file(): File {
          if (this.caheFile) {
            return this.caheFile
          }
          return (this.caheFile = dataURLtoFile(this.base64, name + '.png'))
        },
        get blob() {
          if (this.caheblob) {
            return this.caheblob
          }
          return (this.caheblob = imageBase64ToBlob(this.base64))
        },
        get objectURL() {
          if (this.caheUrl) {
            window.URL.revokeObjectURL(this.caheUrl)
            this.caheUrl = null
          }
          return (this.caheUrl = window.URL.createObjectURL(this.blob))
        }
      }

      if (!saveLocal && serverApi) {
        const fd = new FormData()
        const obj = { type: 'image', [fileKeys]: result.file, ...params }
        Object.entries(obj).forEach(([key, value]) => {
          fd.append(key, value)
        })
        fetch(serverApi, {
          method: 'post',
          body: fd
        }).then(res => res.json()).then(res => {
          result.res = res
          resolve(result)
        })
        return
      }
      if (saveLocal) {
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(imageBase64ToBlob(base64))
        a.setAttribute('download', name + '.png')
        a.click()
        setTimeout(() => {
          window.URL.revokeObjectURL(a.href)
        }, 1000)
      }
      resolve(result)
    })
  })

}

function imageBase64ToBlob(urlData: string, type: string = 'image/png') {
  try {
    const arr = urlData.split(',')
    const mime = arr[0].match(/:(.*?);/)![1] || type
    // 去掉url的头，并转化为byte
    const bytes = window.atob(arr[1])
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    const ia = new Uint8Array(ab)

    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }

    return new Blob([ab], {
      type: mime
    })
  } catch (e) {
    return new Blob([new ArrayBuffer(0)], {
      type: `${type}`
    })
  }
}
