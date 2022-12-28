/*
 * @Author: xuxueliang
 * @Date: 2021-12-02 08:04:28
 * @LastEditTime: 2021-12-14 17:25:53
 * @LastEditors: xuxueliang
 * @Description:
 */
module.exports = {
  configureWebpack: {
    output: {
      filename: 'ztTools.js',
      chunkFilename: 'js/[chunkhash:16].js',
      libraryTarget: 'var',
      library: 'ztTools'
    },
    optimization: {
      /***/
      splitChunks: {
        maxInitialRequests: 1 // 最大初始化js数
      }
      /***/
    }
  },
  devServer: {
    disableHostCheck: true
  },
  css: {
    extract: false // 是否单独提取 css 文件
    // loaderOptions: {`
    //   sass: {
    //     // data: `@import "~@/packages/assets/style/scss/index.scss";` // sass-loader v8-
    //     prependData: '@import "~@/assets/style/scss/index.scss";' // sass-loader v8
    //     // additionalData: `@import "~@/packages/assets/style/scss/index.scss";`//sass-loader v10+
    //   }
    // }
  }
}
