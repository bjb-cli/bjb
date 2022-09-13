const path = require('path')
const semver = require('semver')
const prompts = require('prompts')
const validateName = require('validate-npm-package-name')
const { config } = require('../core')

exports.validater = {
  name: input => {
    const result = validateName(input)
    if (result.validForNewPackages) return true
    return result?.errors?.join(', ') || result?.warnings?.join(', ') || ''
  },
  version: input => {
    const valid = semver.valid(input)
    if (valid != null) return true
    return `The \`${input}\` is not a semantic version.`
  },
  email: input => {
    const valid = /[^\s]+@[^\s]+\.[^\s]+/.test(input)
    return valid || `The \`${input}\` is not a email address.`
  },
  url: input => {
    if (!input) return true
    const valid = /https?:\/\/[^\s]+/.test(input)
    return valid || `The \`${input}\` is not a url address.`
  }
}

// prompt模板自定义交互
exports.processor = (ctx) => (item, index) => {
  switch (item.name) {
    case 'name':
      item.validate = item.validate || this.validater.name
      item.initial = item.initial || path.basename(ctx.dest)
      break
    case 'version':
      item.validate = item.validate || this.validater.version
      item.initial = item.initial || config.npm?.['init-version'] || '0.1.0'
      break
    case 'author':
      item.initial = item.initial || config.npm?.['init-author-name'] || config.git?.user?.name
      break
    case 'email':
      item.validate = item.validate || this.validater.email
      item.initial = item.initial || config.npm?.['init-author-email'] || config.git?.user?.email
      break
    case 'url':
      item.validate = item.validate || this.validater.url
      item.initial = item.initial || config.npm?.['init-author-url'] || config.git?.user?.url
      break
    case 'install':
      if (ctx.options.install != null && ctx.options.install) {
        ctx.answers.install = true
        ctx.config.prompts.splice(index, 1)
      }
      break
  }
}

// 模板自定义交互
exports.mutual = async (ctx) => {
  // node >= v8.3.0
  console.clear()

  // 默认交互
  if (ctx.config.prompts == null) {
    ctx.config.prompts = {
      name: 'name',
      type: 'text',
      message: 'Project name'
    }
  }

  // 数组化prompts
  if (!Array.isArray(ctx.config.prompts)) {
    ctx.config.prompts = [ctx.config.prompts]
  }

  ctx.config.prompts.forEach(this.processor(ctx))

  // 将cli的argv来预先回答交互问题
  prompts.override(ctx.options)

  const onCancel = () => {
    throw new Error('You have cancelled this task.')
  }

  Object.assign(ctx.answers, await prompts(ctx.config.prompts, { onCancel }))
}
