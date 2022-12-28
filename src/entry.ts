/*
 * @Author: xuxueliang
 * @Date: 2021-12-01 16:58:20
 * @LastEditTime: 2021-12-09 10:27:16
 * @LastEditors: xuxueliang
 * @Description:
 */
import { setConfig, initWebpackPath } from './lib/config'
interface Tools {
  use(toolsNames: string[] | string): Promise<any>
  [propName: string]: any;
}
setConfig({
  srcReg: 'ztTools.js',
  webpackPath: '_ztTools_path_'
})
initWebpackPath()
const exportObj: Tools = {
  async use(toolsNames) {
    if (!Array.isArray(toolsNames)) {
      toolsNames = [toolsNames];
    }
    await Promise.all(
      toolsNames.map((v) => import(`./tools/${v}/index.ts`).then((res) => {
        exportObj[v] = res.default || res
      }).catch(() => {
        console.log('Tools:', v, '不存在')
      })
      )
    )
    return await Promise.resolve(this)
  }
}
export default exportObj
