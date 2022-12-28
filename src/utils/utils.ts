/*
 * @Author: xuxueliang
 * @Date: 2021-12-08 10:29:58
 * @LastEditTime: 2021-12-14 14:58:53
 * @LastEditors: xuxueliang
 * @Description:
 */
const loadScriptUrls: AnyObj = {}
const loadScriptLaoding: AnyObj = {}
interface Script { readyState?: string, type?: string }
interface IScript extends HTMLScriptElement {
  [propName: string]: any
}
/**
 * @name:
 * @description: 获取url
 * @param {*} url
 * @param {*} callback
 * @return {*}
 * @template:
 */
export function loadScript(url: string): Promise<any> {
  if (loadScriptLaoding[url]) {
    return loadScriptLaoding[url]
  }
  const promise = new Promise((resolve, reject) => {
    if (loadScriptUrls[url]) {
      resolve(true)
      return
    }
    const scriptInstance: IScript = document.createElement('script')
    scriptInstance.type = 'text/javascript'
    if (scriptInstance.readyState) {
      // IE
      scriptInstance.onreadystatechange = () => {
        if (scriptInstance.readyState === 'loaded' || scriptInstance.readyState === 'complete') {
          scriptInstance.onreadystatechange = null
          loadScriptUrls[url] = true
          delete loadScriptLaoding[url]
          resolve(true)
        }
      }
    } else {
      // Others: Firefox, Safari, Chrome, and Opera
      scriptInstance.onload = () => {
        loadScriptUrls[url] = true
        delete loadScriptLaoding[url]
        resolve(true)
      }
      scriptInstance.onerror = () => {
        delete loadScriptLaoding[url]
        reject()
      }
    }
    scriptInstance.src = url
    document.body.appendChild(scriptInstance)
  })
  loadScriptLaoding[url] = promise
  return promise
}
export function dataURLtoFile(dataurl: string, filename: string = '未命名'): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
