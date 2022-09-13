const _ = require('lodash')
const { file } = require('../core')

// 渲染模板文件
exports.render = async (ctx) => {
  const regexp = /<%([\s\S]+?)%>/
  const imports = {
    ...ctx.config.metadata,
    ...ctx.config.helpers
  }

  ctx.files.forEach(item => {
    // 忽略二进制文件
    if (file.isBinary(item.contents)) return

    const text = item.contents.toString()

    // 忽略不需要渲染的模板
    if (!regexp.test(text)) return

    const compiled = _.template(text, { imports })

    const newContents = compiled(ctx.answers)
    item.contents = Buffer.from(newContents)
  })
}
