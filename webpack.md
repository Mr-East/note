# Webpack

配置
webpack.config.js
- entry
- output
- module // 模块 loader处理其他资源
  - rules
- plugins
  - eslint等插件
- devServer
- mode
- devtool // sourcemap的方式 提升开发体验，报错源代码映射 
    - cheap-module-source-map // 只生成行级sourcemap
    - source-map // 生成行级sourcemap和列级sourcemap
## HMR（HotMouduleReplacement）热更新）
devServer.hot // 开启热更新

# 原理
- loader处理其他资源
loader本质就是一个函数，当webpack解析资源的时候，会调用相应的loader去处理
loader接受文件内容作为参数
content 文件内容
map SourceMap
meta 其他loader传递的参数
``` js
function(content,map,meta){
  return xxx
}
```