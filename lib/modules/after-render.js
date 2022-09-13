const path = require('path')
const { file } = require('../core')

// 将读取到内存的文件写入目标文件夹
exports.afterRender = async (ctx) => {
  await Promise.all(ctx.files.map(async item => {
    const target = path.join(ctx.dest, item.path)
    await file.write(target, item.contents)
  }))

  if (ctx.config.afterRender == null) return

  await ctx.config.afterRender(ctx)
}
