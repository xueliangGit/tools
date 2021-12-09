# tools

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

## 工具使用

```js
  ztTools.use(['tools']).then(({tools})=>{
    if(!tools){
      return
    }
    // 执行工具相应方法即可 例如是个方法 tools({})
  })
```

## 增加工具

只需要在 **/src/tools** 目录添加以工具名为命名的文件夹。里面index.ts 为入口文件;

开发都是使用ts开发

```sh
  -tools
    -tool
      -index.ts
