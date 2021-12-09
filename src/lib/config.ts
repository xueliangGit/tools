/*
 * @Author: xuxueliang
 * @Date: 2021-11-18 13:51:39
 * @LastEditTime: 2021-12-08 16:49:32
 * @LastEditors: xuxueliang
 * @Description:
 */
interface Config {
  flag?: string
  pluginName?: string
  webpackPath: string
  srcReg?: RegExp | string
}
export let config: Config = {
  flag: 'tsdk',
  pluginName: 'tools',
  webpackPath: '_tools_path_',
  srcReg: undefined
}

export function setConfig({
  flag,
  pluginName,
  webpackPath = '_tools_path_',
  srcReg
}: Config) {
  config.flag = flag
  config.pluginName = pluginName
  config.webpackPath = webpackPath
  srcReg && typeof srcReg === 'string' && (config.srcReg = new RegExp(srcReg))
}

export function initWebpackPath(root: boolean = false) {
  if (!window[config.webpackPath]) {
    // 从script中取值
    let script = document.head.querySelector(`[${config.flag}][src]`)
    if (!script && config.srcReg) {
      script = Array.prototype.find.call(document.scripts, (v) => {
        return (config.srcReg as RegExp).test(v.getAttribute('src'))
      })
    }
    if (script) {
      let src = script
        .getAttribute('src')
      if (root) {
        src = src!.replace(/(http(s)?:\/\/[^/]+)([\s\S]+)?/, '$1')
      } else {
        const srcs = src!.split('/')
        srcs.pop()
        src = srcs.join('/')
      }
      window[config.webpackPath] = src + '/'
      __webpack_public_path__ = window[config.webpackPath]
    }
  }
}
