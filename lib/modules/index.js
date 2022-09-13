/**
 * ready -- 命令参数准备
 * resolve -- 解析模板路径
 * rely -- 下载模板依赖
 * mutual -- 模板问题交互
 * setup -- 模板问题配置
 * beforeRender -- 读取内容并替换名称
 * render -- 渲染到目标文件夹
 * afterRender -- 渲染之后
 * install -- 安装渲染后本地模板依赖
 * init -- git初始化
 * fulfill -- 脚手架执行完毕
 */
const { ready } = require('./ready')
const { resolve } = require('./resolve')
const { rely } = require('./rely')
const { mutual } = require('./mutual')
const { setup } = require('./setup')
const { beforeRender } = require('./before-render')
const { render } = require('./render')
const { afterRender } = require('./after-render')
const { install } = require('./install')
const { init } = require('./init')
const { fulfill } = require('./fulfill')

exports.ready = ready
exports.resolve = resolve
exports.rely = rely
exports.mutual = mutual
exports.setup = setup
exports.beforeRender = beforeRender
exports.render = render
exports.afterRender = afterRender
exports.install = install
exports.init = init
exports.fulfill = fulfill
