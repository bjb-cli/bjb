const path = require('path')
// fast-glob是node.js非常快速和高效的glob库提供了遍历文件系统和返回路径名的方法
const glob = require('fast-glob')
const { file } = require('../core')

exports.rename = async (ctx) => {
  const regexp = /{(\w+)}/g

  ctx.files.forEach(file => {
    if (!regexp.test(file.path)) return

    file.path = file.path.replace(regexp, (_, key) => ctx.answers[key])
  })
}

exports.beforeRender = async (ctx) => {
  // ctx.answers = {
  //   name: 'nm',
  //   version: '0.1.0',
  //   description: 'Awesome node modules.',
  //   author: 'bjb-cli',
  //   email: 'dz_work_contact@163.com',
  //   url: '',
  //   license: 'MIT',
  //   github: 'bjb-cli',
  //   features: [ 'test', 'docs' ],
  //   install: true,
  //   pm: 'npm'
  // }
  const cwd = path.join(ctx.src, ctx.config.source || 'template')

  const filters = ctx.config.filters
  const ignore = filters != null ? Object.keys(filters).filter(i => !filters[i](ctx.answers)) : undefined

  const entries = await glob('**', { cwd, ignore, dot: true })

  await Promise.all(entries.map(async entry => {
    const contents = await file.read(path.join(cwd, entry))
    ctx.files.push({
      path: entry,
      contents
    })
  }))

  this.rename(ctx)

  if (ctx.config.beforeRender == null) return

  await ctx.config.beforeRender(ctx)
}
