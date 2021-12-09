/*
 * @Author: xuxueliang
 * @Date: 2021-11-04 09:29:57
 * @LastEditTime: 2021-11-24 16:08:47
 * @LastEditors: xuxueliang
 * @Description:
 */
import { config } from './config'
let scriptNnums = 0
// 创建script标签
function cloneScript(v, src = '') {
  let script = { type: 'script' }
  let innerHTML
  if (v) {
    src = v.getAttribute('src')
    innerHTML = v.innerHTML
  }
  if (innerHTML) {
    script.content = innerHTML
  } else {
    script.src = src
  }
  return genScriptByObj(script)
}
// 加载依赖js
/*
deps=['src',{type:'style',src:'',context:''},{type:'script',src:'',context:''}]

*/
function loadDeps(head, deps, index = 0) {
  if (!deps[index]) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    let src = deps[index]
    if (typeof src === 'string') {
      src = { type: 'script', src: src }
    }
    let dep = genDepsEl(src)
    if (dep.needWait) {
      dep.onload = () => {
        loadDeps(head, deps, index + 1).then(resolve)
      }
      dep.error = reject
      head.append(dep)
    } else {
      head.append(dep)
      loadDeps(head, deps, index + 1).then(resolve)
    }
  })
}
function genDepsEl(dep) {
  switch (dep.type) {
    case 'style':
      return genStyleByObj(dep)
    case 'script':
    default:
      return genScriptByObj(dep)
  }
}
function genScriptByObj(dep) {
  let script = document.createElement('script')
  if (dep.content) {
    script.innerHTML = dep.content
  } else if (dep.src) {
    script.src = dep.src
    script.needWait = true
  }
  return script
}
function genStyleByObj(dep) {
  let style
  if (dep.src) {
    // link
    style = document.createElement('link')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('type', 'text/css')
    style.setAttribute('href', dep.src)
    return style
  }
  style = document.createElement('style')
  style.innerHTML = style.content
  return style
}
export function initDom(app, { deps = [], target = 'iframe' } = {}) {
  let flag = config.flag
  let pluginName = config.pluginName
  return new Promise((resolve, reject) => {
    if (target === 'iframe') {
      let iframe = document.createElement('iframe')
      let height = app.clientHeight ? app.clientHeight + 'px' : '100%'
      iframe.setAttribute(
        'style',
        `width:100%;height:${height};border: 0;max-height:100%;min-height:100%`
      )
      iframe.width = '100%'
      iframe.height = height
      iframe.frameBorder = '0'
      iframe.id = 'iframe-sdk'
      let div = document.createElement('div')
      div.id = 'app'
      iframe.src = '#'
      app.appendChild(iframe)
      iframe.contentDocument.open()
      iframe.contentDocument.write(
        `<html><head></head><body class='theme-pink-red '></body></html>`
      )
      iframe.contentDocument.close()
      var onload = async () => {
        let contentDocument = iframe.contentDocument
        contentDocument.body.appendChild(div)
        if (deps && deps.length) {
          await loadDeps(contentDocument.head, deps)
        }
        Array.prototype.forEach.call(document.scripts, async (v) => {
          if (
            v.getAttribute(flag) !== null ||
            (config.srcReg && config.srcReg.test(v.getAttribute('src')))
          ) {
            let vv = cloneScript(v)
            if (vv.src) {
              scriptNnums++
            }
            vv.setAttribute(flag, '')
            if (vv.src) {
              vv.onload = () => {
                loadScripted(iframe, resolve, div, pluginName)
              }
              vv.onerror = reject
            }
            contentDocument.head.appendChild(vv)
          }
        })
        if (scriptNnums === 0) {
          resolve({
            cjtApp: iframe.contentWindow[pluginName],
            app: div,
            iframe: iframe
          })
        }
      }
      onload()
    } else {
      if (deps && deps.length) {
        loadDeps(document.head, deps).then(() => {
          resolve({ cjtApp: window[pluginName], app: app, iframe: null })
        })
      } else {
        resolve({ cjtApp: window[pluginName], app: app, iframe: null })
      }
    }
  })
}
function loadScripted(iframe, resolve, div, pluginName) {
  if (--scriptNnums === 0) {
    resolve({
      cjtApp: iframe.contentWindow[pluginName],
      app: div,
      iframe: iframe
    })
  }
}
export const initIframe = (app) => {
  let iframe = document.createElement('iframe')
  iframe.setAttribute('style', 'width:100%;height:100%;border: 0;')
  iframe.id = 'iframe-sdk'
  let div = document.createElement('div')
  div.id = 'app'
  iframe.src = '#'
  app.appendChild(iframe)
  iframe.contentDocument.open()
  iframe.contentDocument.write(
    `<html><head></head><body class='theme-pink-red '></body></html>`
  )
  iframe.contentDocument.close()
  iframe.contentDocument.body.appendChild(div)
  return { iframe, app: div }
}
